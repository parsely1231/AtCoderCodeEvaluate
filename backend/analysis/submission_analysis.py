import gzip
import io
import json
import logging
import os
import time
from typing import Dict

import pandas as pd
import requests


SUBMISSION_URL = "https://s3-ap-northeast-1.amazonaws.com/kenkoooo/submissions.csv.gz"
PROBLEM_URL = "https://kenkoooo.com/atcoder/resources/problems.json"
CSV_ROOT = "./csv"
EXEC_STATICS_FILE_NAME = "exec_border"
LENGTH_STATICS_FILE_NAME = "length_border"
EXEC = "execution_time"
LENGTH = "length"


formatter = "%(asctime)s:%(message)s"
logging.basicConfig(level=logging.INFO, format=formatter)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
h = logging.FileHandler("submission_analysis.log")
logger.addHandler(h)


def log(message: Dict):
    def decorate(func):
        def wrapped_func(*args, **kwargs):
            start = time.time()
            run = {"status": "run"}
            logger.info(dict(**message, **run))

            res = func(*args, **kwargs)

            spend = time.time() - start
            end = {"status": "success", "spend_second": spend}
            logger.info(dict(**message, **end))

            return res

        return wrapped_func
    return decorate


@log({"action": "get problems API"})
def get_problems_df(problem_url):
    headers = {"content-type": "application/json"}

    response = requests.get(problem_url, headers=headers)
    logger.info({"response-status": response.status_code})
    problems_json = response.json()
    problems_df = pd.read_json(json.dumps(problems_json))
    return problems_df


@log({"action": "make contests data frame"})
def make_contests_df(problems):
    contests = problems['contest_id'].unique()
    types = []

    for contest in contests:
        initial = contest[:3]
        contest_type = 5
        if initial == 'abc':
            contest_type = 1
        elif initial == 'arc':
            contest_type = 2
        elif initial == 'agc':
            contest_type = 3
        else:
            contest_type = 4

        types.append(contest_type)

    contests_df = pd.DataFrame({'id': contests, 'type': types})
    return contests_df


@log({"action": "get submission.csv.tz"})
def get_submission_df(submission_url):
    need_columns = ['user_id', 'problem_id', 'language', 'execution_time', 'length', 'result']
    response = requests.get(submission_url)

    if response.status_code == 200:
        gzip_file = io.BytesIO(response.content)
        with gzip.open(gzip_file, 'rt') as f:
            submission_df = pd.read_csv(f, usecols=need_columns)

        return submission_df

    else:
        logger.critical({
            "action": "get submission.csv.gz",
            "url": submission_url,
            "status": "fail",
            "response-status": response.status_code
        })
        exit()


@log({"action": "calc status border"})
def calc_quantiles(lang_prob_group, status_type: str):
    """
    :param lang_prob_group: pandas data frame grouped by "language" and "problem_id"
    :param status_type: "execution_time" or "length"
    :return: status quantiles data frame
    """
    statistics = lang_prob_group.quantile(0.1, interpolation='higher').rename(columns={status_type: '10%'})
    statistics['25%'] = lang_prob_group.quantile(0.25, interpolation='higher')[status_type]
    statistics['50%'] = lang_prob_group.quantile(0.50, interpolation='higher')[status_type]
    statistics['75%'] = lang_prob_group.quantile(0.75, interpolation='higher')[status_type]

    return statistics


@log({"action": "split save"})
def split_save(df, row_size, base_file_name):
    n = len(df)
    dfs = [df.loc[i:i + row_size - 1, :] for i in range(0, n, row_size)]
    for num, df in enumerate(dfs, 1):
        df.to_csv(f'{CSV_ROOT}/{base_file_name}{num}.csv', header=False, index=False)


def make_key_from_language_and_problem(statistics: pd.DataFrame):
    statistics["keys"] = statistics["language"] + statistics["problem_id"]


@log({"action": "make border dict"})
def convert_df_to_dict(statistics: pd.DataFrame):
    make_key_from_language_and_problem(statistics)
    border_dict = statistics.set_index("keys")\
                            .drop(['language', 'problem_id'], axis=1)\
                            .to_dict(orient="index")
    return border_dict


def get_score_by_border(value, border):
    if value <= border['10%']:
        return 5

    elif value <= border['25%']:
        return 4

    elif value <= border['50%']:
        return 3

    elif value <= border['75%']:
        return 2

    else:
        return 1


def make_user_info(submissions: pd.DataFrame):
    list_for_user_info = ['user_id', 'problem_id', 'language', LENGTH, EXEC]
    pre_user_info = submissions[list_for_user_info]
    group_user_lang_prob = pre_user_info.groupby(['user_id', 'language', 'problem_id'], as_index=False)
    user_info = group_user_lang_prob.min()
    return user_info


def make_user_info_keys(info: pd.DataFrame):
    info["keys"] = info["language"] + info["problem_id"]


def combine_keys_and_status(info: pd.DataFrame):
    info["keys_length"] = info["keys"] + "&" + info[LENGTH].astype("str")
    info["keys_exec"] = info["keys"] + "&" + info[EXEC].astype('str')


def create_calc_func(border_dict):
    def calculate_score(key_value):
        key, value = key_value.split('&')
        value = int(value)
        border = border_dict[key]
        score = get_score_by_border(value, border)
        return score
    return calculate_score


@log({"action": "calc user score"})
def calc_user_scores(submissions, length_statistics, exec_statistics):
    user_info = make_user_info(submissions)
    make_user_info_keys(user_info)
    combine_keys_and_status(user_info)

    length_border_dict = convert_df_to_dict(length_statistics)
    exec_border_dict = convert_df_to_dict(exec_statistics)

    calc_exec_score = create_calc_func(exec_border_dict)
    calc_length_score = create_calc_func(length_border_dict)

    length_scores = user_info['keys_length'].map(calc_length_score)
    exec_scores = user_info['keys_exec'].map(calc_exec_score)

    user_info['length_score'] = length_scores
    user_info['exec_score'] = exec_scores

    user_status = user_info.loc[:, ['user_id', 'language', 'length_score', 'exec_score']]

    user_scores = user_status.groupby(['user_id', 'language'], as_index=False).sum()
    user_ac_count = user_status.groupby(['user_id', 'language'], as_index=False).count()

    user_scores['ac_count'] = user_ac_count['length_score'].values
    user_scores['length_ave'] = user_scores['length_score'] / user_scores['ac_count']
    user_scores['exec_ave'] = user_scores['exec_score'] / user_scores['ac_count']

    return user_scores


os.makedirs(CSV_ROOT, exist_ok=True)


problems = get_problems_df(PROBLEM_URL)
problems.to_csv(f"{CSV_ROOT}/problems.csv", header=False, index=False)


contests_df = make_contests_df(problems)
contests_df.to_csv(f'{CSV_ROOT}/contests.csv', header=False, index=False)


submission_df = get_submission_df(SUBMISSION_URL)
submission_df = submission_df.dropna()
submission_df = submission_df.astype({EXEC: 'int32'})


problems_list = problems["id"].to_list()
problem_filter = submission_df["problem_id"].isin(problems_list)
submission_df = submission_df[problem_filter]
data_ac = submission_df[submission_df['result'] == 'AC']


list_for_exec = ['problem_id', 'language', EXEC]
list_for_leng = ['problem_id', 'language', LENGTH]

data_exec = data_ac[list_for_exec]
data_leng = data_ac[list_for_leng]


group_lang_prob_exec = data_exec.groupby(['language', 'problem_id'], as_index=False)
exec_statistics = calc_quantiles(group_lang_prob_exec, status_type=EXEC)
split_save(exec_statistics, row_size=50000, base_file_name=EXEC_STATICS_FILE_NAME)


group_lang_prob_leng = data_leng.groupby(['language', 'problem_id'], as_index=False)
length_statistics = calc_quantiles(group_lang_prob_leng, status_type=LENGTH)
split_save(length_statistics, row_size=50000, base_file_name=LENGTH_STATICS_FILE_NAME)


user_scores = calc_user_scores(data_ac, length_statistics, exec_statistics)
split_save(user_scores, 50000, "user_rankings")

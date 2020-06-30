import gzip
import io
import json
import logging
import os
import time
from typing import Dict

import pandas as pd
import requests


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


@ log({"action": "calc status border"})
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


def split_save(df, row_size, base_file_name):
    n = len(df)
    dfs = [df.loc[i:i + row_size - 1, :] for i in range(0, n, row_size)]
    for num, df in enumerate(dfs, 1):
        df.to_csv(f'{CSV_ROOT}/{base_file_name}{num}.csv', header=False, index=False)


SUBMISSION_URL = "https://s3-ap-northeast-1.amazonaws.com/kenkoooo/submissions.csv.gz"
PROBLEM_URL = "https://kenkoooo.com/atcoder/resources/problems.json"
CSV_ROOT = "./csv"
EXEC_STATICS_FILE_NAME = "exec_border"
LENGTH_STATICS_FILE_NAME = "length_border"

os.makedirs(CSV_ROOT, exist_ok=True)


problems = get_problems_df(PROBLEM_URL)
problems.to_csv(f"{CSV_ROOT}/problems.csv", header=False, index=False)


contests_df = make_contests_df(problems)
contests_df.to_csv(f'{CSV_ROOT}/contests.csv', header=False, index=False)


submission_df = get_submission_df(SUBMISSION_URL)
submission_df = submission_df.dropna()
submission_df = submission_df.astype({'execution_time': 'int32'})


problems_list = problems["id"].to_list()
problem_filter = submission_df["problem_id"].isin(problems_list)
submission_df = submission_df[problem_filter]
data_ac = submission_df[submission_df['result'] == 'AC']


list_for_exec = ['problem_id', 'language', 'execution_time']
list_for_leng = ['problem_id', 'language', 'length']
data_exec = data_ac[list_for_exec]
data_leng = data_ac[list_for_leng]


group_lang_prob_exec = data_exec.groupby(['language', 'problem_id'], as_index=False)
exec_statistics = calc_quantiles(group_lang_prob_exec, status_type="execution_time")
split_save(exec_statistics, row_size=50000, base_file_name=EXEC_STATICS_FILE_NAME)


group_lang_prob_leng = data_leng.groupby(['language', 'problem_id'], as_index=False)
length_statistics = calc_quantiles(group_lang_prob_leng, status_type="length")
split_save(length_statistics, row_size=50000, base_file_name=LENGTH_STATICS_FILE_NAME)


# User Score
def calc_user_score():
    """TODO ユーザースコアの計算を関数化して綺麗にする"""
    pass


logger.info({
    "action": "calc user scores",
    "status": "run"
})
user_score_calu_start = time.time()

length_statistics['keys'] = length_statistics['language'] + length_statistics['problem_id']
length_border_dict = length_statistics.set_index('keys')\
                                      .drop(['language', 'problem_id'], axis=1)\
                                      .to_dict(orient='index')

exec_statistics['keys'] = exec_statistics['language'] + exec_statistics['problem_id']
exec_border_dict = exec_statistics.set_index('keys').drop(['language', 'problem_id'], axis=1).to_dict(orient='index')


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


list_for_user_info = ['user_id', 'problem_id', 'language', 'length', 'execution_time']
pre_user_info = data_ac[list_for_user_info]

group_user_lang_prob = pre_user_info.groupby(['user_id', 'language', 'problem_id'], as_index=False)
user_info = group_user_lang_prob.min()


user_info['keys'] = user_info['language'] + user_info['problem_id']

user_info['keys_length'] = user_info['keys'] + '&' + user_info['length'].astype('str')
user_info['keys_exec'] = user_info['keys'] + '&' + user_info['execution_time'].astype('str')


def create_calcu_func(border_dict):
    def calcurate_score(key_value):
        key, value = key_value.split('&')
        value = int(value)
        border = border_dict[key]
        score = get_score_by_border(value, border)
        return score
    return calcurate_score


calcu_exec_score = create_calcu_func(exec_border_dict)
calcu_length_score = create_calcu_func(length_border_dict)

logger.info({
    "action": "calc user scores",
    "status": "prepare success",
    "spend-second": time.time() - user_score_calu_start
})

prepare_end = time.time()

length_scores = user_info['keys_length'].map(calcu_length_score)
exec_scores = user_info['keys_exec'].map(calcu_exec_score)

logger.info({
    "action": "calc user scores",
    "status": "success",
    "spend-second": time.time() - prepare_end
})

user_info['length_score'] = length_scores
user_info['exec_score'] = exec_scores


user_status = user_info.loc[:, ['user_id', 'language', 'length_score', 'exec_score']]

user_scores = user_status.groupby(['user_id', 'language'], as_index=False).sum()
user_ac_count = user_status.groupby(['user_id', 'language'], as_index=False).count()


user_scores['ac_count'] = user_ac_count['length_score'].values
user_scores['length_ave'] = user_scores['length_score'] / user_scores['ac_count']
user_scores['exec_ave'] = user_scores['exec_score'] / user_scores['ac_count']


n = len(user_scores)
k = 50000
user_scores_dfs = [user_scores.loc[i:i+k-1, :] for i in range(0, n, k)]

for num, user_scores_df in enumerate(user_scores_dfs, 1):
    user_scores_df.drop(['length_ave', 'exec_ave'], axis=1).to_csv(f'{CSV_ROOT}/user_rankings{num}.csv',
                                                                   index=False, header=False)

import gzip
import io
import json
import pandas as pd
import requests

CSV_ROOT = "./csv_files"

# Problems
headers = {"content-type": "application/json"}
problem_url = "https://kenkoooo.com/atcoder/resources/problems.json"
response = requests.get(problem_url, headers=headers)
problems_json = response.json()
problems = pd.read_json(json.dumps(problems_json))

problems.to_csv(f"{CSV_ROOT}/problems.csv", header=False, index=False)

# Contests
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


contests_data = pd.DataFrame({'id': contests, 'type': types})
contests_data.to_csv(f'{CSV_ROOT}/contests.csv', header=False, index=False)

# Get Submission Data
SUBMISSION_URL = "https://s3-ap-northeast-1.amazonaws.com/kenkoooo/submissions.csv.gz"
need_columns = ['user_id', 'problem_id', 'language', 'execution_time', 'length', 'result']

response = requests.get(SUBMISSION_URL)
if response.status_code == 200:
    gzip_file = io.BytesIO(response.content)
    with gzip.open(gzip_file, 'rt') as f:
        data = pd.read_csv(f, usecols=need_columns)

data = data.dropna()
data = data.astype({'execution_time': 'int32'})

problems_list = problems["id"].to_list()
problem_filter = data["problem_id"].isin(problems_list)
data = data[problem_filter]
data_ac = data[data['result'] == 'AC']

# Exec and Length Status
list_for_exec = ['problem_id', 'language', 'execution_time']
list_for_leng = ['problem_id', 'language', 'length']
data_exec = data_ac[list_for_exec]
data_leng = data_ac[list_for_leng]


# Exec
group_prob_lang_exec = data_exec.groupby(['language', 'problem_id'], as_index=False)

exec_statistics = group_prob_lang_exec.quantile(0.1, interpolation='higher').rename(columns={'execution_time': '10%'})
exec_statistics['25%'] = group_prob_lang_exec.quantile(0.25, interpolation='higher')['execution_time']
exec_statistics['50%'] = group_prob_lang_exec.quantile(0.50, interpolation='higher')['execution_time']
exec_statistics['75%'] = group_prob_lang_exec.quantile(0.75, interpolation='higher')['execution_time']


n = len(exec_statistics)
k = 50000

exec_dfs = [exec_statistics.loc[i:i+k-1, :] for i in range(0, n, k)]

for num, exec_df in enumerate(exec_dfs, 1):
    exec_df.to_csv(f'{CSV_ROOT}/exec_statistics{num}.csv', header=False, index=False)


# Length
group_prob_lang_leng = data_leng.groupby(['language', 'problem_id'], as_index=False)

length_statistics = group_prob_lang_leng.quantile(0.1, interpolation='higher').rename(columns={'length': '10%'})
length_statistics['25%'] = group_prob_lang_leng.quantile(0.25, interpolation='higher')['length']
length_statistics['50%'] = group_prob_lang_leng.quantile(0.50, interpolation='higher')['length']
length_statistics['75%'] = group_prob_lang_leng.quantile(0.75, interpolation='higher')['length']


n = len(length_statistics)
k = 50000

length_dfs = [length_statistics.loc[i:i+k-1, :] for i in range(0, n, k)]

for num, length_df in enumerate(length_dfs, 1):
    length_df.to_csv(f'./csv_files/length_statistics{num}.csv', header=False, index=False)


# User Score
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


length_scores = user_info['keys_length'].map(calcu_length_score)
exec_scores = user_info['keys_exec'].map(calcu_exec_score)


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

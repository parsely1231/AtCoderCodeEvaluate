import pandas as pd


problems = pd.read_json('./problems.json')
problems.to_csv('./problems.csv', header=False, index=False)

contests = problems['contest_id'].unique()

types = []
for contest in contests:
    initial = contest[:3]
    contest_type = ''
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
contests_data.to_csv('./contests.csv', header=False, index=False)


data = pd.read_csv('./submissions.csv')
data = data.dropna()
data = data.astype({'execution_time': 'int32'})

# scale down for local test
data = data.iloc[:100000, :]
data_ac = data[data['result'] == 'AC']

list_for_exec = ['problem_id', 'language', 'execution_time']
list_for_leng = ['problem_id', 'language', 'length']
data_exec = data_ac[list_for_exec]
data_leng = data_ac[list_for_leng]

group_prob_lang_exec = data_exec.groupby(['language', 'problem_id'])
group_prob_lang_leng = data_leng.groupby(['language', 'problem_id'])

exec_statistics = group_prob_lang_exec.min().rename(columns={'execution_time': 'min'})
exec_statistics_10 = group_prob_lang_exec.quantile(0.1, interpolation='higher')
exec_statistics_25 = group_prob_lang_exec.quantile(0.25, interpolation='higher')
exec_statistics_50 = group_prob_lang_exec.quantile(0.50, interpolation='higher')
exec_statistics_75 = group_prob_lang_exec.quantile(0.75, interpolation='higher')

exec_statistics['10%'] = exec_statistics_10['execution_time']
exec_statistics['25%'] = exec_statistics_25['execution_time']
exec_statistics['50%'] = exec_statistics_50['execution_time']
exec_statistics['75%'] = exec_statistics_75['execution_time']

exec_statistics.drop('min', axis=1).to_csv('./exec_statistics.csv', header=False)


length_statistics = group_prob_lang_leng.min().rename(columns={'length': 'min'})
length_statistics_10 = group_prob_lang_leng.quantile(0.1, interpolation='higher')
length_statistics_25 = group_prob_lang_leng.quantile(0.25, interpolation='higher')
length_statistics_50 = group_prob_lang_leng.quantile(0.50, interpolation='higher')
length_statistics_75 = group_prob_lang_leng.quantile(0.75, interpolation='higher')

length_statistics['10%'] = length_statistics_10['length']
length_statistics['25%'] = length_statistics_25['length']
length_statistics['50%'] = length_statistics_50['length']
length_statistics['75%'] = length_statistics_75['length']

length_statistics.drop('min', axis=1).to_csv('./length_statistics.csv', header=False)


list_for_user_info = ['user_id', 'problem_id', 'language', 'length', 'execution_time']
pre_user_info = data_ac[list_for_user_info]

group_user_lang_prob = pre_user_info.groupby(['user_id', 'language', 'problem_id'], as_index=False)


user_info = group_user_lang_prob.min()


def get_score(value, border):
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


length_scores = []
exec_scores = []

for idx, row in user_info.iterrows():
    language = row['language']
    problem_id = row['problem_id']
    length = row['length']
    exec_time = row['execution_time']

    length_border = length_statistics.loc[language, problem_id]
    exec_border = exec_statistics.loc[language, problem_id]

    length_score = get_score(length, length_border)
    exec_score = get_score(exec_time, exec_border)

    length_scores.append(length_score)
    exec_scores.append(exec_score)

user_info['length_score'] = length_scores
user_info['exec_score'] = exec_scores

user_status = user_info.loc[:, ['user_id', 'language', 'length_score', 'exec_score']]

user_scores = user_status.groupby(['user_id', 'language'], as_index=False).sum()
user_ac_count = user_status.groupby(['user_id', 'language'], as_index=False).count()

user_scores['ac_count'] = user_ac_count['length_score'].values

user_scores.to_csv('./user_rankings.csv', index=False, header=False)

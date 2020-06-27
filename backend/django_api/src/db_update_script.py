import csv
import os

from api import models, views


CSV_ROOT = "./csv/"

"""
update DB by csv file

python3 manage.py shell
import db_update_script
"""


def delete_all_objects(Model):
    objects = Model.objects.all()
    objects.delete()


def save_objects(path, save_method):
    with open(path) as f:
        reader = csv.reader(f)
        save_method(reader)


def update_contests():
    delete_all_objects(models.Contest)
    contests_path = f"{CSV_ROOT}/contests.csv"
    save_objects(contests_path, views.contest_csv_save)


def update_problems():
    delete_all_objects(models.Problem)

    problems_path = f"{CSV_ROOT}/problems.csv"
    save_objects(problems_path, views.problem_csv_save)


def update_exec_status():
    delete_all_objects(models.ExecTimeStatus)

    for num in range(1, 50):
        exec_status_path = f"{CSV_ROOT}/exec_border{num}.csv"
        if not os.path.isfile(exec_status_path):
            break

        save_objects(exec_status_path, views.exec_status_csv_save)


def update_code_size_status():
    delete_all_objects(models.CodeSizeStatus)

    for num in range(1, 50):
        code_size_status_path = f"{CSV_ROOT}/length_border{num}.csv"
        if not os.path.isfile(code_size_status_path):
            break

        save_objects(code_size_status_path, views.code_size_status_csv_save)


def update_rankings():
    delete_all_objects(models.UserRankingStatus)

    for num in range(1, 50):
        user_rankings_path = f"{CSV_ROOT}/user_rankings{num}.csv"
        if not os.path.isfile(user_rankings_path):
            break

        save_objects(user_rankings_path, views.user_ranking_status_csv_save)


update_contests()
update_problems()
update_exec_status()
update_code_size_status()
update_rankings()

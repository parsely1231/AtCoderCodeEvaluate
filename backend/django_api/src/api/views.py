from django_filters import rest_framework as filters
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from django.shortcuts import render
import csv
from io import TextIOWrapper

from .models import Problem, CodeSizeStatus, ExecTimeStatus, UserRankingStatus, Contest
from .serializers import ProblemSerializer, CodeSizeStatusSerializer, ExecTimeStatusSerializer, \
    UserRankingStatusSerializer


class ProblemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['contest_id__type']


class CodeSizeStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CodeSizeStatus.objects.all()
    serializer_class = CodeSizeStatusSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['language']


class ExecTimeStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExecTimeStatus.objects.all()
    serializer_class = ExecTimeStatusSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['language']


class UserRankingFilter(filters.FilterSet):
    order_by = filters.OrderingFilter(
            fields=(
                ('code_size_points', 'code_size_points'),
                ('exec_time_points', 'exec_time_points'),
            ),
        )

    language = filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = UserRankingStatus
        fields = ['order_by', 'language', 'user_name']


class UserRankingStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserRankingStatus.objects.all()
    serializer_class = UserRankingStatusSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = UserRankingFilter


@login_required
def csv_upload(request):
    if 'csv' in request.FILES:
        form_data = TextIOWrapper(request.FILES['csv'].file, encoding='utf-8')
        csv_file = csv.reader(form_data)
        data_type = request.POST['type']
        save_handler = {
            'contest': contest_csv_save,
            'problem': problem_csv_save,
            'exec_status': exec_status_csv_save,
            'code_size_status': code_size_status_csv_save,
            'user_ranking_status': user_ranking_status_csv_save
        }
        save_function = save_handler[data_type]
        save_function(csv_file)

        return render(request, 'api/upload.html')

    else:
        return render(request, 'api/upload.html')


def exec_status_csv_save(csv_file):
    exec_time_status_list = []
    for line in csv_file:
        language, problem_id, rank_a, rank_b, rank_c, rank_d = line
        exec_time_status = ExecTimeStatus(
            language=language,
            problem_id=Problem(problem_id=problem_id),
            rank_a=rank_a,
            rank_b=rank_b,
            rank_c=rank_c,
            rank_d=rank_d,
        )
        exec_time_status_list.append(exec_time_status)

    ExecTimeStatus.objects.bulk_create(exec_time_status_list)


def code_size_status_csv_save(csv_file):
    code_size_status_list = []
    for line in csv_file:
        language, problem_id, rank_a, rank_b, rank_c, rank_d = line
        code_size_status = CodeSizeStatus(
            language=language,
            problem_id=Problem(problem_id=problem_id),
            rank_a=rank_a,
            rank_b=rank_b,
            rank_c=rank_c,
            rank_d=rank_d,
        )
        code_size_status_list.append(code_size_status)

    CodeSizeStatus.objects.bulk_create(code_size_status_list)


def problem_csv_save(csv_file):
    problems = []
    for line in csv_file:
        problem_id, title, contest_id = line
        problem = Problem(
            problem_id=problem_id,
            title=title,
            contest_id=Contest(contest_id=contest_id)
        )
        problems.append(problem)

    Problem.objects.bulk_create(problems)


def contest_csv_save(csv_file):
    contests = []
    for line in csv_file:
        contest_id, type = line
        contest = Contest(contest_id=contest_id, type=type)
        contests.append(contest)

    Contest.objects.bulk_create(contests)


def user_ranking_status_csv_save(csv_file):
    user_ranking_status_list = []
    for line in csv_file:
        user_name, language, ac_count, code_size_points, exec_time_points = line
        user_ranking_status = UserRankingStatus(
            user_name=user_name,
            language=language,
            ac_count=ac_count,
            code_size_points=code_size_points,
            exec_time_points=exec_time_points
        )
        user_ranking_status_list.append(user_ranking_status)

    UserRankingStatus.objects.bulk_create(user_ranking_status_list)

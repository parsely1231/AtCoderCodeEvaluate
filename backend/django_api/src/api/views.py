from django_filters import rest_framework as filters
from rest_framework import viewsets
from django.shortcuts import render
import csv
from io import TextIOWrapper

from .models import Problem, CodeSizeStatus, ExecTimeStatus, UserRankingStatus
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


def exec_time_status_upload(request):
    if 'csv' in request.FILES:
        form_data = TextIOWrapper(request.FILES['csv'].file, encoding='utf-8')
        csv_file = csv.reader(form_data)

        exec_time_status_list = []
        for line in csv_file:
            language, problem_id, rank_a, rank_b, rank_c, rank_d = line
            exec_time_status = ExecTimeStatus(
                language=language,
                problem_id=problem_id,
                rank_a=rank_a,
                rank_b=rank_b,
                rank_c=rank_c,
                rank_d=rank_d,
            )
            exec_time_status_list.append(exec_time_status)

        ExecTimeStatus.objects.bulk_create(exec_time_status_list)

        return render(request, 'api/upload.html')

    else:
        return render(request, 'api/upload.html')

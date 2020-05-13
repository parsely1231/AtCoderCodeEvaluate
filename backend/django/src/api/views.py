from django_filters import rest_framework as filters
from rest_framework import viewsets

from .models import Problem, CodeSizeStatus, ExecTimeStatus, UserRankingStatus
from .serializers import ProblemSerializer, CodeSizeStatusSerializer, ExecTimeStatusSerializer, \
    UserRankingStatusSerializer


class FilterA(filters.FilterSet):
    contest_type = filters.CharFilter(field_name='contest_id.type')


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

from rest_framework import serializers

from .models import Problem, CodeSizeStatus, ExecTimeStatus, UserRankingStatus


class ProblemSerializer(serializers.ModelSerializer):
    contest_type = serializers.ReadOnlyField(source='contest_id.get_type_display')

    class Meta:
        model = Problem
        fields = ['problem_id', 'title', 'contest_id', 'contest_type']


class CodeSizeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSizeStatus
        exclude = ['id']


class ExecTimeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecTimeStatus
        exclude = ['id']


class UserRankingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRankingStatus
        exclude = ['id']

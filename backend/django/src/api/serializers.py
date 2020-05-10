from rest_framework import serializers

from .models import Problem, CodeSizeStatus, ExecTimeStatus, UserRankingStatus


class ProblemSerializer(serializers.ModelSerializer):
    contest_type = serializers.ReadOnlyField(source='contest_id.type')

    class Meta:
        model = Problem
        fields = ['problem_id', 'title', 'contest_id', 'contest_type']


class CodeSizeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSizeStatus
        fields = '__all__'


class CodeSizeStatusListSerializer(serializers.ListSerializer):
    child = CodeSizeStatusSerializer()


class ExecTimeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecTimeStatus
        fields = '__all__'


class ExecTimeStatusListSerializer(serializers.ListSerializer):
    child = ExecTimeStatusSerializer()


class UserRankingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRankingStatus
        fields = '__all__'


class UserRankingStatusListSerializer(serializers.ListSerializer):
    child = UserRankingStatusSerializer()

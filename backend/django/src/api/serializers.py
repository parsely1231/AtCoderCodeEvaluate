from rest_framework import serializers

from .models import Problem


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['problem_id', 'title', 'contest_id', 'exec_time', 'code_size']

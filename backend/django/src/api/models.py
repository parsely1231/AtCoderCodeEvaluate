from django.db import models


class Problem(models.Model):
    class Meta:
        db_table = 'problems'

    problem_id = models.CharField(primary_key=True, max_length=20)
    title = models.CharField(max_length=40)
    contest_id = models.CharField(max_length=20)

    def __str__(self):
        return self.problem_id


class Contest(models.Model):
    TYPES = [
        (1, 'ABC'),
        (2, 'ARC'),
        (3, 'AGC'),
        (4, 'rated-Others'),
        (5, 'unrated-Others'),
        (6, 'PAST'),
        (7, 'Marathon')
    ]

    class Meta:
        db_table = 'contests'

    contest_id = models.CharField(primary_key=True, max_length=15)
    type = models.IntegerField(choices=TYPES)

    def __str__(self):
        return self.contest_id


class CodeSizeStatus(models.Model):
    class Meta:
        db_table = 'code_size_statuses'
        unique_together = (('problem_id', 'language'),)

    problem_id = models.ForeignKey(Problem, on_delete=models.CASCADE)
    language = models.CharField(max_length=20)
    rank_a = models.IntegerField()
    rank_b = models.IntegerField()
    rank_c = models.IntegerField()
    rank_d = models.IntegerField()

    def __str__(self):
        return f'{self.problem_id}: {self.language}'


class ExecTimeStatus(models.Model):
    class Meta:
        db_table = 'exec_time_statuses'
        unique_together = (('problem_id', 'language'),)

    problem_id = models.ForeignKey(Problem, on_delete=models.CASCADE)
    language = models.CharField(max_length=20)
    rank_a = models.IntegerField()
    rank_b = models.IntegerField()
    rank_c = models.IntegerField()
    rank_d = models.IntegerField()

    def __str__(self):
        return f'{self.problem_id}: {self.language}'


class UserRankingStatus(models.Model):
    class Meta:
        db_table = 'user_ranking_statuses'
        unique_together = (('user_name', 'language'),)

    user_name = models.CharField(max_length=40)
    language = models.CharField(max_length=20)
    ac_count = models.IntegerField()
    code_size_points = models.IntegerField()
    exec_time_points = models.IntegerField()

    def __str__(self):
        return f'{self.user_name}: {self.language}'

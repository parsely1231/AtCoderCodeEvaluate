from django.db import models


class Problem(models.Model):
    CONTEST_TYPES = ((1, 'ABC'), (2, 'ARC'), (3, 'AGC'), (4, 'Others-Rated'), (5, 'Others-Unrated'))

    class Meta:
        db_table = 'problem'

    problem_id = models.CharField(primary_key=True, max_length=20)
    title = models.CharField(max_length=40)
    contest_id = models.CharField(max_length=20)
    contest_type = models.IntegerField(choices=CONTEST_TYPES)
    exec_time = models.IntegerField()
    code_size = models.IntegerField()

    def __str__(self):
        return self.problem_id

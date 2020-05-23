# Generated by Django 3.0.6 on 2020-05-10 05:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contest',
            fields=[
                ('contest_id', models.CharField(max_length=15, primary_key=True, serialize=False)),
                ('type', models.IntegerField(choices=[(1, 'ABC'), (2, 'ARC'), (3, 'AGC'), (4, 'rated-Others'), (5, 'unrated-Others'), (6, 'PAST'), (7, 'Marathon')])),
            ],
            options={
                'db_table': 'contests',
            },
        ),
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('problem_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=40)),
                ('contest_id', models.CharField(max_length=20)),
            ],
            options={
                'db_table': 'problems',
            },
        ),
        migrations.CreateModel(
            name='UserRankingStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=40)),
                ('language', models.CharField(max_length=20)),
                ('ac_count', models.IntegerField()),
                ('code_size_points', models.IntegerField()),
                ('exec_time_points', models.IntegerField()),
            ],
            options={
                'db_table': 'user_ranking_statuses',
                'unique_together': {('user_name', 'language')},
            },
        ),
        migrations.CreateModel(
            name='ExecTimeStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(max_length=20)),
                ('rank_a', models.IntegerField()),
                ('rank_b', models.IntegerField()),
                ('rank_c', models.IntegerField()),
                ('rank_d', models.IntegerField()),
                ('problem_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Problem')),
            ],
            options={
                'db_table': 'exec_time_statuses',
                'unique_together': {('problem_id', 'language')},
            },
        ),
        migrations.CreateModel(
            name='CodeSizeStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(max_length=20)),
                ('rank_a', models.IntegerField()),
                ('rank_b', models.IntegerField()),
                ('rank_c', models.IntegerField()),
                ('rank_d', models.IntegerField()),
                ('problem_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Problem')),
            ],
            options={
                'db_table': 'code_size_statuses',
                'unique_together': {('problem_id', 'language')},
            },
        ),
    ]

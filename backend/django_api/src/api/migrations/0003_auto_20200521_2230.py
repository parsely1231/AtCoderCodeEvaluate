# Generated by Django 3.0.6 on 2020-05-21 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200510_1501'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contest',
            name='contest_id',
            field=models.CharField(max_length=40, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='problem',
            name='problem_id',
            field=models.CharField(max_length=40, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='problem',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]

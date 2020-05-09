from django.contrib import admin

from .models import Problem


class ProblemModelAdmin(admin.ModelAdmin):
    list_display = ('problem_id', 'title', 'contest_id', 'exec_time', 'code_size')
    ordering = ('problem_id',)


admin.site.register(Problem, ProblemModelAdmin)

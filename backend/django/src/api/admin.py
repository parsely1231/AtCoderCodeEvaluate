from django.contrib import admin

from .models import Problem, Contest, CodeSizeStatus, ExecTimeStatus, UserRankingStatus


class ProblemModelAdmin(admin.ModelAdmin):
    list_display = ('problem_id', 'title', 'contest_id')
    ordering = ('problem_id',)


class ContestModelAdmin(admin.ModelAdmin):
    list_display = ('contest_id', 'type')
    ordering = ('contest_id',)


class CodeSizeStatusModelAdmin(admin.ModelAdmin):
    list_display = ('problem_id', 'language')
    ordering = ('problem_id',)


class ExecTimeStatusModelAdmin(admin.ModelAdmin):
    list_display = ('problem_id', 'language')
    ordering = ('problem_id',)


class UserRankingStatusModelAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'language', 'code_size_points', 'exec_time_points', 'ac_count')
    ordering = ('exec_time_points',)


admin.site.register(Contest, ContestModelAdmin)
admin.site.register(Problem, ProblemModelAdmin)
admin.site.register(CodeSizeStatus, CodeSizeStatusModelAdmin)
admin.site.register(ExecTimeStatus, ExecTimeStatusModelAdmin)
admin.site.register(UserRankingStatus, UserRankingStatusModelAdmin)

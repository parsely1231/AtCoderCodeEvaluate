from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('problems', views.ProblemViewSet)
router.register('code_size_status', views.CodeSizeStatusViewSet)
router.register('exec_time_status', views.ExecTimeStatusViewSet)
router.register('user_status', views.UserRankingStatusViewSet)


app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),
    path('upload/', views.exec_time_status_upload, name='upload'),
]

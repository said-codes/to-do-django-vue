from django.contrib import admin
from django.urls import path,include
from .api import TaskListApi,RetrieveUpdateDestroyTaskApi,CreateTaskApi,CategoryListApi, RetrieveUpdateDestroyCategoryApi
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    CurrentUserView
)


urlpatterns = [

    # En tu urls.py
    path('tasks/', TaskListApi.as_view(), name='task-list'),
    path('editTask/<int:pk>',RetrieveUpdateDestroyTaskApi.as_view()),
    path('create/',CreateTaskApi.as_view()),

    # Rutas para categorías
    path('categories/', CategoryListApi.as_view(), name='category-list'),
    path('categories/<int:pk>/', RetrieveUpdateDestroyCategoryApi.as_view(), name='category-detail'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
]

from rest_framework.generics import *
from .models import Task
from .serializer import TaskSerializer
from .models import Task, Category
from .serializer import TaskSerializer, CategorySerializer
from rest_framework.filters import BaseFilterBackend
from django_filters.rest_framework import DjangoFilterBackend

class TaskListApi(ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

class CreateTaskApi(CreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class RetrieveUpdateDestroyTaskApi(RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class =  TaskSerializer
# Vistas para categorías
class CategoryListApi(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RetrieveUpdateDestroyCategoryApi(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

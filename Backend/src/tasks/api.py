from rest_framework.generics import (
    ListAPIView, CreateAPIView,
    RetrieveUpdateDestroyAPIView, ListCreateAPIView
)
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from .models import Task, Category
from .serializer import TaskSerializer, CategorySerializer

class TaskListApi(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Obtiene únicamente las tareas del usuario autenticado
        queryset = Task.objects.filter(user=self.request.user)
        category_id = self.request.query_params.get('category', None)
        if category_id:
            # Valida que la categoría pertenezca al usuario
            category = get_object_or_404(Category, id=category_id, user=self.request.user)
            queryset = queryset.filter(category=category)
        return queryset

class CreateTaskApi(CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        # Guarda la tarea asignándole el usuario autenticado
        serializer.save(user=self.request.user)

class RetrieveUpdateDestroyTaskApi(RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Permite actualizar o eliminar solo las tareas del usuario autenticado
        return Task.objects.filter(user=self.request.user)

class CategoryListApi(ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Retorna las categorías del usuario autenticado
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Guarda la categoría asignándole el usuario autenticado
        serializer.save(user=self.request.user)

class RetrieveUpdateDestroyCategoryApi(RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Permite actualizar o eliminar solo las categorías del usuario autenticado
        return Category.objects.filter(user=self.request.user)

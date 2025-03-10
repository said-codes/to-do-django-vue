from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_CHOICES = [
        ('To Do','To Do'),
        ('In Progress','In Progress'),
        ('Done','Done'),
    ]

    task = models.TextField(max_length=200)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='To Do')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='tasks',
        null=True,  # Permite valores nulos en la base de datos
        blank=True  # Permite campos vacíos en los formularios
    )

    def __str__(self):
        return self.task

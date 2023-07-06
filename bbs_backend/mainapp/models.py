from django.db import models
from django.contrib.auth.models import AbstractUser
from authentication.models import CustomUser


class Board(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Thread(models.Model):
    title = models.CharField(max_length=100)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    locked = models.BooleanField(default=False)
    sticky = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} in {self.board.name}"


class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def __str__(self):
        return f"Post {self.id} in {self.thread.title}"

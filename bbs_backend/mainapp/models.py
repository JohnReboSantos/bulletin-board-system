from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    about_myself = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    hometown = models.CharField(max_length=100, blank=True)
    present_location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    gender = models.CharField(max_length=10, blank=True)
    interests = models.TextField(blank=True)

    def __str__(self):
        return self.username

class Administrator(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Administrator: {self.user.username}"


class Moderator(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Moderator: {self.user.username}"


class Poster(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Poster: {self.user.username}"


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

    def __str__(self):
        return self.title


class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def __str__(self):
        return f"Post {self.id} in {self.thread.title}"

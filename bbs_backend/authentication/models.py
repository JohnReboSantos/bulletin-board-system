from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(
        self,
        avatar,
        email,
        username,
        about_myself,
        date_of_birth,
        hometown,
        present_location,
        role,
        banned,
        website=None,
        gender=None,
        interests=None,
        password=None,
    ):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)

        user = self.model(
            avatar=avatar,
            email=email,
            username=username,
            about_myself=about_myself,
            date_of_birth=date_of_birth,
            hometown=hometown,
            present_location=present_location,
            website=website,
            gender=gender,
            interests=interests,
            password=password,
            role=role,
            banned=banned
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        avatar,
        email,
        username,
        about_myself,
        date_of_birth,
        hometown,
        present_location,
        role,
        banned,
        website=None,
        gender=None,
        interests=None,
        password=None,
    ):
        user = self.create_user(
            email,
            username,
            about_myself,
            date_of_birth,
            hometown,
            present_location,
            website,
            gender,
            interests,
            password,
            role,
            banned
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
        ('poster', 'Poster'),
    )

    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True, default="default.png")
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    about_myself = models.TextField()
    date_of_birth = models.DateField()
    hometown = models.CharField(max_length=100)
    present_location = models.CharField(max_length=100)
    website = models.TextField(max_length=20, blank=True, null=True, default='')
    gender = models.TextField(max_length=10, blank=True, null=True, default='') 
    interests = models.TextField(blank=True, null=True, default='')
    role = models.CharField(blank=True, null=True, max_length=20, choices=ROLE_CHOICES, default='poster')
    banned = models.BooleanField(blank=True, null=True, default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "avatar",
        "username",
        "about_myself",
        "date_of_birth",
        "hometown",
        "present_location",
        "website",
        "gender",
        "interests",
        "role",
        "banned"
    ]

    def __str__(self):
        return self.email

from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from authentication.models import CustomUser
from knox.auth import AuthToken
from .models import Board, Thread, Post
from .serializers import (
    UserSerializer,
    BoardSerializer,
    ThreadSerializer,
    PostSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

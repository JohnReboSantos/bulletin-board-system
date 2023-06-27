from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from authentication.models import CustomUser
from .models import Board, Thread, Post, Administrator, Moderator, Poster
from .serializers import (
    UserSerializer,
    BoardSerializer,
    ThreadSerializer,
    PostSerializer,
    AdministratorSerializer,
    ModeratorSerializer,
    PosterSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def ban(self, request, pk=None):
        user = self.get_object()
        # Implement your ban logic here
        # Return appropriate response based on successful ban

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def unban(self, request, pk=None):
        user = self.get_object()
        # Implement your unban logic here
        # Return appropriate response based on successful unban


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer


class ModeratorViewSet(viewsets.ModelViewSet):
    queryset = Moderator.objects.all()
    serializer_class = ModeratorSerializer


class PosterViewSet(viewsets.ModelViewSet):
    queryset = Poster.objects.all()
    serializer_class = PosterSerializer

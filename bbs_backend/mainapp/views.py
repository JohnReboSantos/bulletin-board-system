from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from knox.auth import AuthToken
from knox.views import LoginView as KnoxLoginView

from .models import CustomUser, Board, Thread, Post
from .serializers import (
    UserSerializer,
    LoginSerializer,
    BoardSerializer,
    ThreadSerializer,
    PostSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def register(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully', 'user_id': user.id})
        return Response(serializer.errors, status=400)

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


class UserLoginView(KnoxLoginView):
    permission_classes = []

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        _, token = AuthToken.objects.create(user)

        return Response(
            {
                "key": token,
                "user": {
                    "pk": user.pk,
                    "username": user.username,
                    "first_name": user.name.split()[0],
                    "last_name": " ".join(user.name.split()[1:])
                    if len(user.name.split()) > 1
                    else "",
                    "email": user.email,
                    "date_of_birth": user.date_of_birth,
                },
            }
        )


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

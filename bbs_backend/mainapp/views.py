from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from knox.auth import AuthToken
from knox.views import LoginView as KnoxLoginView

from .models import CustomUser, Board, Thread, Post
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    BoardSerializer,
    ThreadSerializer,
    PostSerializer
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


class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data

        if isinstance(data, str):  # Handling 'application/x-www-form-urlencoded' format
            username = request.POST.get("username")
            email = request.POST.get("email")
            password1 = request.POST.get("password1")
            password2 = request.POST.get("password2")
            about_myself = request.POST.get("about_myself")
            date_of_birth = request.POST.get("date_of_birth")
            hometown = request.POST.get("hometown")
            present_location = request.POST.get("present_location")
            website = request.POST.get("website") or ""
            gender = request.POST.get("gender") or ""
            interests = request.POST.get("interests") or ""
        else:  # Assuming JSON format
            username = data.get("username")
            email = data.get("email")
            password1 = data.get("password1")
            password2 = data.get("password2")
            about_myself = data.get("about_myself")
            date_of_birth = data.get("date_of_birth")
            hometown = data.get("hometown")
            present_location = data.get("present_location")
            website = data.get("website") or ""
            gender = data.get("gender") or ""
            interests = data.get("interests") or ""

        serializer = RegisterSerializer(
            data={
                "username": username,
                "email": email,
                "password1": password1,
                "password2": password2,
                "about_myself": about_myself,
                "date_of_birth": date_of_birth,
                "hometown": hometown,
                "present_location": present_location,
                "website": website,
                "gender": gender,
                "interests": interests
            }
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        _, token = AuthToken.objects.create(user)

        return Response(
            {
                "user_info": {"id": user.id, "username": user.username, "email": user.email},
                "token": token,
            }
        )


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
                    "email": user.email,
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

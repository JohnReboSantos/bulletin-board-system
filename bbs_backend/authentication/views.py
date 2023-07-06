from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from knox.auth import AuthToken
from knox.views import LoginView as KnoxLoginView
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


class LoginAPIView(KnoxLoginView):
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


class GetUserDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data

        if isinstance(data, str):  # Handling 'application/x-www-form-urlencoded' format
            avatar = request.POST.get("avatar")
            username = request.POST.get("username")
            email = request.POST.get("email")
            password1 = request.POST.get("password1")
            password2 = request.POST.get("password2")
            about_myself = request.POST.get("about_myself")
            date_of_birth = request.POST.get("date_of_birth")
            hometown = request.POST.get("hometown")
            present_location = request.POST.get("present_location")
            website = request.POST.get("website")
            gender = request.POST.get("gender")
            interests = request.POST.get("interests")
            role = request.POST.get("role")
            banned = request.POST.get("banned")
        else:  # Assuming JSON format
            avatar = data.get("avatar")
            username = data.get("username")
            email = data.get("email")
            password1 = data.get("password1")
            password2 = data.get("password2")
            about_myself = data.get("about_myself")
            date_of_birth = data.get("date_of_birth")
            hometown = data.get("hometown")
            present_location = data.get("present_location")
            website = data.get("website")
            gender = data.get("gender")
            interests = data.get("interests")
            role = data.get("role")
            banned = data.get("banned")

        serializer = RegisterSerializer(
            data={
                "avatar": avatar,
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
                "interests": interests,
                "role": role,
                "banned": banned,
            }
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        _, token = AuthToken.objects.create(user)

        return Response(
            {
                "user_info": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "token": token,
            }
        )

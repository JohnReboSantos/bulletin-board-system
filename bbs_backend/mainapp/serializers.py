from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Board, Thread, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('about_myself', 'date_of_birth', 'hometown', 'present_location', 'website', 'gender', 'interests')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"), email=email, password=password
        )
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        attrs["user"] = user
        return attrs


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('name', 'description', 'created_at')


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('title', 'board', 'created_by', 'created_at', 'locked')


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('thread', 'created_by', 'created_at', 'message')

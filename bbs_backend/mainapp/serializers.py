from datetime import datetime, date
from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import CustomUser, Board, Thread, Post, Administrator, Moderator, Poster


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'about_myself', 'date_of_birth', 'hometown', 'present_location', 'website', 'gender', 'interests')
    
    def validate_email(self, value):
        if self.instance and self.instance.email == value:
            return value  # Skip validation for the same email
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate_username(self, value):
        if self.instance and self.instance.username == value:
            return value  # Skip validation for the same username
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate(self, data):
        username = data.get("username")
        email = data.get("email")
        date_of_birth = data.get("date_of_birth")

        # Validate date of birth format (YYYY-MM-DD)
        try:
            birth_date = datetime.strptime(
                str(date_of_birth), "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError(
                "Invalid date of birth format. Must be YYYY-MM-DD."
            )

        # Validate birth date is in the past
        today = date.today()
        if birth_date > today:
            raise serializers.ValidationError(
                "Birth date must be in the past.")

        return data


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id', 'name', 'topic', 'description', 'created_at')

    def validate_name(self, value):
        # Check if a board with the same name already exists
        if Board.objects.filter(name=value).exists():
            raise serializers.ValidationError("A board with this name already exists.")
        return value


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('id', 'title', 'board', 'created_by', 'created_at', 'locked', 'sticky')
    
    def validate(self, attrs):
        board = attrs.get('board')
        title = attrs.get('title')

        # Check if a thread with the same board and title already exists
        if Thread.objects.filter(board=board, title=title).exists():
            raise serializers.ValidationError("A thread with the same board and title already exists.")
        return attrs


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'thread', 'created_by', 'created_at', 'message')


class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = ('user',)


class ModeratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moderator
        fields = ('user',)

class PosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poster
        fields = ('user',)

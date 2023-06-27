from rest_framework import serializers
from .models import CustomUser, Board, Thread, Post, Administrator, Moderator, Poster


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'about_myself', 'date_of_birth', 'hometown', 'present_location', 'website', 'gender', 'interests')


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
        fields = ('id', 'title', 'board', 'created_by', 'created_at', 'locked')
    
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

from rest_framework import serializers
from .models import User, Board, Thread, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('about_myself', 'date_of_birth', 'hometown', 'present_location', 'website', 'gender', 'interests')


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

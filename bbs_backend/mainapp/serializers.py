from datetime import datetime, date
from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import CustomUser, Board, Thread, Post


class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.

    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268

    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if "data:" in data and ";base64," in data:
                # Break out the header from the base64 content
                header, data = data.split(";base64,")

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail("invalid_image")

            # Generate file name:
            file_name = str(uuid.uuid4())[:12]  # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (
                file_name,
                file_extension,
            )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class UserSerializer(serializers.ModelSerializer):
    avatar = Base64ImageField(
        max_length=None,
        use_url=True,
    )

    class Meta:
        model = CustomUser
        fields = (
            "id",
            "avatar",
            "username",
            "email",
            "about_myself",
            "date_of_birth",
            "hometown",
            "present_location",
            "website",
            "gender",
            "interests",
            "role",
            "banned"
        )

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
            raise serializers.ValidationError(
                "A user with that username already exists."
            )
        return value


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ("id", "name", "topic", "description", "created_at")

    def validate_name(self, value):
        # Check if a board with the same name already exists
        if Board.objects.filter(name=value).exists():
            raise serializers.ValidationError("A board with this name already exists.")
        return value


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = (
            "id",
            "title",
            "board",
            "created_by",
            "created_at",
            "locked",
            "sticky",
        )

    def validate(self, attrs):
        board = attrs.get("board")
        title = attrs.get("title")

        # Check if a thread with the same board and title already exists
        if Thread.objects.filter(board=board, title=title).exists():
            raise serializers.ValidationError(
                "A thread with the same board and title already exists."
            )
        return attrs


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("id", "thread", "created_by", "created_at", "message")

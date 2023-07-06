from datetime import datetime, date
from rest_framework import serializers, permissions
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import CustomUser


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


class AllowUnauthenticated(permissions.BasePermission):
    def has_permission(self):
        # Allow unauthenticated requests
        return True


class RegisterSerializer(serializers.ModelSerializer):
    permission_classes = [AllowUnauthenticated, permissions.AllowAny]
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    avatar = Base64ImageField(
        max_length=None,
        use_url=True,
    )

    class Meta:
        model = CustomUser
        fields = (
            "avatar",
            "username",
            "email",
            "password1",
            "password2",
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

    def validate(self, data):
        username = data.get("username")
        email = data.get("email")
        password1 = data.get("password1")
        password2 = data.get("password2")
        date_of_birth = data.get("date_of_birth")

        # Validate if a user with the email already exists
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with that email already exists.")

        # Validate if a user with the username already exists
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                "A user with that username already exists."
            )

        # Validate password match
        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        # Validate password strength
        try:
            validate_password(password1)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))

        # Validate date of birth format (YYYY-MM-DD)
        try:
            birth_date = datetime.strptime(str(date_of_birth), "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError(
                "Invalid date of birth format. Must be YYYY-MM-DD."
            )

        # Validate birth date is in the past
        today = date.today()
        if birth_date > today:
            raise serializers.ValidationError("Birth date must be in the past.")

        # Save the password to the 'password' field
        data["password"] = password1

        return data

    def create(self, validated_data):
        avatar = validated_data.get("avatar")
        username = validated_data.get("username")
        email = validated_data.get("email")
        password = validated_data.get("password")
        about_myself = validated_data.get("about_myself")
        date_of_birth = validated_data.get("date_of_birth")
        hometown = validated_data.get("hometown")
        present_location = validated_data.get("present_location")
        website = validated_data.get("website")
        gender = validated_data.get("gender")
        interests = validated_data.get("interests")
        role = validated_data.get("role")
        banned = validated_data.get("banned")

        user = CustomUser.objects.create_user(
            avatar=avatar,
            username=username,
            email=email,
            password=password,
            about_myself=about_myself,
            date_of_birth=date_of_birth,
            hometown=hometown,
            present_location=present_location,
            website=website,
            gender=gender,
            interests=interests,
            role=role,
            banned=banned
        )

        return user


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
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
        ]

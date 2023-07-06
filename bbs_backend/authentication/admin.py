from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ["id", "email", "username", "role", "banned", "is_staff"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal Info",
            {
                "fields": (
                    "avatar",
                    "username",
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
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "avatar",
                    "username",
                    "about_myself",
                    "date_of_birth",
                    "hometown",
                    "present_location",
                    "website",
                    "gender",
                    "interests",
                    "role",
                    "banned"
                ),
            },
        ),
    )
    ordering = ["email"]


admin.site.register(CustomUser, CustomUserAdmin)

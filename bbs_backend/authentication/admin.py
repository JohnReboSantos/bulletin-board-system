from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ["id", "email", "username", "date_of_birth", "is_staff"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("avatar", "username", "about_myself", "date_of_birth", "hometown", "present_location", "website", "gender", "interests")}),
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
                "fields": ("avatar", "username", "about_myself", "date_of_birth", "hometown", "present_location", "website", "gender", "interests"),
            },
        ),
    )
    ordering = ["email"]


admin.site.register(CustomUser, CustomUserAdmin)

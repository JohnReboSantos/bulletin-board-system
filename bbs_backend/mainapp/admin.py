from django.contrib import admin
from .models import Board, Thread, Post


class BoardAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "topic")
    list_editable = ("name", "topic")


admin.site.register(Board, BoardAdmin)


class ThreadAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "board", "created_by", "locked")
    list_editable = ("title", "locked")


admin.site.register(Thread, ThreadAdmin)


class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "thread", "created_by")


admin.site.register(Post, PostAdmin)

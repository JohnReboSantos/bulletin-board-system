from django.contrib import admin
from .models import Administrator, Moderator, Poster, Board, Thread, Post

admin.site.register(Administrator)
admin.site.register(Moderator)
admin.site.register(Poster)
admin.site.register(Board)
admin.site.register(Thread)
admin.site.register(Post)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    BoardViewSet,
    ThreadViewSet,
    PostViewSet,
    AdministratorViewSet,
    ModeratorViewSet,
    PosterViewSet,
)


router = DefaultRouter()
router.register("users", UserViewSet)
router.register("boards", BoardViewSet)
router.register("threads", ThreadViewSet)
router.register("posts", PostViewSet)
router.register("administrators", AdministratorViewSet)
router.register("moderators", ModeratorViewSet)
router.register("posters", PosterViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

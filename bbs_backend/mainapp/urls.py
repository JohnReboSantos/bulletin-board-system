from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, BoardViewSet, ThreadViewSet, PostViewSet


router = DefaultRouter()
router.register("users", UserViewSet)
router.register("boards", BoardViewSet)
router.register("threads", ThreadViewSet)
router.register("posts", PostViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

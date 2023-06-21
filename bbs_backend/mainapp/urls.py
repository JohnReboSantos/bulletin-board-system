from django.urls import path, include
from rest_framework.routers import DefaultRouter
from knox import views as knox_views
from .views import UserViewSet, UserLoginView, BoardViewSet, ThreadViewSet, PostViewSet


router = DefaultRouter()
router.register("users", UserViewSet)
router.register("boards", BoardViewSet)
router.register("threads", ThreadViewSet)
router.register("posts", PostViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("users/login/", UserLoginView.as_view()),
    path("users/logout/", knox_views.LogoutView.as_view())
]

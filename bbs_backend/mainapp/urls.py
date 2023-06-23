from django.urls import path, include
from rest_framework.routers import DefaultRouter
from knox import views as knox_views
from .views import UserViewSet, RegisterAPIView, UserLoginView, BoardViewSet, ThreadViewSet, PostViewSet


router = DefaultRouter()
router.register("users", UserViewSet)
router.register("boards", BoardViewSet)
router.register("threads", ThreadViewSet)
router.register("posts", PostViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/login/", UserLoginView.as_view()),
    path("auth/registration/", RegisterAPIView.as_view()),
    path("auth/logout/", knox_views.LogoutView.as_view())
]

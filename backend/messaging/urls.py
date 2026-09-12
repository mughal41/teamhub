from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MessageViewSet, NotificationViewSet

router = DefaultRouter()
router.register("messages", MessageViewSet, basename="message")
router.register("notifications", NotificationViewSet, basename="notification")

urlpatterns = [path("", include(router.urls))]

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PerformanceReviewViewSet

router = DefaultRouter()
router.register("", PerformanceReviewViewSet, basename="performance")

urlpatterns = [path("", include(router.urls))]

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PayslipViewSet

router = DefaultRouter()
router.register("", PayslipViewSet, basename="payroll")

urlpatterns = [path("", include(router.urls))]

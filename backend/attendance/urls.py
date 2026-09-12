from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttendanceViewSet, ClockView, CorrectionCreateView, CorrectionDecisionView

router = DefaultRouter()
router.register("records", AttendanceViewSet, basename="attendance")

urlpatterns = [
    path("", include(router.urls)),
    path("clock/", ClockView.as_view(), name="attendance-clock"),
    path("corrections/", CorrectionCreateView.as_view(), name="attendance-corrections"),
    path(
        "corrections/<int:pk>/",
        CorrectionDecisionView.as_view(),
        name="attendance-correction-decision",
    ),
]

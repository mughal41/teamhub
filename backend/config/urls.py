from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/departments/", include("org.urls")),
    path("api/employees/", include("hr.urls")),
    path("api/attendance/", include("attendance.urls")),
    path("api/leaves/", include("leave.urls")),
    path("api/performance/", include("performance.urls")),
    path("api/payroll/", include("payroll.urls")),
    path("api/calendar/", include("calendar_app.urls")),
    path("api/inbox/", include("messaging.urls")),
    path("api/recruitment/", include("recruitment.urls")),
]

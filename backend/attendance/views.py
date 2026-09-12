from datetime import date, datetime

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminOrManager, IsAdminRole, scope_by_employee_code
from hr.models import Employee

from .models import AttendanceRecord
from .serializers import AttendanceSerializer, ClockActionSerializer, CorrectionSerializer


def parse_flexible_date(value):
    if not value:
        return date.today()
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    text = str(value).strip()
    for fmt in ("%Y-%m-%d", "%d %b %Y", "%d %B %Y", "%b %d %Y", "%B %d %Y"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    return date.today()


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        qs = AttendanceRecord.objects.select_related(
            "employee", "employee__department"
        )
        return scope_by_employee_code(self.request.user, qs, field="employee__employee_code")

    def create(self, request, *args, **kwargs):
        if request.user.access_role != "admin":
            return Response({"detail": "Only admin can create attendance records."}, status=403)
        code = request.data.get("employeeCode") or request.data.get("id")
        emp = Employee.objects.filter(employee_code=code).first()
        if not emp:
            return Response({"detail": "Employee not found."}, status=400)
        record = AttendanceRecord.objects.create(
            employee=emp,
            date=parse_flexible_date(request.data.get("date")),
            clock_in=request.data.get("in") or request.data.get("clockIn") or "—",
            clock_out=request.data.get("out") or request.data.get("clockOut") or "—",
            duration=request.data.get("duration") or "—",
            overtime=request.data.get("overtime") or "0h",
            status=request.data.get("status") or AttendanceRecord.Status.ON_TIME,
            comment=request.data.get("comment") or "",
            work_model=request.data.get("model") or emp.work_model,
            is_correction=bool(request.data.get("is_correction", False)),
            forwarded_to=request.data.get("forwardedTo") or "None",
            forwarded_status=request.data.get("forwardedStatus") or AttendanceRecord.ApprovalStatus.NONE,
            hr_approval_status=request.data.get("hrApprovalStatus") or AttendanceRecord.ApprovalStatus.NONE,
        )
        return Response(AttendanceSerializer(record).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        if request.user.access_role not in {"admin", "manager"}:
            return Response({"detail": "Forbidden"}, status=403)
        record = self.get_object()
        mapping = {
            "in": "clock_in",
            "clockIn": "clock_in",
            "out": "clock_out",
            "clockOut": "clock_out",
            "duration": "duration",
            "overtime": "overtime",
            "status": "status",
            "comment": "comment",
            "forwardedTo": "forwarded_to",
            "forwardedStatus": "forwarded_status",
            "hrApprovalStatus": "hr_approval_status",
        }
        for key, field in mapping.items():
            if key in request.data:
                setattr(record, field, request.data[key])
        record.save()
        return Response(AttendanceSerializer(record).data)


class ClockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = getattr(request.user, "employee_profile", None)
        if not profile:
            return Response({"detail": "No employee profile linked."}, status=400)
        serializer = ClockActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        from django.utils import timezone

        now = timezone.localtime().strftime("%I:%M %p")
        today = date.today()
        record, _ = AttendanceRecord.objects.get_or_create(
            employee=profile,
            date=today,
            is_correction=False,
            defaults={
                "work_model": profile.work_model,
                "status": AttendanceRecord.Status.ON_TIME,
            },
        )
        if serializer.validated_data["type"] == "in":
            record.clock_in = now
            record.status = AttendanceRecord.Status.ON_TIME
            record.comment = "Self clock-in"
        else:
            record.clock_out = now
        record.save()
        return Response(AttendanceSerializer(record).data)


class CorrectionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = getattr(request.user, "employee_profile", None)
        if not profile:
            return Response({"detail": "No employee profile linked."}, status=400)
        serializer = CorrectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mgr_name = profile.manager.name if profile.manager else "HR"
        record = AttendanceRecord.objects.create(
            employee=profile,
            date=serializer.validated_data["date"],
            clock_in=serializer.validated_data["clockIn"],
            clock_out=serializer.validated_data["clockOut"],
            comment=serializer.validated_data["reason"],
            work_model=profile.work_model,
            is_correction=True,
            forwarded_to=mgr_name,
            forwarded_status=AttendanceRecord.ApprovalStatus.PENDING,
            hr_approval_status=AttendanceRecord.ApprovalStatus.PENDING,
            status=AttendanceRecord.Status.ON_TIME,
        )
        return Response(AttendanceSerializer(record).data, status=status.HTTP_201_CREATED)


class CorrectionDecisionView(APIView):
    permission_classes = [IsAdminOrManager]

    def patch(self, request, pk):
        decision = request.data.get("status")
        if decision not in {"Approved", "Rejected"}:
            return Response({"detail": "status must be Approved or Rejected."}, status=400)
        qs = AttendanceRecord.objects.filter(is_correction=True)
        qs = scope_by_employee_code(request.user, qs, field="employee__employee_code")
        try:
            record = qs.get(pk=pk)
        except AttendanceRecord.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        record.forwarded_status = decision
        record.hr_approval_status = decision
        record.save()
        return Response(AttendanceSerializer(record).data)

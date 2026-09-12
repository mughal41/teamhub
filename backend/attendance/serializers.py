from rest_framework import serializers

from hr.models import Employee

from .models import AttendanceRecord


class AttendanceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="employee.employee_code", read_only=True)
    name = serializers.CharField(source="employee.name", read_only=True)
    role = serializers.CharField(source="employee.role", read_only=True)
    dept = serializers.CharField(source="employee.department.name", default="", read_only=True)
    avatar = serializers.CharField(source="employee.avatar", read_only=True)
    in_ = serializers.CharField(source="clock_in")
    out = serializers.CharField(source="clock_out")
    model = serializers.CharField(source="work_model")
    subRole = serializers.SerializerMethodField()
    forwardedTo = serializers.CharField(source="forwarded_to")
    forwardedStatus = serializers.CharField(source="forwarded_status")
    hrApprovalStatus = serializers.CharField(source="hr_approval_status")
    correctionRequestsThisMonth = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = (
            "pk",
            "id",
            "name",
            "role",
            "subRole",
            "dept",
            "date",
            "model",
            "in_",
            "out",
            "duration",
            "overtime",
            "status",
            "avatar",
            "correctionRequestsThisMonth",
            "comment",
            "forwardedTo",
            "forwardedStatus",
            "hrApprovalStatus",
            "is_correction",
        )

    def get_subRole(self, obj):
        return "Correction" if obj.is_correction else "Self"

    def get_correctionRequestsThisMonth(self, obj):
        return AttendanceRecord.objects.filter(
            employee=obj.employee,
            is_correction=True,
            date__year=obj.date.year,
            date__month=obj.date.month,
        ).count()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["in"] = data.pop("in_", data.get("in_"))
        data["id"] = instance.employee.employee_code
        data.pop("pk", None)
        data["recordId"] = instance.pk
        return data


class ClockActionSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=["in", "out"])


class CorrectionSerializer(serializers.Serializer):
    date = serializers.DateField()
    clockIn = serializers.CharField(max_length=32)
    clockOut = serializers.CharField(max_length=32)
    reason = serializers.CharField()

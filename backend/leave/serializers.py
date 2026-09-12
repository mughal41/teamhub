from rest_framework import serializers

from .models import LeaveRequest


class LeaveSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="employee.employee_code", read_only=True)
    name = serializers.CharField(source="employee.name", read_only=True)
    role = serializers.CharField(source="employee.role", read_only=True)
    dept = serializers.CharField(source="employee.department.name", default="", read_only=True)
    avatar = serializers.CharField(source="employee.avatar", read_only=True)
    type = serializers.CharField(source="leave_type")
    submit = serializers.DateTimeField(source="submitted_at", read_only=True, format="%d %b %Y")
    period = serializers.SerializerMethodField()
    startDate = serializers.DateField(source="start_date")
    endDate = serializers.DateField(source="end_date")
    forwardedTo = serializers.CharField(source="forwarded_to", required=False, allow_blank=True)
    forwardedStatus = serializers.CharField(source="status", read_only=True)
    remainingQuota = serializers.IntegerField(source="remaining_quota", read_only=True)
    totalQuota = serializers.IntegerField(source="total_quota", read_only=True)
    sickLeavesRemaining = serializers.IntegerField(source="sick_remaining", read_only=True)
    casualLeavesRemaining = serializers.IntegerField(source="casual_remaining", read_only=True)
    annualLeavesRemaining = serializers.IntegerField(source="annual_remaining", read_only=True)
    otherLeavesRemaining = serializers.IntegerField(source="other_remaining", read_only=True)
    leaveId = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = LeaveRequest
        fields = (
            "leaveId",
            "id",
            "name",
            "role",
            "dept",
            "type",
            "submit",
            "period",
            "duration",
            "reason",
            "status",
            "avatar",
            "remainingQuota",
            "totalQuota",
            "sickLeavesRemaining",
            "casualLeavesRemaining",
            "annualLeavesRemaining",
            "otherLeavesRemaining",
            "startDate",
            "endDate",
            "forwardedTo",
            "forwardedStatus",
            "comment",
        )

    def get_period(self, obj):
        return f"{obj.start_date.strftime('%d %b')} – {obj.end_date.strftime('%d %b %Y')}"

    TYPE_TO_UI = {
        "Annual": "Annual Leave",
        "Sick": "Sick Leave",
        "Casual": "Casual Leave",
        "Other": "Other Leave",
    }
    UI_TO_TYPE = {v: k for k, v in TYPE_TO_UI.items()}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        raw = data.get("type") or ""
        data["type"] = self.TYPE_TO_UI.get(raw, raw if raw.endswith("Leave") else f"{raw} Leave".strip())
        return data

    def to_internal_value(self, data):
        mutable = dict(data)
        leave_type = mutable.get("type")
        if isinstance(leave_type, str):
            mutable["type"] = self.UI_TO_TYPE.get(leave_type, leave_type.replace(" Leave", "").strip())
        return super().to_internal_value(mutable)

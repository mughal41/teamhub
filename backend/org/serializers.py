from rest_framework import serializers

from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    headName = serializers.CharField(source="head_name", required=False, allow_blank=True)
    employeeCount = serializers.IntegerField(source="member_count", required=False)
    createdAt = serializers.SerializerMethodField()
    pk = serializers.IntegerField(source="id", read_only=True)

    class Meta:
        model = Department
        fields = (
            "pk",
            "id",
            "name",
            "code",
            "headName",
            "description",
            "employeeCount",
            "status",
            "createdAt",
        )

    def get_id(self, obj):
        return obj.code or f"DEPT-{obj.pk:03d}"

    def get_createdAt(self, obj):
        return obj.created_at.strftime("%d %b %Y") if obj.created_at else ""

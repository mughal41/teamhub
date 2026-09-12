from rest_framework import serializers

from hr.models import Employee

from .models import PerformanceReview


class PerformanceReviewSerializer(serializers.ModelSerializer):
    employeeId = serializers.CharField(source="employee.employee_code", read_only=True)
    employeeName = serializers.CharField(source="employee.name", read_only=True)
    reviewerName = serializers.SerializerMethodField()
    average = serializers.FloatField(read_only=True)
    taskCompletion = serializers.IntegerField(source="task_completion")
    employeeCode = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = PerformanceReview
        fields = (
            "id",
            "employeeId",
            "employeeName",
            "employeeCode",
            "reliability",
            "punctuality",
            "taskCompletion",
            "behavior",
            "feedback",
            "period",
            "average",
            "reviewerName",
            "updated_at",
        )
        read_only_fields = ("id", "updated_at")

    def get_reviewerName(self, obj):
        if not obj.reviewer:
            return ""
        return obj.reviewer.get_full_name() or obj.reviewer.email

    def create(self, validated_data):
        code = validated_data.pop("employeeCode", None)
        request = self.context["request"]
        employee = Employee.objects.filter(employee_code=code).first()
        if not employee:
            raise serializers.ValidationError({"employeeCode": "Employee not found."})
        return PerformanceReview.objects.create(
            employee=employee,
            reviewer=request.user,
            **validated_data,
        )

    def update(self, instance, validated_data):
        validated_data.pop("employeeCode", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.reviewer = self.context["request"].user
        instance.save()
        return instance

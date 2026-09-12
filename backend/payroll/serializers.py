from rest_framework import serializers

from .models import Payslip


class PayslipSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="employee.employee_code", read_only=True)
    name = serializers.CharField(source="employee.name", read_only=True)
    role = serializers.CharField(source="employee.role", read_only=True)
    subRole = serializers.CharField(source="employee.employment_type", read_only=True)
    avatar = serializers.CharField(source="employee.avatar", read_only=True)
    date = serializers.CharField(source="period_date")
    incen = serializers.CharField(source="incentive")
    deduct = serializers.CharField(source="deduction")
    payslipId = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = Payslip
        fields = (
            "payslipId",
            "id",
            "name",
            "role",
            "subRole",
            "date",
            "salary",
            "allowance",
            "overtime",
            "incen",
            "deduct",
            "total",
            "status",
            "avatar",
        )

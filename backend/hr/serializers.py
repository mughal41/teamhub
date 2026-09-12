from rest_framework import serializers

from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="employee_code")
    dept = serializers.CharField(source="department.name", default="", read_only=True)
    departmentId = serializers.IntegerField(
        source="department_id", required=False, allow_null=True
    )
    type = serializers.CharField(source="employment_type")
    model = serializers.CharField(source="work_model")
    joinDate = serializers.SerializerMethodField()
    join_date = serializers.DateField(write_only=True, required=False, allow_null=True)
    managerId = serializers.SerializerMethodField()
    managerCode = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.SerializerMethodField()
    managerName = serializers.SerializerMethodField()
    managerRole = serializers.SerializerMethodField()
    managerAvatar = serializers.SerializerMethodField()
    managerEmail = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = (
            "id",
            "name",
            "role",
            "dept",
            "departmentId",
            "type",
            "model",
            "status",
            "avatar",
            "joinDate",
            "join_date",
            "managerId",
            "managerCode",
            "email",
            "managerName",
            "managerRole",
            "managerAvatar",
            "managerEmail",
        )

    def get_joinDate(self, obj):
        if not obj.join_date:
            return ""
        return obj.join_date.strftime("%d %b %Y")

    def get_managerId(self, obj):
        return obj.manager.employee_code if obj.manager_id else None

    def get_email(self, obj):
        if obj.user_id and obj.user:
            return obj.user.email
        return ""

    def get_managerName(self, obj):
        return obj.manager.name if obj.manager_id else ""

    def get_managerRole(self, obj):
        return obj.manager.role if obj.manager_id else ""

    def get_managerAvatar(self, obj):
        return obj.manager.avatar if obj.manager_id else ""

    def get_managerEmail(self, obj):
        if obj.manager_id and obj.manager.user_id:
            return obj.manager.user.email
        return ""

    def create(self, validated_data):
        manager_code = validated_data.pop("managerCode", None)
        code = self.initial_data.get("id") or self.initial_data.get("employee_code")
        if not code:
            raise serializers.ValidationError({"id": "Employee code is required."})
        # Map department by name if departmentId missing
        dept_name = self.initial_data.get("dept")
        if dept_name and not validated_data.get("department_id"):
            from org.models import Department

            dept = Department.objects.filter(name__iexact=dept_name).first()
            if dept:
                validated_data["department"] = dept
        emp = Employee(employee_code=code, **validated_data)
        if manager_code:
            emp.manager = Employee.objects.filter(employee_code=manager_code).first()
        emp.save()
        return emp

    def update(self, instance, validated_data):
        manager_code = validated_data.pop("managerCode", None)
        dept_name = self.initial_data.get("dept")
        if dept_name:
            from org.models import Department

            dept = Department.objects.filter(name__iexact=dept_name).first()
            if dept:
                instance.department = dept
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if manager_code is not None:
            instance.manager = (
                Employee.objects.filter(employee_code=manager_code).first()
                if manager_code
                else None
            )
        instance.save()
        return instance

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    employeeId = serializers.SerializerMethodField()
    accessRole = serializers.CharField(source="access_role")
    roleTitle = serializers.CharField(source="role_title")
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "name",
            "accessRole",
            "employeeId",
            "roleTitle",
            "avatar",
        )

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username

    def get_employeeId(self, obj):
        profile = getattr(obj, "employee_profile", None)
        return profile.employee_code if profile else ""


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    firstName = serializers.CharField(max_length=80)
    lastName = serializers.CharField(max_length=80)
    organizationName = serializers.CharField(max_length=120, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        first = validated_data["firstName"].strip()
        last = validated_data["lastName"].strip()
        org = (validated_data.get("organizationName") or "TeamHub").strip()
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first,
            last_name=last,
            access_role=User.AccessRole.EMPLOYEE,
            role_title=f"{org} Member",
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=True)
    avatar = serializers.URLField(required=False, allow_blank=True)
    roleTitle = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        if "name" in validated_data:
            parts = validated_data["name"].strip().split(" ", 1)
            instance.first_name = parts[0]
            instance.last_name = parts[1] if len(parts) > 1 else ""
        if "avatar" in validated_data:
            instance.avatar = validated_data["avatar"]
        if "roleTitle" in validated_data:
            instance.role_title = validated_data["roleTitle"]
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(write_only=True)
    nextPassword = serializers.CharField(min_length=8, write_only=True)

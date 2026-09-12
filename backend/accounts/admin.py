from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("email", "first_name", "last_name", "access_role", "is_staff")
    list_filter = ("access_role", "is_staff", "is_superuser")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("TeamHub", {"fields": ("access_role", "avatar", "role_title")}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (None, {"fields": ("email", "access_role", "role_title")}),
    )

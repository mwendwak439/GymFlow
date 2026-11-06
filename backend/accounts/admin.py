
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, MemberProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Gym info", {"fields": ("phone", "role")}),)
    list_display = ("username", "email", "role", "is_active")


admin.site.register(MemberProfile)
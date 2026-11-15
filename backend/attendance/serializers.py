
from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source='members.username',
        read_only=True
    )

    class Meta:
        model = Attendance
        fields = ['id', 'members', 'member_name', 'check_in']
        read_only_fields = ['id', 'members', 'member_name', 'check_in']

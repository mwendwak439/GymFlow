
from rest_framework import serializers
from accounts.models import User
from .models import MembershipPlan, Subscription


class MembershipPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = MembershipPlan
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class SubscriptionSerializer(serializers.ModelSerializer):

    member_name = serializers.CharField(
        source="member.username",
        read_only=True
    )

    plan_name = serializers.CharField(
        source="plan.name",
        read_only=True
    )

    class Meta:
        model = Subscription
        fields = [
            "id",
            "member",
            "member_name",
            "plan",
            "plan_name",
            "start_date",
            "end_date",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "end_date",
            "created_at",
        ]

    def validate_member(self, value):
        if value.role != User.Role.MEMBER:
            raise serializers.ValidationError(
                "Only registered members can receive subscriptions."
            )
        return value

    def validate_plan(self, value):
        if not value.is_active:
            raise serializers.ValidationError(
                "You cannot assign an inactive membership plan."
            )
        return value

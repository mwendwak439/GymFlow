
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
    plan_price = serializers.ReadOnlyField(
        source="plan.price"
        )


    latest_payment_status = serializers.SerializerMethodField()
    mpesa_receipt_number = serializers.SerializerMethodField()

    def get_latest_payment_status(self, obj):
        payment = obj.payments.order_by("-created_at").first()
        return payment.status if payment else None

    def get_mpesa_receipt_number(self, obj):
        payment = obj.payments.order_by("-created_at").first()
        return payment.mpesa_receipt_number if payment else None


    class Meta:
        model = Subscription
        fields = [
            "id",
            "member",
            "member_name",
            "plan",
            "plan_name",
            "plan_price",
            "start_date",
            "end_date",
            "status",
            "created_at",
            "latest_payment_status",
            "mpesa_receipt_number",
        ]
        read_only_fields = [
            "id",
            "end_date",
            "created_at",
            "status",
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
class MemberSubscriptionSerializer(SubscriptionSerializer):

    class Meta(SubscriptionSerializer.Meta):
        read_only_fields = [
            *SubscriptionSerializer.Meta.read_only_fields,
            "member",
        ]
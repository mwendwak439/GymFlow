
from rest_framework import serializers
from .models import Payment


class PaymentHistorySerializer(serializers.ModelSerializer):
    member_username = serializers.CharField(
        source="subscription.member.username",
        read_only=True
    )

    member_email = serializers.CharField(
        source="subscription.member.email",
        read_only=True
    )

    plan_name = serializers.CharField(
        source="subscription.plan.name",
        read_only=True
    )

    subscription_status = serializers.CharField(
        source="subscription.status",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
        "id",
        "member_username",
        "member_email",
        "plan_name",
        "subscription_status",
        "amount",
        "phone_number",
        "status",
        "mpesa_receipt_number",
        "checkout_request_id",
        "merchant_request_id",
        "result_code",
        "result_description",
        "created_at",
        "updated_at",
    ]
        read_only_fields = fields


import re
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import status,generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from memberships.models import Subscription
from .models import Payment
from .mpesa import initiate_stk_push
from .serializers import PaymentHistorySerializer


class InitiateSTKPushView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subscription_id = request.data.get("subscription_id")
        phone_number = request.data.get("phone_number", "").strip()

        if not subscription_id or not phone_number:
            return Response(
                {"error": "Subscription ID and phone number are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not re.fullmatch(r"254[17]\d{8}", phone_number):
            return Response(
                {"error": "Enter a valid Kenyan M-Pesa phone number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            subscription = Subscription.objects.get(
                id=subscription_id,
                member=request.user
            )
        except Subscription.DoesNotExist:
            return Response(
                {"error": "Subscription not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if subscription.status != "PENDING":
            return Response(
                {"error": "This subscription is not awaiting payment."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent another STK request while one is still pending.
        if subscription.payments.filter(status="PENDING").exists():
            return Response(
                {"error": "A payment request is already pending."},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = subscription.plan.price

        if amount <= 0 or amount != amount.to_integral_value():
            return Response(
                {"error": "Subscription price must be a positive whole number in KES."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment = Payment.objects.create(
            subscription=subscription,
            amount=amount,
            phone_number=phone_number
        )

        try:
            mpesa_response = initiate_stk_push(
                phone_number=phone_number,
                amount=amount,
                account_reference=f"GYMFLOW-{subscription.id}",
                transaction_desc="Gym membership subscription"
            )

            if str(mpesa_response.get("ResponseCode")) != "0":
                payment.status = "FAILED"
                payment.result_description = mpesa_response.get(
                    "ResponseDescription",
                    "STK Push request was rejected."
                )
                payment.save()

                return Response(
                    {"error": payment.result_description},
                    status=status.HTTP_400_BAD_REQUEST
                )

            checkout_id = mpesa_response.get("CheckoutRequestID")

            if not checkout_id:
                payment.status = "FAILED"
                payment.result_description = "Missing M-Pesa checkout reference."
                payment.save()

                return Response(
                    {"error": payment.result_description},
                    status=status.HTTP_502_BAD_GATEWAY
                )

            payment.checkout_request_id = checkout_id
            payment.merchant_request_id = mpesa_response.get(
                "MerchantRequestID"
            )
            payment.save()

            return Response(
                {
                    "message": "STK Push sent successfully. Check your phone.",
                    "payment_id": payment.id,
                    "status": payment.status
                },
                status=status.HTTP_200_OK
            )

        except Exception:
            payment.status = "FAILED"
            payment.result_description = "Unable to initiate M-Pesa payment."
            payment.save()

            return Response(
                {"error": payment.result_description},
                status=status.HTTP_502_BAD_GATEWAY
            )


@method_decorator(csrf_exempt, name="dispatch")
class MpesaCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        callback_data = request.data.get("Body", {}).get(
            "stkCallback", {}
        )

        checkout_id = callback_data.get("CheckoutRequestID")
        result_code = callback_data.get("ResultCode")
        result_description = callback_data.get("ResultDesc", "")

        if not checkout_id:
            return Response({
                "ResultCode": 0,
                "ResultDesc": "Accepted"
            })

        with transaction.atomic():
            try:
                payment = Payment.objects.select_for_update().get(
                    checkout_request_id=checkout_id
                )
            except Payment.DoesNotExist:
                return Response({
                    "ResultCode": 0,
                    "ResultDesc": "Accepted"
                })

            # Ignore duplicate or previously processed callbacks.
            if payment.status != "PENDING":
                return Response({
                    "ResultCode": 0,
                    "ResultDesc": "Accepted"
                })

            payment.result_code = str(result_code)
            payment.result_description = result_description

            if str(result_code) == "0":
                metadata = callback_data.get(
                    "CallbackMetadata", {}
                ).get("Item", [])

                metadata_dict = {
                    item.get("Name"): item.get("Value")
                    for item in metadata
                }

                receipt = metadata_dict.get("MpesaReceiptNumber")
                paid_amount = metadata_dict.get("Amount")

                try:
                    paid_amount = Decimal(str(paid_amount))
                except (InvalidOperation, TypeError):
                    paid_amount = None

                subscription = payment.subscription

                if (
                    not receipt
                    or paid_amount != payment.amount
                    or subscription.status != "PENDING"
                    or Payment.objects.filter(
                        mpesa_receipt_number=receipt
                    ).exclude(pk=payment.pk).exists()
                ):
                    payment.status = "FAILED"
                    payment.result_description = "Payment verification failed."
                    payment.save()

                    return Response({
                        "ResultCode": 0,
                        "ResultDesc": "Accepted"
                    })

                payment.status = "SUCCESS"
                payment.mpesa_receipt_number = receipt
                payment.save()

                subscription.status = "ACTIVE"
                subscription.start_date = timezone.localdate()
                subscription.save()

            else:
                payment.status = "FAILED"
                payment.save()

        return Response({
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        })
class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.select_related(
                "subscription"
            ).get(
                id=pk,
                subscription__member=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "payment_id": payment.id,
            "status": payment.status,
            "amount": payment.amount,
            "receipt_number": payment.mpesa_receipt_number,
            "result_description": payment.result_description,
        })
class PaymentHistoryView(generics.ListAPIView):
        permission_classes = [IsAdminUser]
        serializer_class = PaymentHistorySerializer

        queryset = Payment.objects.select_related(
            "subscription",
            "subscription__member",
            "subscription__plan"
        ).order_by("-created_at")
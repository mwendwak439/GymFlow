from django.shortcuts import render

# Create your views here.

from django.contrib.auth import get_user_model
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from memberships.models import Subscription
from payments.models import Payment
from rest_framework.permissions import BasePermission
from datetime import date, datetime, timedelta
from django.utils import timezone
from memberships.models import Subscription, MembershipPlan

User = get_user_model()

class IsGymAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (
                request.user.role == "ADMIN"
                or request.user.is_superuser
            )
        )

class AdminDashboardStatsView(APIView):
    permission_classes = [IsGymAdmin]

    def get(self, request):

        total_members = User.objects.filter(
            role="MEMBER"
        ).count()

                # Membership plan performance
        plan_performance = []

        for plan in MembershipPlan.objects.all():
            member_count = Subscription.objects.filter(
                plan=plan
            ).values("member").distinct().count()

            plan_performance.append({
                "plan": plan.name,
                "members": member_count
            })

        active_subscriptions = Subscription.objects.filter(
            status="ACTIVE"
        ).count()

        expired_subscriptions = Subscription.objects.filter(
            status="EXPIRED"
        ).count()

                # Memberships expiring within the next 7 days
        today = timezone.localdate()
        expiry_limit = today + timedelta(days=7)

        expiring_subscriptions = Subscription.objects.filter(
            status="ACTIVE",
            end_date__gte=today,
            end_date__lte=expiry_limit
        ).select_related("member", "plan").order_by("end_date")

        total_revenue = Payment.objects.filter(
            status="SUCCESS"
        ).aggregate(
            total=Sum("amount")
        )["total"] or 0

        today = timezone.localdate()

        # Today's revenue
        today_start = timezone.make_aware(
            datetime.combine(today, datetime.min.time())
        )
        tomorrow_start = timezone.make_aware(
            datetime.combine(today + timezone.timedelta(days=1), datetime.min.time())
        )

        today_revenue = Payment.objects.filter(
            status="SUCCESS",
            created_at__gte=today_start,
            created_at__lt=tomorrow_start
        ).aggregate(total=Sum("amount"))["total"] or 0


        # This month's revenue
        month_start = timezone.make_aware(
            datetime.combine(today.replace(day=1), datetime.min.time())
        )

        if today.month == 12:
            next_month = date(today.year + 1, 1, 1)
        else:
            next_month = date(today.year, today.month + 1, 1)

        next_month_start = timezone.make_aware(
            datetime.combine(next_month, datetime.min.time())
        )

        month_revenue = Payment.objects.filter(
            status="SUCCESS",
            created_at__gte=month_start,
            created_at__lt=next_month_start
        ).aggregate(total=Sum("amount"))["total"] or 0


               # Monthly revenue and new members for the last six months
        monthly_revenue = []
        monthly_member_growth = []

        for i in range(5, -1, -1):
            month_index = today.year * 12 + today.month - 1 - i
            year, month = divmod(month_index, 12)
            month += 1

            start_date = date(year, month, 1)

            if month == 12:
                end_date = date(year + 1, 1, 1)
            else:
                end_date = date(year, month + 1, 1)

            start_datetime = timezone.make_aware(
                datetime.combine(start_date, datetime.min.time())
            )
            end_datetime = timezone.make_aware(
                datetime.combine(end_date, datetime.min.time())
            )

            revenue = Payment.objects.filter(
                status="SUCCESS",
                created_at__gte=start_datetime,
                created_at__lt=end_datetime
            ).aggregate(total=Sum("amount"))["total"] or 0

            new_members = User.objects.filter(
                role="MEMBER",
                date_joined__gte=start_datetime,
                date_joined__lt=end_datetime
            ).count()

            monthly_revenue.append({
                "month": start_date.strftime("%b %Y"),
                "revenue": float(revenue)
            })

            monthly_member_growth.append({
                "month": start_date.strftime("%b %Y"),
                "members": new_members
            })

        # Recent dashboard activity
        recent_payments = Payment.objects.select_related(
            "subscription__member",
            "subscription__plan"
        ).order_by("-created_at")[:5]

        recent_members = User.objects.filter(
            role="MEMBER"
        ).order_by("-date_joined")[:5]

        successful_payments = Payment.objects.filter(
            status="SUCCESS"
        ).count()

        failed_payments = Payment.objects.filter(
            status="FAILED"
        ).count()
        return Response({
            "total_members": total_members,
            "active_subscriptions": active_subscriptions,
            "expired_subscriptions": expired_subscriptions,
            "total_revenue": total_revenue,
            "today_revenue": today_revenue,
            "month_revenue": month_revenue,
            "successful_payments": successful_payments,
            "failed_payments": failed_payments,
            "monthly_revenue": monthly_revenue,
            "monthly_member_growth": monthly_member_growth,
            "plan_performance": plan_performance,
            "expiring_subscriptions": [
                {
                    "id": subscription.id,
                    "member": subscription.member.username,
                    "plan": subscription.plan.name,
                    "end_date": subscription.end_date,
                }
                for subscription in expiring_subscriptions
            ],
            "recent_payments": [
                {
                    "id": payment.id,
                    "member": payment.subscription.member.username,
                    "plan": payment.subscription.plan.name,
                    "amount": payment.amount,
                    "status": payment.status,
                    "receipt": payment.mpesa_receipt_number,
                    "date": payment.created_at,
                }
                for payment in recent_payments
    ],

            "recent_members": [
                {
                    "id": member.id,
                    "username": member.username,
                    "email": member.email,
                    "date_joined": member.date_joined,
                }
                for member in recent_members
            ],
        })

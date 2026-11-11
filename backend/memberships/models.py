
from django.conf import settings
from django.db import models
from django.utils import timezone
from calendar import monthrange


def calculate_expiry_date(start_date, duration):
    months = {
        "MONTHLY": 1,
        "QUARTERLY": 3,
        "YEARLY": 12,
    }

    total_months = start_date.month - 1 + months[duration]
    year = start_date.year + total_months // 12
    month = total_months % 12 + 1

    day = min(start_date.day, monthrange(year, month)[1])

    return start_date.replace(year=year, month=month, day=day)


class MembershipPlan(models.Model):

    DURATION_CHOICES = [
        ("MONTHLY", "Monthly"),
        ("QUARTERLY", "Quarterly"),
        ("YEARLY", "Yearly"),
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    duration = models.CharField(
        max_length=20,
        choices=DURATION_CHOICES
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("EXPIRED", "Expired"),
        ("CANCELLED", "Cancelled"),
    ]

    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="subscriptions"
    )

    plan = models.ForeignKey(
        MembershipPlan,
        on_delete=models.PROTECT,
        related_name="subscriptions"
    )

    start_date = models.DateField(default=timezone.localdate)
    end_date = models.DateField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.plan_id and self.start_date:
            self.end_date = calculate_expiry_date(
                self.start_date,
                self.plan.duration
            )

        if self.end_date and self.status != "CANCELLED":
            if self.end_date <= timezone.localdate():
                self.status = "EXPIRED"
            else:
                self.status = "ACTIVE"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.member.username} - {self.plan.name}"

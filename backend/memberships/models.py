from django.db import models

# Create your models here.

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
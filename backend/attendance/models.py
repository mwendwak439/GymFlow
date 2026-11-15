from  django.db import models
from django.conf import settings 


class Attendance(models.Model):
    members =models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )
    check_in =models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-check_in']


    def __str__(self):
     return f"{self.members.username} - {self.check_in}"

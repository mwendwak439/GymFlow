from django.urls import path
from .views import (
    InitiateSTKPushView,
    MpesaCallbackView,
    PaymentStatusView,
    PaymentHistoryView
)


urlpatterns = [
    path(
        "initiate-stk/",
        InitiateSTKPushView.as_view(),
        name="initiate-stk"
    ),
    path(
        "callback/",
        MpesaCallbackView.as_view(),
        name="mpesa-callback"
    ),
    path(
    "<int:pk>/status/",
    PaymentStatusView.as_view(),
    name="payment-status"
     ),
     path(
    "history/",
    PaymentHistoryView.as_view(),
    name="payment-history"
),
]
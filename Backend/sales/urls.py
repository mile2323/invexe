from django.urls import path
from .views import customer_detail, customer_list, quotation_detail, quotation_list,send_quotation_email, preview_quotation_template

urlpatterns = [
    path('customers/', customer_list, name='customer-list'),
    path('customers/<str:pk>/', customer_detail, name='customer-detail'),
    path('quotations/', quotation_list, name='quotation-list'),
    path('quotations/<str:pk>/', quotation_detail, name='quotation-detail'),
    path('send-quotation-email/<str:quotation_id>/', send_quotation_email, name='send-quotation-email'),
    path("quotation/preview/<str:quotation_id>/", preview_quotation_template, name="preview_quotation"),
]
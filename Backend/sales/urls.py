from django.urls import path
from .views import customer_detail, customer_list, quotation_detail, quotation_list

urlpatterns = [
    path('customers/', customer_list, name='customer-list'),
    path('customers/<str:pk>/', customer_detail, name='customer-detail'),
    path('quotations/', quotation_list, name='quotation-list'),
    path('quotations/<str:pk>/', quotation_detail, name='quotation-detail'),
]
from django.urls import path
from .views import customer_detail, customer_list

urlpatterns = [
    path('customers/', customer_list, name='customer-list'),
    path('customers/<str:pk>/', customer_detail, name='customer-detail'),
]
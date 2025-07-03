from django.urls import path
from .views import supplier_list,supplier_detail

urlpatterns = [
    path('suppliers/', supplier_list, name='supplier-list'),
    path('suppliers/<str:pk>/', supplier_detail, name='supplier-detail'),
]
from django.urls import path
from .views import product_list, product_detail, service_list, service_detail
urlpatterns = [
    path('products/', product_list, name='product-list'),
    path('products/<str:pk>/', product_detail, name='product-detail'),
    path('services/', service_list, name='service-list'),
    path('services/<str:pk>/', service_detail, name='service-detail'),
]
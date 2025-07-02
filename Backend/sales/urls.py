from django.urls import path
from views import suplier_list,suplier_detail

urlpatterns = [
    path('supliers/', suplier_list, name='suplier-list'),
    path('supliers/<str:pk>/', suplier_detail, name='suplier-detail'),
]
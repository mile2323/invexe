from django.urls import path
from .views import quotation_list_create, convert_quotation

urlpatterns = [
    path('quotations/', quotation_list_create, name='quotation-list-create'),
    path('quotations/<str:quotation_id>/convert/', convert_quotation, name='quotation-convert'),
]
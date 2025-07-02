from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Customer, Quotation, QuotationItem, SalesOrder, SalesOrderItem

class QuotationItemSerializer(DocumentSerializer):
    class Meta:
        model = QuotationItem
        fields = '__all__'

class QuotationSerializer(DocumentSerializer):
    items = QuotationItemSerializer(many=True)
    
    class Meta:
        model = Quotation
        fields = ['id', 'quotation_number', 'customer', 'items', 'total_amount', 'status', 'created_at', 'updated_at']

class SalesOrderItemSerializer(DocumentSerializer):
    class Meta:
        model = SalesOrderItem
        fields = '__all__'

class SalesOrderSerializer(DocumentSerializer):
    items = SalesOrderItemSerializer(many=True)
    quotation = QuotationSerializer(read_only=True)
    
    class Meta:
        model = SalesOrder
        fields = ['id', 'so_number', 'customer', 'quotation', 'items', 'total_amount', 'status', 'created_at', 'updated_at']
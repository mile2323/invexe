from mongoengine import Document, StringField, EmailField, ReferenceField, ListField, EmbeddedDocument, EmbeddedDocumentField, FloatField
from core.models import BaseDocument

class Customer(BaseDocument):
    name = StringField(required=True, max_length=100)
    email = EmailField(unique=True)
    phone = StringField(max_length=15)
    address = StringField(max_length=200)
    meta = {'collection': 'customers'}

class QuotationItem(EmbeddedDocument):
    product_id = StringField(required=True)
    quantity = FloatField(required=True)
    unit_price = FloatField(required=True)
    total = FloatField()

class Quotation(BaseDocument):
    quotation_number = StringField(unique=True)
    customer = ReferenceField(Customer, required=True)
    items = ListField(EmbeddedDocumentField(QuotationItem))
    total_amount = FloatField()
    status = StringField(choices=['Draft', 'Sent', 'Accepted', 'Rejected'], default='Draft')
    meta = {'collection': 'quotations'}

class SalesOrderItem(EmbeddedDocument):
    product_id = StringField(required=True)
    quantity = FloatField(required=True)
    unit_price = FloatField(required=True)
    total = FloatField()

class SalesOrder(BaseDocument):
    so_number = StringField(unique=True)
    customer = ReferenceField(Customer, required=True)
    quotation = ReferenceField(Quotation)
    items = ListField(EmbeddedDocumentField(SalesOrderItem))
    total_amount = FloatField()
    status = StringField(choices=['Pending', 'Confirmed', 'Shipped', 'Delivered'], default='Pending')
    meta = {'collection': 'sales_orders'}
from mongoengine import Document, StringField, ReferenceField, FloatField, DateTimeField,EmbeddedDocument, EmbeddedDocumentField, ListField
from core.models import BaseDocument

import datetime

class Product(BaseDocument):
    product_id = StringField(unique=True, required=True)
    name = StringField(required=True, max_length=100)
    description = StringField()
    unit_price = FloatField()
    quantity_in_stock = FloatField(default=0.0)
    
    meta = {'collection': 'products'}

class Service(BaseDocument):
    service_code = StringField(unique=True, required=True)
    name = StringField(required=True, max_length=100)
    description = StringField()
    unit_price = FloatField()
    meta = {'collection': 'services'}




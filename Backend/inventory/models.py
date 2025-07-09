from mongoengine import Document, StringField, ReferenceField, FloatField, DateTimeField,EmbeddedDocument, EmbeddedDocumentField, ListField
from core.models import BaseDocument

import datetime

class Product(BaseDocument):
    product_id = StringField(unique=True, allow_blank=True,required=False)
    name = StringField(required=True, max_length=100)
    description = StringField(allow_blank=True, max_length=500)
    # unit_price = FloatField()
    quantity_in_stock = FloatField(default=0.0)
    
    meta = {'collection': 'products'}

class Service(BaseDocument):
    name = StringField( max_length=100)
    description = StringField(max_length=500, allow_blank=True)
    rate = FloatField(allow_blank=True, default=0.0)
    meta = {'collection': 'services'}




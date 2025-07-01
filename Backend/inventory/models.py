from mongoengine import Document, StringField, ReferenceField, FloatField, DateTimeField
from core.models import BaseDocument

class Product(BaseDocument):
    product_code = StringField(unique=True, required=True)
    name = StringField(required=True, max_length=100)
    description = StringField()
    unit_price = FloatField()
    reorder_level = FloatField(default=0)
    meta = {'collection': 'products'}

class Warehouse(BaseDocument):
    name = StringField(required=True, max_length=100)
    location = StringField(max_length=200)
    meta = {'collection': 'warehouses'}

class Inventory(BaseDocument):
    product = ReferenceField(Product, required=True)
    warehouse = ReferenceField(Warehouse, required=True)
    quantity = FloatField(default=0)
    meta = {'collection': 'inventory'}

class StockMovement(BaseDocument):
    product = ReferenceField(Product, required=True)
    warehouse = ReferenceField(Warehouse, required=True)
    quantity = FloatField(required=True)
    movement_type = StringField(choices=['IN', 'OUT'], required=True)
    reference = StringField()
    movement_date = DateTimeField(default=datetime.datetime.now)
    meta = {'collection': 'stock_movements'}
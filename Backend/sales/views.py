from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Quotation, QuotationItem, SalesOrder, SalesOrderItem
from .serializers import QuotationSerializer, SalesOrderSerializer
from inventory.models import Inventory, StockMovement
from mongoengine.errors import ValidationError

@api_view(['GET', 'POST'])
def quotation_list_create(request):
    if request.method == 'GET':
        quotations = Quotation.objects.all()
        serializer = QuotationSerializer(quotations, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = request.data
        items_data = data.pop('items', [])
        quotation = Quotation(**data)
        quotation.items = [
            QuotationItem(
                product_id=item['product_id'],
                quantity=item['quantity'],
                unit_price=item['unit_price'],
                total=item['quantity'] * item['unit_price']
            ) for item in items_data
        ]
        quotation.total_amount = sum(item.total for item in quotation.items)
        quotation.save()
        serializer = QuotationSerializer(quotation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def convert_quotation(request, quotation_id):
    try:
        quotation = Quotation.objects.get(id=quotation_id)
        if quotation.status != 'Accepted':
            return Response({'error': 'Quotation must be accepted'}, status=status.HTTP_400_BAD_REQUEST)
        
        sales_order = SalesOrder(
            so_number=f"SO-{quotation.quotation_number}",
            customer=quotation.customer,
            quotation=quotation,
            items=[
                SalesOrderItem(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    total=item.total
                ) for item in quotation.items
            ],
            total_amount=quotation.total_amount,
            status='Pending'
        )
        
        # Check and update inventory
        for item in sales_order.items:
            inventory = Inventory.objects(product=item.product_id).first()
            if not inventory or inventory.quantity < item.quantity:
                return Response({'error': f'Insufficient stock for {item.product_id}'}, status=status.HTTP_400_BAD_REQUEST)
            inventory.update(dec__quantity=item.quantity)
            StockMovement(
                product=item.product_id,
                warehouse=inventory.warehouse,
                quantity=item.quantity,
                movement_type='OUT',
                reference=sales_order.so_number
            ).save()
        
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Quotation.DoesNotExist:
        return Response({'error': 'Quotation not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
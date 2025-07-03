from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Supplier
from .serializers import SupplierSerializer

@api_view(['GET', 'POST'])
def supplier_list(request):
    if request.method == 'GET':
        Suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(Suppliers, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SupplierSerializer(data=request.data)
        print("Request data:", serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def supplier_detail(request, pk):
    try:
        Supplier = Supplier.objects.get(pk=pk)
    except Supplier.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SupplierSerializer(Supplier)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = SupplierSerializer(Supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        Supplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
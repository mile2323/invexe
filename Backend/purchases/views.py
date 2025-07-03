from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Suplier
from .serializers import SuplierSerializer

@api_view(['GET', 'POST'])
def suplier_list(request):
    if request.method == 'GET':
        supliers = Suplier.objects.all()
        serializer = SuplierSerializer(supliers, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SuplierSerializer(data=request.data)
        print("Request data:", serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def suplier_detail(request, pk):
    try:
        suplier = Suplier.objects.get(pk=pk)
    except Suplier.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SuplierSerializer(suplier)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = SuplierSerializer(suplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        suplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
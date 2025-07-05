from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Product, Service

class ProductSerializer(DocumentSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        product = Product(**validated_data)
        product.save()
        return product

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ServiceSerializer(DocumentSerializer):
    class Meta:
        model = Service
        fields = '__all__'

    def create(self, validated_data):
        service = Service(**validated_data)
        service.save()
        return service
    

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

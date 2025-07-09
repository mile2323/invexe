from rest_framework_mongoengine.serializers import DocumentSerializer,serializers
from .models import Product, Service

class ProductSerializer(DocumentSerializer):
    product_id = serializers.CharField( allow_blank=True, required=False)
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
    description = serializers.CharField(allow_blank=True, max_length=500)
    class Meta:
        model = Service
        fields = '__all__'


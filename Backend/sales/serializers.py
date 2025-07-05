from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from .models import BillingAddress, TaxInfo, BankInfo, Customer
from bson import ObjectId

class BillingAddressSerializer(EmbeddedDocumentSerializer):
    class Meta:
        model = BillingAddress
        fields = '__all__'

class TaxInfoSerializer(EmbeddedDocumentSerializer):
    class Meta:
        model = TaxInfo
        fields = '__all__'

class BankInfoSerializer(EmbeddedDocumentSerializer):
    class Meta:
        model = BankInfo
        fields = '__all__'

class CustomerSerializer(DocumentSerializer):
    # Add id field to expose ObjectId
    id = serializers.CharField(source='_id', read_only=True)
    # Flat fields for input
    addressLine1 = serializers.CharField(max_length=200, allow_blank=True, write_only=True)
    addressLine2 = serializers.CharField(max_length=200, allow_blank=True, write_only=True)
    city = serializers.CharField(max_length=50, allow_blank=True, write_only=True)
    pinCode = serializers.CharField(max_length=50, allow_blank=True, write_only=True)
    state = serializers.CharField(max_length=50, allow_blank=True, write_only=True)
    country = serializers.CharField(max_length=50, allow_blank=True, write_only=True)
    gstNo = serializers.CharField(max_length=15, allow_blank=True, write_only=True)
    panNo = serializers.CharField(max_length=10, allow_blank=True, write_only=True)
    msme = serializers.CharField(max_length=5, allow_blank=True, write_only=True)
    enterpriseType = serializers.CharField(max_length=50, allow_blank=True, write_only=True)
    bankName = serializers.CharField(max_length=30, allow_blank=True, write_only=True)
    accountNo = serializers.CharField(max_length=20, allow_blank=True, write_only=True)
    ifscCode = serializers.CharField(max_length=15, allow_blank=True, write_only=True)
    branchCode = serializers.CharField(max_length=20, allow_blank=True, write_only=True)
    branchAddress = serializers.CharField(max_length=200, allow_blank=True, write_only=True)
    email = serializers.EmailField(allow_blank=False)  # Match model required=True

    class Meta:
        model = Customer
        fields = '__all__'
        extra_kwargs = {
            'billingAddress': {'read_only': True},
            'taxInfo': {'read_only': True},
            'bankinfo': {'read_only': True}
        }

    def create(self, validated_data):
        # Extract flat fields for embedded documents
        billing_address_data = {
            'addressLine1': validated_data.pop('addressLine1', ''),
            'addressLine2': validated_data.pop('addressLine2', ''),
            'city': validated_data.pop('city', ''),
            'pinCode': validated_data.pop('pinCode', ''),
            'state': validated_data.pop('state', ''),
            'country': validated_data.pop('country', '')
        }
        tax_info_data = {
            'gstNo': validated_data.pop('gstNo', ''),
            'panNo': validated_data.pop('panNo', ''),
            'msme': validated_data.pop('msme', ''),
            'enterpriseType': validated_data.pop('enterpriseType', '')
        }
        bank_info_data = {
            'bankName': validated_data.pop('bankName', ''),
            'accountNo': validated_data.pop('accountNo', ''),
            'ifscCode': validated_data.pop('ifscCode', ''),
            'branchCode': validated_data.pop('branchCode', ''),
            'branchAddress': validated_data.pop('branchAddress', '')
        }

        # Create Customer instance
        customer = Customer(**validated_data)

        # Set single embedded documents
        if any(billing_address_data.values()):
            customer.billingAddress = BillingAddress(**billing_address_data)
        if any(tax_info_data.values()):
            customer.taxInfo = TaxInfo(**tax_info_data)
        if any(bank_info_data.values()):
            customer.bankinfo = BankInfo(**bank_info_data)

        customer.save()
        return customer

    def update(self, instance, validated_data):
        # Extract flat fields
        billing_address_data = {
            'addressLine1': validated_data.pop('addressLine1', ''),
            'addressLine2': validated_data.pop('addressLine2', ''),
            'city': validated_data.pop('city', ''),
            'pinCode': validated_data.pop('pinCode', ''),
            'state': validated_data.pop('state', ''),
            'country': validated_data.pop('country', '')
        }
        tax_info_data = {
            'gstNo': validated_data.pop('gstNo', ''),
            'panNo': validated_data.pop('panNo', ''),
            'msme': validated_data.pop('msme', ''),
            'enterpriseType': validated_data.pop('enterpriseType', '')
        }
        bank_info_data = {
            'bankName': validated_data.pop('bankName', ''),
            'accountNo': validated_data.pop('accountNo', ''),
            'ifscCode': validated_data.pop('ifscCode', ''),
            'branchCode': validated_data.pop('branchCode', ''),
            'branchAddress': validated_data.pop('branchAddress', '')
        }

        # Update main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update single embedded documents rendition
        instance.billingAddress = BillingAddress(**billing_address_data) if any(billing_address_data.values()) else None
        instance.taxInfo = TaxInfo(**tax_info_data) if any(tax_info_data.values()) else None
        instance.bankinfo = BankInfo(**bank_info_data) if any(bank_info_data.values()) else None

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure ObjectId is included as string
        representation['id'] = str(instance.id)
        representation.update({
            'addressLine1': '',
            'addressLine2': '',
            'city': '',
            'pinCode': '',
            'state': '',
            'country': '',
            'gstNo': '',
            'panNo': '',
            'msme': '',
            'enterpriseType': '',
            'bankName': '',
            'accountNo': '',
            'ifscCode': '',
            'branchCode': '',
            'branchAddress': ''
        })
        # Flatten embedded documents
        if instance.billingAddress:
            representation.update({
                'addressLine1': instance.billingAddress.addressLine1 or '',
                'addressLine2': instance.billingAddress.addressLine2 or '',
                'city': instance.billingAddress.city or '',
                'pinCode': instance.billingAddress.pinCode or '',
                'state': instance.billingAddress.state or '',
                'country': instance.billingAddress.country or ''
            })
        if instance.taxInfo:
            representation.update({
                'gstNo': instance.taxInfo.gstNo or '',
                'panNo': instance.taxInfo.panNo or '',
                'msme': instance.taxInfo.msme or '',
                'enterpriseType': instance.taxInfo.enterpriseType or ''
            })
        if instance.bankinfo:
            representation.update({
                'bankName': instance.bankinfo.bankName or '',
                'accountNo': instance.bankinfo.accountNo or '',
                'ifscCode': instance.bankinfo.ifscCode or '',
                'branchCode': instance.bankinfo.branchCode or '',
                'branchAddress': instance.bankinfo.branchAddress or ''
            })
        representation.pop('billingAddress', None)
        representation.pop('taxInfo', None)
        representation.pop('bankinfo', None)
        return representation
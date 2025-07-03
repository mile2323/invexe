from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from .models import BillingAddress, TaxInfo, BankInfo, Supplier

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

class SupplierSerializer(DocumentSerializer):
    # Define flat fields to match formData (write-only for input)
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
    email = serializers.EmailField(allow_blank=True, write_only=True)  # Ignored in model

    class Meta:
        model = Supplier
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
        # validated_data.pop('email', None)  # Ignore email field

        # Create Supplier instance
        supplier = Supplier(**validated_data)

        # Add embedded documents if non-empty
        if any(billing_address_data.values()):
            supplier.billingAddress.append(BillingAddress(**billing_address_data))
        if any(tax_info_data.values()):
            supplier.taxInfo.append(TaxInfo(**tax_info_data))
        if any(bank_info_data.values()):
            supplier.bankinfo.append(BankInfo(**bank_info_data))
        print("daatta", validated_data)
        supplier.save()
        return supplier

    def update(self, instance, validated_data):
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
        # validated_data.pop('email', None)  # Ignore email field

        # Update main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update embedded documents
        instance.billingAddress = [BillingAddress(**billing_address_data)] if any(billing_address_data.values()) else []
        instance.taxInfo = [TaxInfo(**tax_info_data)] if any(tax_info_data.values()) else []
        instance.bankinfo = [BankInfo(**bank_info_data)] if any(bank_info_data.values()) else []

        instance.save()
        return instance

    def to_representation(self, instance):
        # Get default representation
        representation = super().to_representation(instance)
        # Initialize flat fields
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
            'branchAddress': '',
            'email': ''
        })
        # Flatten embedded documents
        if instance.billingAddress:
            billing = instance.billingAddress[0]
            representation.update({
                'addressLine1': billing.addressLine1 or '',
                'addressLine2': billing.addressLine2 or '',
                'city': billing.city or '',
                'pinCode': billing.pinCode or '',
                'state': billing.state or '',
                'country': billing.country or ''
            })
        if instance.taxInfo:
            tax = instance.taxInfo[0]
            representation.update({
                'gstNo': tax.gstNo or '',
                'panNo': tax.panNo or '',
                'msme': tax.msme or '',
                'enterpriseType': tax.enterpriseType or ''
            })
        if instance.bankinfo:
            bank = instance.bankinfo[0]
            representation.update({
                'bankName': bank.bankName or '',
                'accountNo': bank.accountNo or '',
                'ifscCode': bank.ifscCode or '',
                'branchCode': bank.branchCode or '',
                'branchAddress': bank.branchAddress or ''
            })
        # Remove nested fields from response
        representation.pop('billingAddress', None)
        representation.pop('taxInfo', None)
        representation.pop('bankinfo', None)
        return representation
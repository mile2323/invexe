from mongoengine import Document, StringField, EmailField, ReferenceField, ListField, EmbeddedDocument, EmbeddedDocumentField, FloatField, DateTimeField,DictField
from core.models import BaseDocument
from datetime import datetime, timezone
from inventory.models import Product



# class BillingAddress(EmbeddedDocument):
#     addressLine1=StringField(max_length=200)
#     addressLine2=StringField(max_length=200)
#     city=StringField(max_length=50)
#     pinCode=StringField(max_length=50)
#     state=StringField(max_length=50)
#     country=StringField(max_length=50)


# class TaxInfo(EmbeddedDocument):
#     gstNo=StringField(max_length=15)
#     panNo=StringField(max_length=10)
#     msme=StringField(max_length=5)
#     enterpriseType=StringField(max_length=50)

# class BankInfo(EmbeddedDocument):
#     bankName=StringField(max_length=30)
#     accountNo=StringField(max_length=20)
#     ifscCode=StringField(max_length=15)
#     branchCode=StringField(max_length=20)
#     branchAddress=StringField(max_length=200)





# class Customer(BaseDocument):
#     companyName = StringField(required=True, max_length=100)
#     billingAddress=EmbeddedDocumentField(BillingAddress)
#     ownerName=StringField(max_length=50)
#     contactPerson=StringField(max_length=50)
#     officeContact=StringField(max_length=10,default="")
#     plantContact=StringField(max_length=10,default="")
#     residenceContact=StringField(max_length=10,default="")
#     mobile=StringField(max_length=10)
#     email=EmailField(required=True, max_length=100)
#     organizationType=StringField(max_length=100)
#     businessNature=ListField()
#     taxInfo=EmbeddedDocumentField(TaxInfo)
#     bankinfo=EmbeddedDocumentField(BankInfo)
#     meta = {'collection': 'Customers',}


class Customer(BaseDocument):
    companyName = StringField(required=True, max_length=100)
    ownerName = StringField(max_length=50)
    contact = StringField(max_length=10)
    email = EmailField(required=True, max_length=100)
    address = StringField(max_length=200, default="")

    meta = {'collection': 'Customers',}


class QuotationForSale(Document):
    quotationNumber = StringField(required=True, max_length=50)
    customer = ReferenceField(Customer, required=True)
    customerName = StringField(max_length=100, required=True)  # Added for convenience
    customerContact = StringField(max_length=10)  # Added for convenience
    items = ListField(DictField(allow_blank=True))  # List of dictionaries to hold item details
    services = ListField(DictField(allow_blank=True))
    status = StringField(default="Draft", choices=["Draft", "Sent", "Accepted", "Rejected","Expired" ])
    discount = FloatField(default=0.0)
    tax = FloatField(default=0.0)
    totalAmount = FloatField(required=True)
    createdAt = DateTimeField(default=datetime.now(timezone.utc))

    meta = {'collection': 'QuotationsForSale',}
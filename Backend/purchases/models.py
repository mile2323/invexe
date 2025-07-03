from mongoengine import Document, StringField, EmailField, ReferenceField, ListField, EmbeddedDocument, EmbeddedDocumentField, FloatField
from core.models import BaseDocument



class BillingAddress(EmbeddedDocument):
    addressLine1=StringField(max_length=200)
    addressLine2=StringField(max_length=200)
    city=StringField(max_length=50)
    pinCode=StringField(max_length=50)
    state=StringField(max_length=50)
    country=StringField(max_length=50)


class TaxInfo(EmbeddedDocument):
    gstNo=StringField(max_length=15)
    panNo=StringField(max_length=10)
    msme=StringField(max_length=5)
    enterpriseType=StringField(max_length=50)

class BankInfo(EmbeddedDocument):
    bankName=StringField(max_length=30)
    accountNo=StringField(max_length=20)
    ifscCode=StringField(max_length=15)
    branchCode=StringField(max_length=20)
    branchAddress=StringField(max_length=200)





class Supplier(BaseDocument):
    companyName = StringField(required=True, max_length=100)
    billingAddress=ListField(EmbeddedDocumentField(BillingAddress))
    ownerName=StringField(max_length=50)
    contactPerson=StringField(max_length=50)
    officeContact=StringField(max_length=10)
    plantContact=StringField(max_length=10)
    residenceContact=StringField(max_length=10)
    mobile=StringField(max_length=10)
    email=EmailField(required=True, max_length=100)
    organizationType=StringField(max_length=100)
    businessNature=ListField()
    taxInfo=ListField(EmbeddedDocumentField(TaxInfo))
    bankinfo=ListField(EmbeddedDocumentField(BankInfo))


    meta = {'collection': 'Supplier'}




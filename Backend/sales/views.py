from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, QuotationForSale,BillForSale
from .serializers import QuotationForSaleSerializer
from .serializers import CustomerSerializer,BillForSaleSerializer
from inventory.models import Product
from inventory.serializers import ProductSerializer

from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.core.mail import EmailMessage
from weasyprint import HTML
from datetime import datetime
from num2words import num2words
from django.contrib.staticfiles import finders
import re

def convert_qut_to_inv(text):
    return re.sub(r'\bQUT(/[^/]+/[^/\s]+)', r'INV\1', text)















@api_view(['GET', 'POST'])
def customer_list(request):
    if request.method == 'GET':
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        print("Customers data:", serializer.data)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        print("Request data:", serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            print("Customer created:", serializer.data  )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def customer_detail(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    



@api_view(['GET', 'POST'])
def quotation_list(request):
    if request.method == 'GET':
        quotations = QuotationForSale.objects.all()
        serializer = QuotationForSaleSerializer(quotations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        print("Request data for quotation:", request.data)
        data = request.data.copy()

        # Clean up empty items list
        if (
            'items' in data and isinstance(data['items'], list)
            and len(data['items']) == 1
            and all(not v for v in data['items'][0].values())
        ):
            data['items'] = []

        # Clean up empty services list
        if (
            'services' in data and isinstance(data['services'], list)
            and len(data['services']) == 1
            and all(not v for v in data['services'][0].values())
        ):
            data['services'] = []

        # Get customer contact if customer is present
        customer = Customer.objects.get(pk=data.get('customer')) if data.get('customer') else None
        data['customerContact'] = customer.contact if customer else ""

        data['status'] = "Draft"  # Set default status to Draft

        serializer = QuotationForSaleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Serializer errors for quotation:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def bill(request, pk):
    try:
        quotation = QuotationForSale.objects.get(pk=pk)
    except QuotationForSale.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        bill = BillForSale.objects.get(quotation=quotation.id)
    except QuotationForSale.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BillForSaleSerializer(bill)
       
        # print(data['quotationNumber'])
       


        return Response(serializer.data)

    
@api_view(['POST'])
def genrate_bill(request, pk):
    try:
        quotation = QuotationForSale.objects.get(pk=pk)
    except QuotationForSale.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        data = request.data
        data['invoiceNo']=convert_qut_to_inv(data['invoiceNo'])
       
        serializer=BillForSaleSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            if not quotation.billGenrated:
                quotation.billGenrated = True
                quotation_serializer = QuotationForSaleSerializer(quotation, data={'billGenrated': True}, partial=True)
                if quotation_serializer.is_valid():
                    quotation_serializer.save()
                else:
                    print("Quotation update errors:", quotation_serializer.errors)
                    return Response(
                        {"error": "Bill created, but failed to update quotation", "details": quotation_serializer.errors},
                        status=status.HTTP_207_MULTI_STATUS
                    )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("error",serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    


@api_view(['GET', 'PUT', 'DELETE'])
def quotation_detail(request, pk):
    try:
        quotation = QuotationForSale.objects.get(pk=pk)
    except QuotationForSale.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = QuotationForSaleSerializer(quotation)
        data= serializer.data
        contact = ""
        contact=contact + quotation.customer.contact if quotation.customer and quotation.customer.contact else ""
        

        data['address']= quotation.customer.address if quotation.customer and quotation.customer.address else ""
        print("Quotation data:", data)
        return Response(data)
    
    elif request.method == 'PUT':
        serializer = QuotationForSaleSerializer(quotation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        quotation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  
    




import base64
from django.conf import settings
import os

@api_view(['GET'])
def send_quotation_email(request, quotation_id):
    try:
        quotation = QuotationForSale.objects.get(pk=quotation_id)
    except QuotationForSale.DoesNotExist:
        return Response({"error": "Quotation not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        customer = Customer.objects.get(pk=quotation.customer.id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

    contact = ""
    contact=contact + customer.contact if customer and customer.contact else ""
    
    # quotation['contact'] = contact
    # quotation['address']= customer.billingAddress.addressLine1 if customer and customer.billingAddress else ""
    items = quotation.items
    
    print(len(items))
        
    items = quotation.items or []
    tempItems = items.copy()
    for item in tempItems:
        quantity = str(item.get("quantity", "")).strip()
        unit_price = str(item.get("unit_price", "")).strip()

        if quantity and unit_price:
            try:
                item["total"] = float(quantity) * float(unit_price)
            except ValueError:
                item["total"] = 0.0  # fallback in case of invalid number format
                items=[]
        else:
            item["total"] = 0.0
            items=[]

    services = quotation.services or []
    for service in services:
        rate = str(service.get("rate", "")).strip()
        if rate:
            try:
                service["rate"] = float(rate)
            except ValueError:
                service["rate"] = 0.0
        else:
            service["rate"] = 0.0
    servTotal = 0.0
    for service in services:
       servTotal += float(service["rate"]) 

    subtotal = sum(item["total"] for item in items)+ servTotal
    after_discount = subtotal - (subtotal * (quotation.discount or 0) / 100)
    gst_amount = after_discount * (quotation.tax or 0) / 100
    grand_total = after_discount + gst_amount

    amount_in_words = num2words(grand_total, lang="en_IN").title() + " Only"

    # Embed logo image as base64
    logo_path = finders.find('images/company_logo.png')  # Only pass relative path inside 'static'

    if not logo_path:
        return Response({"error": "Logo image not found"}, status=500)
    with open(logo_path, 'rb') as image_file:
        logo_base64 = base64.b64encode(image_file.read()).decode('utf-8')

    html_string = render_to_string("quotation_template.html", {
        "quotation": quotation,
        "items": items,
        "services": services,
        "subtotal": after_discount,
        "gst_amount": gst_amount,
        "grand_total": grand_total,
        "date": datetime.now().strftime("%d/%m/%Y"),
        "amount_in_words": amount_in_words,
        "logo_base64": logo_base64,
        "contact": contact,
        "address": customer.address if customer and customer.address else "",

    })

    html = HTML(string=html_string)
    pdf_file = html.write_pdf()

    email = EmailMessage(
        subject=f"Quotation {quotation.quotationNumber}",
        body="Please find attached the quotation.",
        from_email="mile2323@gmail.com",
        to=[quotation.customer.email]  # Assuming customer has an email field
    )
    email.attach(f"Quotation_{quotation.quotationNumber}.pdf", pdf_file, "application/pdf")
    email.send()

    return JsonResponse({"status": "email sent"})

@api_view(['GET'])
def send_bill_email(request, quotation_id):
    try:
        quotation = QuotationForSale.objects.get(pk=quotation_id)
    except QuotationForSale.DoesNotExist:
        return Response({"error": "Quotation not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        customer = Customer.objects.get(pk=quotation.customer.id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        bill = BillForSale.objects.get(quotation=quotation_id)
    except BillForSale.DoesNotExist:
        return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

    # Prepare data
    contact = customer.contact if customer and customer.contact else "N/A"
    address = customer.address if customer and customer.address else "N/A"

    # Calculate item totals
    items = quotation.items or []
    for item in items:
        quantity = float(item.get("quantity", 0)) if item.get("quantity") else 0
        unit_price = float(item.get("unit_price", 0)) if item.get("unit_price") else 0
        item["total"] = quantity * unit_price

    # Calculate service totals
    services = quotation.services or []
    for service in services:
        service["rate"] = float(service.get("rate", 0)) if service.get("rate") else 0

    # Calculate total amount
    item_subtotal = sum(item["total"] for item in items)
    service_subtotal = sum(service["rate"] for service in services)
    total_amount = item_subtotal + service_subtotal

    # Calculate other taxes
    other_tax = bill.otherTax or []
    for tax in other_tax:
        tax_value = float(tax.get("value", 0)) if tax.get("value") else 0
        tax["amount"] = total_amount * tax_value / 100

    # Calculate other charges
    other_charges = bill.otherCharges or []
    for charge in other_charges:
        charge["rate"] = float(charge.get("rate", 0)) if charge.get("rate") else 0

    # Calculate grand total
    other_tax_total = sum(tax["amount"] for tax in other_tax)
    other_charge_total = sum(charge["rate"] for charge in other_charges)
    grand_total = total_amount + other_tax_total + other_charge_total
    after_discount = grand_total - (grand_total * (0 / 100))
    gst_amount = after_discount * (float(quotation.tax or 0) / 100)
    net_amount = after_discount + gst_amount
    round_off = net_amount - int(net_amount)
    net_payable = int(net_amount)
    amount_in_words = num2words(net_payable, lang="en_IN").title()

    # Embed logo image as base64
    logo_path = finders.find('images/company_logo.png')
    if not logo_path:
        return Response({"error": "Logo image not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    with open(logo_path, 'rb') as image_file:
        logo_base64 = base64.b64encode(image_file.read()).decode('utf-8')

    # Convert quotation number to invoice number
    bill_number = convert_qut_to_inv(quotation.quotationNumber) if quotation.quotationNumber else "N/A"

    # Render HTML template
    html_string = render_to_string("quotation_bill_template.html", {
        "quotation": quotation,
        "bill": bill,
        "items": items,
        "services": services,
        "total_amount": total_amount,
        "grand_total": after_discount,
        "gst_amount": gst_amount,
        "net_amount": net_amount,
        "round_off": round_off,
        "net_payable": net_payable,
        "amount_in_words": amount_in_words,
        "date": datetime.now().strftime("%d/%m/%Y"),
        "logo_base64": logo_base64,
        "contact": contact,
        "address": address,
    })

    # Generate PDF
    html = HTML(string=html_string)
    pdf_file = html.write_pdf()

    email = EmailMessage(
        subject=f"Bill {quotation.quotationNumber}",
        body="Please find attached the Bill.",
        from_email="mile2323stoen@gmail.com",
        to=[quotation.customer.email]  # Assuming customer has an email field
    )
    email.attach(f"Bill_{quotation.quotationNumber}.pdf", pdf_file, "application/pdf")
    email.send()

    return JsonResponse({"status": "email sent"})


from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from num2words import num2words
from .models import QuotationForSale  # Adjust import as needed

def preview_quotation_template(request, quotation_id):
    quotation = QuotationForSale.objects.get(pk=quotation_id)
    items = quotation.items  # assuming items is a list of dicts

    # Calculate totals
    for item in items:
        item["total"] = float(item["quantity"]) * float(item["unit_price"])

    subtotal = sum(item["total"] for item in items)
    after_discount = subtotal - (subtotal * (quotation.discount or 0) / 100)
    gst_amount = after_discount * (quotation.tax or 0) / 100
    grand_total = after_discount + gst_amount

    amount_in_words = num2words(grand_total, lang="en_IN").title() + " Only"

    return render(request, "quotation_template.html", {
        "quotation": quotation,
        "items": items,
        "subtotal": after_discount,
        "gst_amount": gst_amount,
        "grand_total": grand_total,
        "date": now().strftime("%d/%m/%Y"),
        "amount_in_words": amount_in_words,
    })

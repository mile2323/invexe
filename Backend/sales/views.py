from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, QuotationForSale
from .serializers import QuotationForSaleSerializer
from .serializers import CustomerSerializer
from inventory.models import Product
from inventory.serializers import ProductSerializer

from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.core.mail import EmailMessage
from weasyprint import HTML
from datetime import datetime
from num2words import num2words

@api_view(['GET', 'POST'])
def customer_list(request):
    if request.method == 'GET':
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        # print("Customers data:", serializer.data)
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
        # print("Request data for quotation:", request.data.get('items'))
        serializer = QuotationForSaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors for quotation:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
def quotation_detail(request, pk):
    try:
        quotation = QuotationForSale.objects.get(pk=pk)
    except QuotationForSale.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = QuotationForSaleSerializer(quotation)
        print("Quotation data:", serializer.data)
        
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = QuotationForSaleSerializer(quotation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        quotation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  
    




@api_view(['GET'])
def send_quotation_email(request, quotation_id):
    quotation = QuotationForSale.objects.get(pk=quotation_id)
    items = quotation.items  # items is a ListField of dicts
    print("Quotation items:", items)
    for item in items:
        item["total"] = float(item["quantity"]) * float(item["unit_price"])


    subtotal = sum(item["total"] for item in items)
    after_discount = subtotal - (subtotal * (quotation.discount or 0) / 100)
    gst_amount = after_discount * (quotation.tax or 0) / 100
    grand_total = after_discount + gst_amount

    amount_in_words = num2words(grand_total, lang="en_IN").title() + " Only"

    html_string = render_to_string("quotation_template.html", {
        "quotation": quotation,
        "items": items,
        "subtotal": after_discount,
        "gst_amount": gst_amount,
        "grand_total": grand_total,
        "date": datetime.now().strftime("%d/%m/%Y"),
        "amount_in_words": amount_in_words,
    })

    html = HTML(string=html_string)
    pdf_file = html.write_pdf()

    email = EmailMessage(
        subject=f"Quotation {quotation.quotationNumber}",
        body="Please find attached the quotation.",
        from_email="mile2323@gmail.com",
        to=["mk8884484@gmail.com"],  # or use quotation.customer.email if you prefer
    )
    email.attach(f"Quotation_{quotation.quotationNumber}.pdf", pdf_file, "application/pdf")
    email.send()

    return JsonResponse({"status": "email sent"})

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toWords } from 'number-to-words';

const QuotationContent = () => {
  const componentRef = useRef(null);
  const APIURL = import.meta.env.VITE_API_URL;
  const [quotation, setQuotation] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const { objectId } = useParams();
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${APIURL}/sales/send-quotation-email/${quotation.id}/`);
      setLoading(false);
      alert("Email sent successfully!");
    } catch (error) {
      setLoading(false);
      alert("Failed to send email.");
    }
  };

  const handlePrint = () => {
    if (componentRef.current) {
      setLoading(true);
      document.title = "Security Quotation";
      window.print();
      document.title = "Quotation App"; // Reset title after printing
      setLoading(false);
    } else {
      setLoading(false);
      alert("Quotation not ready to print yet.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APIURL}/sales/quotations/${objectId}/`);
        setQuotation(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch quotation data:", error);
        setLoading(false);
        alert("Failed to load quotation data. Please try again.");
      }
    };
    fetchData();
  }, [objectId, APIURL]);

  useEffect(() => {
    const calculateTotal = () => {
      const itemSubtotal = (quotation.items || []).reduce((total, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unit_price) || 0;
        return total + quantity * unitPrice;
      }, 0);

      const serviceSubtotal = (quotation.services || []).reduce((total, service) => {
        const rate = parseFloat(service.rate) || 0;
        return total + rate;
      }, 0);

      const subtotal = itemSubtotal + serviceSubtotal;
      console.log("Subtotal:", subtotal);
      const afterDiscount = subtotal - (subtotal * (quotation.discount || 0)) / 100;
      setTotalAmount(afterDiscount);
    };

    calculateTotal();
  }, [quotation]);

  const today = new Date().toLocaleDateString("en-IN");

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
        <div className="flex animate-pulse space-x-4">
          <div className="size-10 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-gray-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
              </div>
              <div className="h-2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 7.5mm;
            }
            .printable-area, .printable-area * {
              visibility: visible;
            }
            .printable-area {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              background: white;
              padding: 20px;
            }
            .heading-print {
              font-size: 32px !important;
              font-weight: bold !important;
              text-align: center !important;
              margin-bottom: 24px !important;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>

      <div className="flex justify-between mb-4">
        <h2 className="heading-print text-4xl font-bold mb-6 printable-area">
          Security Quotation
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            disabled={!quotation.quotationNumber}
            className="no-print"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print / Download
          </Button>
          <Button
            onClick={handleEmail}
            variant="secondary"
            disabled={!quotation.quotationNumber}
            className="no-print"
          >
            Send Email
          </Button>
        </div>
      </div>

      <div ref={componentRef} className="printable-area">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="text-right">
                <CardTitle>
                  {quotation.quotationNumber || "N/A"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Date: {today}</p>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="/company_logo.png"
                  alt="Company Logo"
                  className="h-12 w-auto"
                />
                <h1 className="text-2xl font-bold border-b-2 border-black pb-1">Milestone</h1>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <table style={{ width: "100%", marginBottom: "1rem", fontSize: "0.9rem" }}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>From (Company)</th>
      <th style={{ textAlign: "right" }}>To (Party)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ width: "50%", verticalAlign: "top", textAlign: "left" }}>
        <p><strong>Company:</strong> Milestone Soft Tech Pvt Ltd</p>
        <p>69/2, Vikas Nagar, Devpuri, Raipur CG</p>
        <p>Ph: 0771-4020500, 7587777550/51/52</p>
      </td>
      <td style={{ width: "50%", verticalAlign: "top", textAlign: "right" }}>
        <p><strong>Party Name:</strong> {quotation.customerName}</p>
        <p><strong>Address:</strong> {quotation.address}</p>
        <p><strong>Contact:</strong> {quotation.customerContact}</p>
      </td>
    </tr>
  </tbody>
</table>

            <div className="overflow-x-auto">
              <table className="w-full text-left border text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2">Description</th>
                    <th className="border px-3 py-2">Qty</th>
                    <th className="border px-3 py-2">Rate</th>
                    <th className="border px-3 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(!quotation.items || quotation.items.length === 0) && (!quotation.services || quotation.services.length === 0) ? (
                    <tr>
                      <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                        No quotation items or services found
                      </td>
                    </tr>
                  ) : (
                    <>
                      {quotation.items && quotation.items.map((item, index) => (
                        <tr key={`item-${index}`}>
                          <td className="border px-3 py-2">{index + 1}</td>
                          <td className="border px-3 py-2">{item.product_name}</td>
                          <td className="border px-3 py-2">{item.quantity}</td>
                          <td className="border px-3 py-2">{item.unit_price}</td>
                          <td className="border px-3 py-2">{(item.quantity * item.unit_price).toFixed(2)}</td>
                        </tr>
                      ))}
                      {quotation.services && quotation.services.map((serviceItem, index) => (
                        <tr key={`service-${index}`}>
                          <td className="border px-3 py-2">{(quotation.items ? quotation.items.length : 0) + index + 1}</td>
                          <td className="border px-3 py-2"><strong>{serviceItem.name}</strong>  ({serviceItem.description})</td>
                          <td className="border px-3 py-2">1</td>
                          <td className="border px-3 py-2">{serviceItem.rate}</td>
                          <td className="border px-3 py-2">{parseFloat(serviceItem.rate).toFixed(2)}</td>
                        </tr>
                      ))}
                    </>
                  )}
                  <tr className="font-semibold">
                    <td colSpan="4" className="border px-3 py-2 text-right">
                      Discount (%)
                    </td>
                    <td className="border px-3 py-2">{quotation.discount || 0}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td colSpan="4" className="border px-3 py-2 text-right">
                      Subtotal
                    </td>
                    <td className="border px-3 py-2">{totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="font-semibold text-blue-800">
                    <td colSpan="4" className="border px-3 py-2 text-right">
                      GST ({quotation.tax || 0}%)
                    </td>
                    <td className="border px-3 py-2">
                      {(totalAmount * (quotation.tax || 0) / 100).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="font-bold text-green-800">
                    <td colSpan="4" className="border px-3 py-2 text-right">
                      Grand Total
                    </td>
                    <td className="border px-3 py-2">
                      {(totalAmount + (totalAmount * (quotation.tax || 0) / 100)).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan="2" className="border px-3 py-2 text-right">
                      Amount In Words
                    </td>
                    <td colSpan="3" className="border px-3 py-2">
                      {toWords(Math.floor((totalAmount + (totalAmount * (quotation.tax || 0) / 100)))).toUpperCase()} Rupees Only
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <table className="w-full table-fixed border border-black border-collapse">
              <tbody>
                <tr>
                  <td className="w-[60%] border border-black p-4 align-top">
                    <h4 className="font-semibold mb-2">Bank Account Details</h4>
                    <ul className="list-disc ml-5">
                      <li>Bank: BANK OF BARODA, PACHPEDI NAKA, RAIPUR</li>
                      <li>A/c No: 86950500000005</li>
                      <li>IFSC Code: BARB0DBPUCH</li>
                      <li>In favor of: Milestone Soft Tech Pvt Ltd</li>
                    </ul>
                  </td>
                  <td className="w-[40%] border border-black p-4 text-center align-top">
                    <h4 className="font-semibold mb-2">Scan to Pay</h4>
                    <img
                      src="/qr-code.png"
                      alt="QR Code"
                      className="h-[150px] mx-auto"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border border-black border-collapse text-[0.85rem]">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left">Important Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-3">
                    <ol className="ml-5 list-decimal">
                      <li>GST will be applied as per government regulations.</li>
                      <li>Advance payment is required if applicable.</li>
                      <li>This quotation is valid for 15 days from the issue date.</li>
                      <li>Delivery of products and services depends on availability.</li>
                      <li>All disputes are subject to Raipur jurisdiction.</li>
                      <li>This is an electronically generated quotation and does not require a physical signature.</li>
                    </ol>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-right font-semibold mt-6">
             <p>Authorized Signatory</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationContent;
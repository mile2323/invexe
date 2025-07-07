import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuotationContent = () => {
  const componentRef = useRef(null);
  const APIURL = import.meta.env.VITE_API_URL;
  const [quotation, setQuotation] = useState({});
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { objectId } = useParams();

  const handleEmail = async () => {
  try {
    const response = await axios.get(`${APIURL}/sales/send-quotation-email/${quotation.id}/`);
    alert("Email sent successfully!");
  } catch (error) {
    alert("Failed to send email.");
  }
};

  const handlePrint = () => {
    if (componentRef.current) {
      document.title = "Security Quotation";
      window.print();
      document.title = "Quotation App"; // Reset title after printing
    } else {
      alert("Quotation not ready to print yet.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APIURL}/sales/quotations/${objectId}/`);
        setQuotation(response.data);
      } catch (error) {
        console.error("Failed to fetch quotation data:", error);
        alert("Failed to load quotation data. Please try again.");
      }
    };
    fetchData();
  }, [objectId, APIURL]);

  useEffect(() => {
    setItems(quotation.items || []);
    const subtotal =
      quotation.items?.reduce((acc, item) => acc + item.quantity * item.unit_price, 0) || 0;
    const afterDiscount = subtotal - (subtotal * (quotation.discount || 0)) / 100;
    setTotalAmount(afterDiscount);
  }, [quotation]);

  const today = new Date().toLocaleDateString("en-IN");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
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
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <div className="flex justify-between mb-4 no-print">
        <h2 className="text-2xl font-bold">Security Quotation</h2>
        <Button
          onClick={handlePrint}
          variant="outline"
          disabled={!quotation.quotationNumber}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print / Download
        </Button>
        <Button
      onClick={handleEmail}
      variant="secondary"
      disabled={!quotation.quotationNumber}
    >
      Send Email
    </Button>
      </div>

      <div ref={componentRef} className="printable-area">
        <Card>
          <CardHeader>
            <CardTitle>
              Quotation No: {quotation.quotationNumber || "N/A"}/1
            </CardTitle>
            <p className="text-sm text-muted-foreground">Date: {today}</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>Party Name:</strong> {quotation.customerName || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p>
                  <strong>Company:</strong> Milestone Soft Tech Pvt Ltd
                </p>
                <p>69/2, Vikas Nagar, Devpuri, Raipur CG</p>
                <p>Ph: 0771-4020500, 7587777550/51/52</p>
              </div>
            </div>

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
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                        No quotation items found
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2">{item.product_name}</td>
                        <td className="border px-3 py-2">{item.quantity}</td>
                        <td className="border px-3 py-2">{item.unit_price}</td>
                        <td className="border px-3 py-2">{item.quantity * item.unit_price}</td>
                      </tr>
                    ))
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
                </tbody>
              </table>
            </div>

            <p className="mt-4 italic text-sm">
              <strong>Amount in Words:</strong> Rupees Eighty Eight Thousand Five Hundred Only
            </p>

            <div>
              <h4 className="font-semibold mt-6 mb-2">Bank Account Details</h4>
              <ul className="list-disc ml-5">
                <li>Bank: BANK OF BARODA, PACHPEDI NAKA, RAIPUR</li>
                <li>A/c No: 86950500000005</li>
                <li>IFSC Code: BARB0DBPUCH</li>
                <li>In favor of: Milestone Soft Tech Pvt Ltd</li>
              </ul>
            </div>

            <div className="mt-4 text-xs space-y-1 text-muted-foreground">
              <p>
                <strong>Note:</strong> Amount negotiable based on work scope.
              </p>
              <p>We declare this reflects actual service pricing.</p>
              <p>Subject to Raipur Jurisdiction.</p>
              <p>
                <strong>PAN:</strong> AAGCM4183P | <strong>GST:</strong> 22AAGCM4183P2Z2
              </p>
            </div>

            <div className="text-right font-semibold mt-6">
              <p>For Milestone Soft Tech Pvt. Ltd.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationContent;
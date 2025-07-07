import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const QuotationContent = () => {
  const componentRef = useRef(null);
  const APIURL = import.meta.env.VITE_API_URL;
  const [quotations, setQuotations] = useState({});
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { objectId } = useParams();

  const handlePrint = useReactToPrint({
    content: () => {
      if (!componentRef.current) {
        console.error("No content to print: componentRef is null");
        return null;
      }
      return componentRef.current;
    },
    documentTitle: "Security Quotation",
  });

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const response = await axios.get(`${APIURL}/sales/quotations/${objectId}/`);
        setQuotations(response.data);
        console.log(response.data);
      } catch (err) {
        alert("Failed to load quotation data. Please try again.");
        console.error("Error fetching quotation data:", err);
      }
    };
    fetchQuotationData();
  }, [objectId, APIURL]);

  useEffect(() => {
    setItems(quotations.items || []);
    const total = quotations.items?.reduce((acc, item) => {
      return acc + item.quantity * item.unit_price;
    }, 0) || 0;
    setTotalAmount(total - (total * (quotations.discount || 0) / 100));
  }, [quotations]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Security Quotation</h2>
        <Button onClick={handlePrint} variant="outline" disabled={!quotations.quotationNumber}>
          <Printer className="w-4 h-4 mr-2" />
          Print / Download
        </Button>
      </div>

      <div ref={componentRef}>
        <Card>
          <CardHeader>
            <CardTitle>Quotation No: {quotations.quotationNumber || "N/A"}/1</CardTitle>
            <p className="text-sm text-muted-foreground">Date: 24/06/2025</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <div>
                <p><strong>Party Name:</strong> {quotations.customerName || "N/A"}</p>
              </div>
              <div className="text-right">
                <p><strong>Company:</strong> Milestone Soft Tech Pvt Ltd</p>
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
                        No quotation found
                      </td>
                    </tr>
                  ) : (
                    items.map((i, index) => (
                      <tr key={index}>
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2">{i.product_name}</td>
                        <td className="border px-3 py-2">{i.quantity}</td>
                        <td className="border px-3 py-2">{i.unit_price}</td>
                        <td className="border px-3 py-2">{parseInt(i.quantity * i.unit_price)}</td>
                      </tr>
                    ))
                  )}
                  <tr className="font-semibold">
                    <td colSpan="4" className="border px-3 py-2 text-right">Discount (%)</td>
                    <td className="border px-3 py-2">{quotations.discount || 0}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td colSpan="4" className="border px-3 py-2 text-right">Subtotal</td>
                    <td className="border px-3 py-2">{totalAmount}</td>
                  </tr>
                  <tr className="font-semibold text-blue-800">
                    <td colSpan="4" className="border px-3 py-2 text-right">GST ({quotations.tax || 0}%)</td>
                    <td className="border px-3 py-2">{(totalAmount * (quotations.tax || 0) / 100)}</td>
                  </tr>
                  <tr className="font-bold text-green-800">
                    <td colSpan="4" className="border px-3 py-2 text-right">Grand Total</td>
                    <td className="border px-3 py-2">{totalAmount + (totalAmount * (quotations.tax || 0) / 100)}</td>
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
              <p><strong>Note:</strong> Amount negotiable based on work scope.</p>
              <p>We declare this reflects actual service pricing.</p>
              <p>Subject to Raipur Jurisdiction.</p>
              <p><strong>PAN:</strong> AAGCM4183P | <strong>GST:</strong> 22AAGCM4183P2Z2</p>
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
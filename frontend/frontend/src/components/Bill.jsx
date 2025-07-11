import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toWords } from 'number-to-words';
import BillForm from "./BillForm";

const Bill = () => {
  const componentRef = useRef(null);
  const APIURL = import.meta.env.VITE_API_URL;
  const [quotation, setQuotation] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const { objectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [billGenrated,setBillGenrated] = useState(false)

  const handleEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${APIURL}/sales/send-bill-email/${quotation.id}/`);
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
      document.title = "Bill";
      window.print();
      document.title = "Bill"; // Reset title after printing
      setLoading(false);
    } else {
      setLoading(false);
      alert("Bill not ready to print yet.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APIURL}/sales/bill/${objectId}/`);
        setQuotation(response.data);
        setLoading(false);
        setBillGenrated(response.data.billGenrated);
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
    <>
    {billGenrated?
    <div className="p-6 bg-gray-100 min-h-screen">
      <style>
        {`
  @media print {
    @page {
      size: A4;
      margin: 10mm 10mm 15mm 10mm; /* top, right, bottom, left */
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact; /* preserve background colors */
      print-color-adjust: exact;
    }

    .printable-area, .printable-area * {
      visibility: visible;
    }

    .printable-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 190mm; /* A4 width minus 2x10mm margins */
      max-height: 277mm; /* A4 height minus margins */
      background: white;
      padding: 10mm;
      box-sizing: border-box;
      overflow: hidden;
    }

    .heading-print {
      font-size: 24pt !important;
      font-weight: bold !important;
      text-align: center !important;
      margin-bottom: 16pt !important;
    }

    .no-print {
      display: none !important;
    }

    /* Avoid content cutoff: force page breaks if needed */
    .page-break {
      page-break-before: always;
      break-before: page;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    table, th, td {
      border: 1px solid black;
    }

    th, td {
      padding: 4pt;
      font-size: 10pt;
    }

    /* Remove unnecessary shadows, effects, etc. */
    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`}

      </style>

      <div className="flex justify-between mb-4">
        <h2 className="heading-print text-4xl font-bold mb-6 printable-area">
          Bill
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

      <div ref={componentRef} className="printable-area " style={{ width: "794px" }}>
        <Card>
          
          <CardContent className="space-y-4 text-sm">
            


              <table className="w-full text-left border text-sm" style={{ marginBottom: "1rem", fontSize: "0.9rem", borderCollapse: "collapse" }}>
  <tbody>
    <tr>
      <td className="border px-3 py-1 align-top" style={{  textAlign: "left" }}>
         <div className="flex items-center space-x-4">
                <img
                  src="/company_logo.png"
                  alt="Company Logo"
                  className="h-12 w-auto"
                />
                <h1 className="text-2xl font-bold border-b-2 border-black pb-1">Milestone</h1>
              </div>
      </td>
      <td style={{ width: "50%", verticalAlign: "top", textAlign: "left" }}>
        <p>69/2, Vikas Nagar, Devpuri, Raipur CG, 492015</p>
        <p>India, Ph: 0771-4020500, 7587777550/51/52</p>
        <p>Email : milestonessoftech@gmail.com</p>
      </td>
    </tr>
   
  </tbody>
</table>
<h2
  style={{
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '16px',
    borderBottom: '2px solid #000',
    display: 'block',
    letterSpacing: '1px',
  }}
>
 TAX-INVOICE
</h2>
      

    <table style={{ fontSize: '0.9rem', borderCollapse: 'collapse', width: '100%' }}>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Invoice No:</strong> {quotation.quotationNumber || 'N/A'}
          </td>
          <td colSpan="3" style={{ border: '1px solid #000', textAlign: 'right' }}>
            <strong>Date:</strong> {today}
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Party Name:</strong> {quotation.customerName || 'N/A'}
          </td>
          <td colSpan="3" style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Address:</strong> {quotation.address || 'N/A'}
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>GST No:</strong>
          </td>
          <td style={{ border: '1px solid #000', textAlign: 'right' }}>22AAALM0982ZJ</td>
          <td style={{ border: '1px solid #000', textAlign: 'right' }}>
            <strong>State code:</strong>
          </td>
          <td style={{ border: '1px solid #000', textAlign: 'right' }}>22</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Kind Attention:</strong>
          </td>
          <td colSpan="3" style={{ border: '1px solid #000', textAlign: 'right' }}>
            
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Work Order No.</strong>
          </td>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Date</strong>
          </td>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Payment Terms</strong>
          </td>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>
            <strong>Other Comments</strong>
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ border: '1px solid #000', textAlign: 'left' }}></td>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}>As per Order/Full</td>
          <td style={{ border: '1px solid #000', textAlign: 'left' }}></td>
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
             <table className="w-full text-left border text-sm" style={{ marginBottom: "1rem", fontSize: "0.9rem", borderCollapse: "collapse" }}>
  <tbody>
    
    <tr>
      <td className="border px-3 py-1 align-top" style={{ textAlign: "left" }}>
        <strong>Company GST No:</strong>
      </td>
    <td className="border px-3 py-1 align-top" colSpan={3} style={{ textAlign: "left" }}>22AAALM0982ZJ</td>
    <td className="border px-3 py-1 align-top" colSpan={1} style={{ textAlign: "left" }}><strong>Bank A/c Details:</strong></td>

    </tr>
    <tr>
      <td className="border px-3 py-1 align-top" style={{ textAlign: "left" }}>
        <strong>Company State Code:</strong>
      </td>
      <td className="border px-3 py-1 align-top text-center" colSpan={2} style={{ verticalAlign: "middle" }} >22</td>
      <td className="border px-3 py-1 align-top text-[14px]" colSpan={1} style={{ textAlign: "left" }}>
        <strong>A/C Name:</strong>
      </td>
      <td className="border px-3 py-1 align-top" style={{ textAlign: "left" }}>
        MILESTONE SOFT TECH PVT LTD RAIPUR
      </td>
    </tr>
    <tr>
      <td className="border px-3 py-1 align-top" style={{ textAlign: "left" }}>
        <strong>Company's Pan No:</strong>
      </td>
      <td className="border px-3 py-1 align-top text-center" colSpan={3} style={{ verticalAlign: "middle" }}>
        AAGCM418P2Z2
      </td><td className="border px-3 py-1 align-top" colSpan={3} style={{ textAlign: "left" }}>
        <strong>A/C No:</strong> 86950500000005
      </td>
    </tr>
     <tr>
      <td className="border px-3 py-1 align-top" style={{ textAlign: "left" }}>
        <strong>Service Tax No:</strong>
      </td>
      <td className="border px-3 py-1 align-top" colSpan={3} style={{ textAlign: "left" }}>
       </td><td className="border px-3 py-1 align-top" colSpan={3} style={{ textAlign: "left" }}>
        <strong>IFSC CODE:-</strong> BARB0DBPUCH
      </td>
    </tr>
     <tr>
      <td className="border px-3 py-1 align-top" style={{ textAlign: "left" }}>
        
      </td>
      <td className="border px-3 py-1 align-top" colSpan={3} style={{ textAlign: "right" }}>
       </td>
       <td className="border px-3 py-1 align-top" colSpan={3} style={{ textAlign: "right" }}>
        <strong>BANK NAME:-</strong> BANK OF BARODA, PACHPEDI NAKA, RAIPUR
      </td>
    </tr>
    
  </tbody>
</table>

           

            <table className="w-full border border-black border-collapse text-[0.85rem]">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left">Declearation:-</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-3">
                    <ol className="ml-5 list-decimal">
                      <li>We Declare that this invoice shows the actual price of the goods/services described.</li>
                      <li>Cheque and demand drafts to be favour of Milestone Soft Tech Pvt Ltd. Raipur</li>
                      <li>All disputes are subject to Raipur jurisdiction.</li>
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
   :<BillForm  objId={objectId} />}</>
  );
};

export default Bill;
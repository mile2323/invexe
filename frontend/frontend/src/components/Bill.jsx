
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toWords } from "number-to-words";
import BillForm from "./BillForm";

const Bill = () => {
  const componentRef = useRef(null);
  const APIURL = import.meta.env.VITE_API_URL;
  const [quotation, setQuotation] = useState({});
  const [billdata, setBilldata] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const { objectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [billGenrated, setBillGenrated] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [netAmount, setNetamount] = useState(0);

  const handleEmail = async () => {
    try {
      if (!quotation.id) {
        setLoading(false);
        alert("No quotation ID available to send email.");
        return;
      }
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
      document.title = "Bill";
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
        let response;
        let billResponse;
        if (billGenrated) {
          [response, billResponse] = await Promise.all([
            axios.get(`${APIURL}/sales/quotations/${objectId}/`),
            axios.get(`${APIURL}/sales/bill/${objectId}/`),
          ]);
          setBilldata(billResponse.data);
        } else {
          response = await axios.get(`${APIURL}/sales/quotations/${objectId}/`);
        }
        setQuotation(response.data);
        setBillGenrated(response.data.billGenrated || false);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch quotation data:", error);
        setLoading(false);
        alert("Failed to load quotation data. Please try again.");
      }
    };
    fetchData();
  }, [objectId, APIURL, billGenrated]);

  useEffect(() => {
    if (Object.keys(billdata).length > 0) {
      console.log("bill data", billdata);
    }
  }, [billdata]);

  useEffect(() => {
    if (quotation.billGenrated !== undefined) {
      console.log("bill", quotation.billGenrated);
    }
  }, [quotation]);

  useEffect(() => {
    const calculateTotal = () => {
      if (!billGenrated) return;
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
      setTotalAmount(subtotal);
    };

    calculateTotal();
  }, [quotation, billGenrated]);

  useEffect(() => {
    const calculateGrandTotal = () => {
      if (!billGenrated) return;
      const validTotalAmount = isNaN(totalAmount) ? 0 : parseFloat(totalAmount.toFixed(2));
      const otherTaxtotal = (billdata.otherTax || []).reduce((total, item) => {
        const tax = parseFloat(item.value) || 0;
        return total + (validTotalAmount * tax / 100);
      }, validTotalAmount);

      const otherCharge = (billdata.otherCharges || []).reduce((total, other) => {
        const rate = parseFloat(other.rate) || 0;
        return total + rate;
      }, 0);

      const grandT = otherTaxtotal + otherCharge;
      console.log("grandTotal:", grandT);
      const afterDiscount = grandT - (grandT * (parseFloat(billdata.discount) || 0)) / 100;
      setGrandTotal(isNaN(afterDiscount) ? 0 : afterDiscount);
    };

    calculateGrandTotal();
  }, [billdata, billGenrated, totalAmount]);

  useEffect(() => {
    const calculateNetamount = () => {
      if (!billGenrated) return;
      const netAmt = grandTotal + (grandTotal * (quotation.tax || 0) / 100);
      setNetamount(netAmt);
    };

    calculateNetamount();
  }, [grandTotal, billGenrated]);

  const today = new Date().toLocaleDateString("en-IN");

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-md border p-4">
        <div className="flex animate-pulse space-x-4">
          <div className="size-10 rounded-full bg-black"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-black"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-black"></div>
                <div className="col-span-1 h-2 rounded bg-black"></div>
              </div>
              <div className="h-2 rounded bg-black"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {billGenrated ? (
        <div className="p-4 min-h-screen">
          <style>
            {`
  @media print {
    @page {
      size: A4;
      margin: 7mm;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .printable-area, .printable-area * {
      visibility: visible;
      color: #000000 !important;
      background: #FFFFFF !important;
    }

    .printable-area {
      position: relative;
      width: 196mm;
      background: #FFFFFF !important;
      padding: 4mm;
      box-sizing: border-box;
      break-inside: avoid;
    }

    .no-print {
      display: none !important;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      break-inside: avoid;
      page-break-inside: avoid;
      border-color: #000000 !important;
    }

    table, th, td {
      border: 1px solid #000000 !important;
      padding: 1.5pt;
      font-size: 8.5pt;
      color: #000000 !important;
      background: #FFFFFF !important;
    }

    .table-header {
      background: #FFFFFF !important;
      color: #000000 !important;
    }

    .declaration-table {
      break-before: auto;
      break-inside: avoid;
      margin-top: 6mm;
      margin-bottom: 6mm;
    }

    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`}
          </style>

          <div className="flex justify-between mb-3">
            <h2 className="text-3xl font-bold mb-4">Bill</h2>
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
              <CardContent className="space-y-2 text-sm">
                <table
                  className="w-full text-left border text-sm"
                  style={{ marginBottom: "6mm", borderCollapse: "collapse" }}
                >
                  <tbody>
                    <tr>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}>
                        <div className="flex items-center space-x-3">
                          <img src="/company_logo.png" alt="Company Logo" className="h-10 w-auto" />
                          <h1 className="text-xl font-bold border-b-2 border-black pb-0.5">Milestone</h1>
                        </div>
                      </td>
                      <td style={{ width: "50%", verticalAlign: "top", textAlign: "left" }}>
                        <p>69/2, Vikas Nagar, Devpuri, Raipur CG, 492015</p>
                        <p>India, Ph: 0771-4020500, 7587777550/51/52</p>
                        <p>Email: milestonessoftech@gmail.com</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "6mm",
                    borderBottom: "2px solid #000000",
                    display: "block",
                    letterSpacing: "0.5px",
                  }}
                >
                  TAX-INVOICE
                </h2>

                <table style={{ fontSize: "8.5pt", borderCollapse: "collapse", width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Invoice No:</strong> {billdata.invoceNo  || "N/A"}
                      </td>
                      <td colSpan="3" style={{ border: "1px solid #000000", textAlign: "right" }}>
                        <strong>Date:</strong> {today}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Party Name:</strong> {quotation.customerName || "N/A"}
                      </td>
                      <td colSpan="3" style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Address:</strong> {quotation.address || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>GST No:</strong>
                      </td>
                      <td style={{ border: "1px solid #000000", textAlign: "right" }}>22AAALM0982ZJ</td>
                      <td style={{ border: "1px solid #000000", textAlign: "right" }}>
                        <strong>State code:</strong>
                      </td>
                      <td style={{ border: "1px solid #000000", textAlign: "right" }}>22</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Kind Attention:</strong>
                      </td>
                      <td colSpan="3" style={{ border: "1px solid #000000", textAlign: "right" }}></td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Work Order No.</strong>
                      </td>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Date</strong>{today}
                      </td>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Payment Terms</strong>
                      </td>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>
                        <strong>Other Comments</strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ border: "1px solid #000000", textAlign: "left" }}>
                        No.{billdata.workOrderNo || "N/A"}
                      </td>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>As per Order/Full</td>
                      <td style={{ border: "1px solid #000000", textAlign: "left" }}>{billdata.comments || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border text-sm">
                    <thead className="table-header">
                      <tr>
                        <th className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>#</th>
                        <th className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>Description</th>
                        <th className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>Qty</th>
                        <th className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>Rate</th>
                        <th className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!quotation.items || quotation.items.length === 0) &&
                      (!quotation.services || quotation.services.length === 0) ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-2 px-1.5 text-center"
                            style={{ fontSize: "8.5pt" }}
                          >
                            No quotation items or services found
                          </td>
                        </tr>
                      ) : (
                        <>
                          {quotation.items &&
                            quotation.items.map((item, index) => (
                              <tr key={`item-${index}`}>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {index + 1}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {item.product_name}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {item.quantity}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {item.unit_price}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {(item.quantity * item.unit_price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          {quotation.services &&
                            quotation.services.map((serviceItem, index) => (
                              <tr key={`service-${index}`}>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {(quotation.items ? quotation.items.length : 0) + index + 1}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  <strong>{serviceItem.name}</strong> ({serviceItem.description})
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>1</td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {serviceItem.rate}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {parseFloat(serviceItem.rate).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                        </>
                      )}
                      <tr className="font-semibold">
                        <td
                          colSpan="4"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          Total
                        </td>
                        <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                          {totalAmount.toFixed(2)}
                        </td>
                      </tr>
                      {(!billdata.otherTax || billdata.otherTax.length === 0) &&
                      (!billdata.otherCharges || billdata.otherCharges.length === 0) ? (
                        <tr></tr>
                      ) : (
                        <>
                          {billdata.otherTax &&
                            billdata.otherTax.map((tax, index) => (
                              <tr key={`tax-${index}`}>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}></td>
                                <td
                                  colSpan="3"
                                  className="border px-1.5 py-0.5 text-right"
                                  style={{ fontSize: "8.5pt" }}
                                >
                                  {tax.tax_NameOrType} {tax.value}%
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {(totalAmount * (tax.value || 0) / 100).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          {billdata.otherCharges &&
                            billdata.otherCharges.map((other, index) => (
                              <tr key={`charge-${index}`}>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}></td>
                                <td
                                  colSpan="3"
                                  className="border px-1.5 py-0.5 text-right"
                                  style={{ fontSize: "8.5pt" }}
                                >
                                  {other.Description}
                                </td>
                                <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                                  {other.rate}
                                </td>
                              </tr>
                            ))}
                        </>
                      )}
                      <tr className="font-semibold">
                        <td
                          colSpan="4"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          Grand Total
                        </td>
                        <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                          {grandTotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-semibold">
                        <td
                          colSpan="4"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          GST ({quotation.tax || 0}%)
                        </td>
                        <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                          {(totalAmount * (quotation.tax || 0) / 100).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-semibold">
                        <td
                          colSpan="4"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          Net Amount
                        </td>
                        <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                          {netAmount.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-semibold">
                        <td
                          colSpan="4"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          Round Off
                        </td>
                        <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                          {(netAmount - Math.floor(netAmount)).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-semibold">
                        <td
                          colSpan="4"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          Net Payable
                        </td>
                        <td className="border px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                          {Math.floor(netAmount).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="font-semibold">
                        <td
                          colSpan="5"
                          className="border px-1.5 py-0.5 text-right"
                          style={{ fontSize: "8.5pt" }}
                        >
                          Amount In Words:{toWords(Math.floor(netAmount)).toUpperCase()} RUPEES ONLY
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                </div>

                <table
                  className="w-full text-left border text-sm declaration-table"
                  style={{ marginTop: "6mm", marginBottom: "6mm", borderCollapse: "collapse" }}
                >
                  <tbody>
                    <tr>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}>
                        <strong>Company GST No:</strong>
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={3}
                        style={{ textAlign: "left" }}
                      >
                        22AAALM0982ZJ
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={1}
                        style={{ textAlign: "left" }}
                      >
                        <strong>Bank A/c Details:</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}>
                        <strong>Company State Code:</strong>
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top text-center"
                        colSpan={2}
                        style={{ verticalAlign: "middle" }}
                      >
                        22
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={1}
                        style={{ textAlign: "left" }}
                      >
                        <strong>A/C Name:</strong>
                      </td>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}>
                        MILESTONE SOFT TECH PVT LTD RAIPUR
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}>
                        <strong>Company's Pan No:</strong>
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top text-center"
                        colSpan={3}
                        style={{ verticalAlign: "middle" }}
                      >
                        AAGCM418P2Z2
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={3}
                        style={{ textAlign: "left" }}
                      >
                        <strong>A/C No:</strong> 86950500000005
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}>
                        <strong>Service Tax No:</strong>
                      </td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={3}
                        style={{ textAlign: "left" }}
                      ></td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={3}
                        style={{ textAlign: "left" }}
                      >
                        <strong>IFSC CODE:</strong> BARB0DBPUCH
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-1.5 py-0.5 align-top" style={{ textAlign: "left" }}></td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={3}
                        style={{ textAlign: "right" }}
                      ></td>
                      <td
                        className="border px-1.5 py-0.5 align-top"
                        colSpan={3}
                        style={{ textAlign: "left" }}
                      >
                        <strong>BANK NAME:</strong> BANK OF BARODA, PACHPEDI NAKA, RAIPUR
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table
                  className="w-full border border-black border-collapse text-sm declaration-table"
                  style={{ marginTop: "6mm", marginBottom: "6mm" }}
                >
                  <thead>
                    <tr>
                      <th className="border border-black px-1.5 py-0.5 text-left" style={{ fontSize: "8.5pt" }}>
                        Declaration:
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1.5 py-0.5" style={{ fontSize: "8.5pt" }}>
                        <ol className="ml-4 list-decimal">
                          <li>We Declare that this invoice shows the actual price of the goods/services described.</li>
                          <li>Cheque and demand drafts to be favour of Milestone Soft Tech Pvt Ltd. Raipur</li>
                          <li>All disputes are subject to Raipur jurisdiction.</li>
                        </ol>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-right font-semibold mt-3">
                  <p>Authorized Signatory</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <BillForm objId={objectId} />
      )}
    </>
  );
};

export default Bill;

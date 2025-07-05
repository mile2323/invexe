export default function QuotationContent() {
  const data = [
    { id: 1, description: "Supply of security guard service (12 hr onsite)", quantity: 2, rate: 17500, amount: 35000 },
    { id: 2, description: "Supply of housekeeping staff/service (8 hr)", quantity: 2, rate: 12750, amount: 25500 },
    { id: 3, description: "Supply of 4wh. driver/service (8 hr)", quantity: 1, rate: 14500, amount: 14500 },
  ];
  const gst = 13500;
  const grandTotal = 88500;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Quotation</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sl. No.</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border p-2 text-center">{item.id}</td>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">{item.rate.toLocaleString()}</td>
              <td className="border p-2 text-right">{item.amount.toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td className="border p-2" colSpan={4}>GST 18%</td>
            <td className="border p-2 text-right">{gst.toLocaleString()}</td>
          </tr>
          <tr className="font-bold bg-gray-100">
            <td className="border p-2" colSpan={4}>Grand Total</td>
            <td className="border p-2 text-right">{grandTotal.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-sm italic">Amount in Words: Rupees Eighty Eight Thousand Five Hundred Only</p>
    </div>
  );
}

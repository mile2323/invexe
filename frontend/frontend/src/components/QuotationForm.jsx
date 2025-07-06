import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const QuotationForm = () => {
  const navigate = useNavigate();

  const [quotationData, setQuotationData] = useState({
    quotationNumber: `QUO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerName: "",
    customer_id: "",
    items: [{ product_id: "", quantity: "", unit_price: "",product_name:"" }],
    totalAmount: 0,
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerResponse, productResponse] = await Promise.all([
          axios.get(`${API_URL}/sales/customers`),
          axios.get(`${API_URL}/inventory/products`),
        ]);
        setCustomers(customerResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load customers or products. Please try again.");
      }
    };
    fetchData();
  }, []);

  const calculateTotalAmount = () => {
    return quotationData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return total + quantity * unitPrice;
    }, 0);
  };

  const handleCustomerChange = (e) => {
    setQuotationData((prev) => ({ ...prev, customer_id: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotationData.items];

    if (field === "product_id") {
      const selectedProduct = products.find((p) => p.id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        product_id: value,
        unit_price: selectedProduct ? selectedProduct.unit_price : "",
        product_name:selectedProduct.name
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }

    setQuotationData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setQuotationData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: "", unit_price: "" }],
    }));
  };

  const removeItem = (index) => {
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      quotationNumber: `QUO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerName: customers.find((c) => c.id === quotationData.customer_id)?.companyName || "",
      customer: quotationData.customer_id,
      items: quotationData.items,
      totalAmount: calculateTotalAmount(),
    };

    console.log("Submitting quotation data:", submissionData);

    try {
      await axios.post(`${API_URL}/sales/quotations/`, submissionData);
      alert("Quotation created successfully!");
      setQuotationData({
        quotationNumber: `QUO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customer_id: "",
        items: [{ product_id: "", quantity: "", unit_price: "" }],
      });
      navigate("/sales");
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Error creating quotation. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Quotation</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Quotation Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
              <input
                type="text"
                value={quotationData.quotationNumber}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer *</label>
              <select
                value={quotationData.customer_id}
                onChange={handleCustomerChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="text"
                value={calculateTotalAmount().toFixed(2)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
          {quotationData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product *</label>
                <select
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="number"
                  value={item.unit_price}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                  readOnly
                />
              </div>
              <div className="flex items-end">
                {quotationData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
          >
            Add Item
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationForm;

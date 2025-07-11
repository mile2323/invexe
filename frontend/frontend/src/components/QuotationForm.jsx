import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const QuotationForm = () => {
  const navigate = useNavigate();

  const [quotationData, setQuotationData] = useState({
    quotationNumber: `QUT/Mile/E`,
    customerName: "",
    customer_id: "",
    items: [{ product_id: "", quantity: "", unit_price: "", product_name: "", amount: "" }],
    services: [{name:"", description: "", rate: "" }],
    discount: 0,
    tax: 0,
    totalAmount: 0,
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [quotation, setQuotation] = useState();
  const [isCustomerAccordionOpen, setIsCustomerAccordionOpen] = useState(false);
  const [isServiceAccordionOpen, setIsServiceAccordionOpen] = useState(false);
  const [isProductAccordionOpen, setIsProductAccordionOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    companyName: "",
    ownerName: "",
    contact: "",
    email: "",
    address: "",
  });
  const [newServiceData, setNewServiceData] = useState({
    name: "",
    description: "",
    rate: "",
  });
  const [newProductData, setNewProductData] = useState({
    name: "",
    unit_price: "",
  });

  const customerAccordionRef = useRef(null);
  const serviceAccordionRef = useRef(null);
  const productAccordionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerResponse, productResponse, quotationRes, serviceResponse] = await Promise.all([
          axios.get(`${API_URL}/sales/customers`),
          axios.get(`${API_URL}/inventory/products`),
          axios.get(`${API_URL}/sales/quotations/`),
          axios.get(`${API_URL}/inventory/service/`),
        ]);
        setCustomers(customerResponse.data);
        setProducts(productResponse.data);
        setQuotation(quotationRes.data);
        setServices(serviceResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load customers, products, or services. Please try again.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (quotation) {
      setQuotationData((prev) => ({
        ...prev,
        quotationNumber: `QUT/Mile/E${quotation.length + 1}` || `QUT/Mile/E`,
      }));
    }
  }, [quotation]);

  useEffect(() => {
    if (isCustomerAccordionOpen && customerAccordionRef.current) {
      customerAccordionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (isServiceAccordionOpen && serviceAccordionRef.current) {
      serviceAccordionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (isProductAccordionOpen && productAccordionRef.current) {
      productAccordionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCustomerAccordionOpen, isServiceAccordionOpen, isProductAccordionOpen]);

  const calculateTotalAmount = () => {
    const itemSubtotal = quotationData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return total + quantity * unitPrice;
    }, 0);

    const serviceSubtotal = quotationData.services.reduce((total, service) => {
      const rate = parseFloat(service.rate) || 0;
      return total + rate;
    }, 0);

    const subtotal = itemSubtotal + serviceSubtotal;
    const discount = parseFloat(quotationData.discount) || 0;
    const taxRate = parseFloat(quotationData.tax) || 0;
    const discountedAmount = subtotal - (discount / 100) * subtotal;
    const taxAmount = discountedAmount * (taxRate / 100);

    return discountedAmount + taxAmount;
  };

  const handleCustomerChange = (e) => {
    setQuotationData((prev) => ({ ...prev, customer_id: e.target.value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...quotationData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    console.log("Updated Services:", updatedServices);
    setQuotationData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotationData.items];

    if (field === "product_id") {
      const selectedProduct = products.find((p) => p.id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        product_id: value,
        product_name: selectedProduct ? selectedProduct.name : "",
        unit_price: selectedProduct ? selectedProduct.unit_price : "",
      };
    } else if (field === "quantity" || field === "unit_price") {
      updatedItems[index] = { ...updatedItems[index], [field]: parseFloat(value) || "" };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }

    setQuotationData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleDiscountTaxChange = (field, value) => {
    setQuotationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewCustomerChange = (field, value) => {
    setNewCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewServiceChange = (field, value) => {
    setNewServiceData((prev) => ({ ...prev, [field]: value }));
    console.log("New Service Data:", newServiceData);  
  };

  const handleNewProductChange = (field, value) => {
    setNewProductData((prev) => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    setQuotationData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "",  description: "", rate: "" }],
    }));
  };

  const addItem = () => {
    setQuotationData((prev) => ({
      ...prev,
      items: [{ product_id: "", quantity: "", unit_price: "", product_name: "", amount: "" }, ...prev.items],
    }));
  };

  const removeService = (index) => {
    setQuotationData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const removeItem = (index) => {
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleNewCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/sales/customers/`, newCustomerData);
      const newCustomer = response.data;
      setCustomers((prev) => [...prev, newCustomer]);
      setQuotationData((prev) => ({ ...prev, customer_id: newCustomer.id }));
      setNewCustomerData({ companyName: "", ownerName: "", contact: "", email: "", address: "" });
      setIsCustomerAccordionOpen(false);
      alert("Customer created successfully!");
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Error creating customer. Please try again.");
    }
  };

  const handleNewServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/inventory/service/`, newServiceData);
      const newService = response.data;
      setServices((prev) => [...prev, newService]);
      setNewServiceData({name:"", description: "", rate: "" });
      setIsServiceAccordionOpen(false);
      alert("Service created successfully!");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Error creating service. Please try again.");
    }
  };

  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/inventory/products/`, newProductData);
      const newProduct = response.data;
      setProducts((prev) => [...prev, newProduct]);
      setNewProductData({ name: "", unit_price: "" });
      setIsProductAccordionOpen(false);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      quotationNumber: `QUT/Mile/E${quotation.length + 1}` || `QUT/Mile/E`,
      customerName: customers.find((c) => c.id === quotationData.customer_id)?.companyName || "",
      customer: quotationData.customer_id,
      items: quotationData.items,
      services: quotationData.services,
      discount: parseFloat(quotationData.discount) || 0,
      tax: parseFloat(quotationData.tax) || 0,
      totalAmount: calculateTotalAmount(),
    };

    try {
      await axios.post(`${API_URL}/sales/quotations/`, submissionData);
      alert("Quotation created successfully!");
      setQuotationData({
        quotationNumber: `QUT/Mile/E${quotation.length + 1}` || `QUT/Mile/E`,
        customer_id: "",
        items: [{ product_id: "", quantity: "", unit_price: "", product_name: "", amount: "" }],
        services: [{name:"", description: "", rate: "" }],
        discount: 0,
        tax: 0,
      });
      navigate("/quotations", { replace: true });
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Error creating quotation. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Quotation</h1>

      {/* New Customer Form */}
      {isCustomerAccordionOpen && (
        <div className="flex justify-center mb-6">
          <div
            ref={customerAccordionRef}
            className="bg-white p-6 rounded-lg shadow-md max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Customer</h3>
            <form onSubmit={handleNewCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name *</label>
                <input
                  type="text"
                  value={newCustomerData.companyName}
                  onChange={(e) => handleNewCustomerChange("companyName", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Name *</label>
                <input
                  type="text"
                  value={newCustomerData.ownerName}
                  onChange={(e) => handleNewCustomerChange("ownerName", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  value={newCustomerData.contact}
                  onChange={(e) => handleNewCustomerChange("contact", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newCustomerData.email}
                  onChange={(e) => handleNewCustomerChange("email", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={newCustomerData.address}
                  onChange={(e) => handleNewCustomerChange("address", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomerAccordionOpen(false)}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Service Form */}
      {isServiceAccordionOpen && (
        <div className="flex justify-center mb-6">
          <div
            ref={serviceAccordionRef}
            className="bg-white p-6 rounded-lg shadow-md max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Service</h3>
            <form onSubmit={handleNewServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Description *</label>
                <input
                  type="text"
                  value={newServiceData.name||""}
                  onChange={(e) => handleNewServiceChange("name", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rate *</label>
                <input
                  type="number"
                  value={newServiceData.rate||""}
                  onChange={(e) => handleNewServiceChange("rate", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                  
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setIsServiceAccordionOpen(false)}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Product Form */}
      {isProductAccordionOpen && (
        <div className="flex justify-center mb-6">
          <div
            ref={productAccordionRef}
            className="bg-white p-6 rounded-lg shadow-md max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Product</h3>
            <form onSubmit={handleNewProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                <input
                  type="text"
                  value={newProductData.name||""}
                  onChange={(e) => handleNewProductChange("name", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price *</label>
                <input
                  type="number"
                  value={newProductData.unit_price}
                  onChange={(e) => handleNewProductChange("unit_price", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  
                  min="0"
                  
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductAccordionOpen(false)}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Quotation Form */}
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
              <div className="flex items-center space-x-2">
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
                <button
                  type="button"
                  onClick={() => setIsCustomerAccordionOpen(!isCustomerAccordionOpen)}
                  className="mt-1 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
                >
                  {isCustomerAccordionOpen ? "Close" : "New Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Services</h2>
            <button
              type="button"
              onClick={() => setIsServiceAccordionOpen(!isServiceAccordionOpen)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
            >
              {isServiceAccordionOpen ? "Close" : "New Service"}
            </button>
          </div>
          {quotationData.services.map((service, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service *</label>
                <select
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 
                />
                  
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rate</label>
                <input
                  type="number"
                  value={service.rate}
                  onChange={(e) => handleServiceChange(index, "rate", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                  
                />
              </div>
              <div className="flex items-end">
                {quotationData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
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
            onClick={addService}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
          >
            Add Service
          </button>
        </div>

        {/* Items Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Items</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsProductAccordionOpen(!isProductAccordionOpen)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
              >
                {isProductAccordionOpen ? "Close" : "New Product"}
              </button>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
              >
                Add Item
              </button>
            </div>
          </div>
          {quotationData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product *</label>
                <select
                  value={item.product_id||""}
                  onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  
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
                  value={item.quantity||""}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="number"
                  value={item.unit_price||""}
                  onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                 
                  min="0"
                  
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                value={quotationData.discount}
                onChange={(e) => handleDiscountTaxChange("discount", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax (%)</label>
              <input
                type="number"
                value={quotationData.tax}
                onChange={(e) => handleDiscountTaxChange("tax", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                
              />
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
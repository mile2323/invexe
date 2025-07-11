import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const BillForm = ({ objId }) => {
  const navigate = useNavigate();

  const [billData, setBillData] = useState({
    invoiceNo:'',
    quotation:'',
    workOrderNo: '',
    otherTax: [{ tax_NameOrType: '', value: '' }],
    otherCharges: [{ Description: '', rate: '' }],
    comments: '',
    discount: 0,
    totalAmount: 0,
  });

  const [quotationData, setQuotationData] = useState(null);
  const [prevTotal, setPrevTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotationRes = await axios.get(`${API_URL}/sales/quotations/${objId}/`);
        setQuotationData(quotationRes.data);
        console.log('response', quotationRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load quotation data. Please try again.');
      }
    };

    if (objId) {
      fetchData();
    }
  }, [objId]);

  // Update prevTotal by removing tax and discount from quotationData.totalAmount
  useEffect(() => {
    if (quotationData?.totalAmount != null) {
      const totalAmount = parseFloat(quotationData.totalAmount) || 0;
      const taxRate = parseFloat(quotationData.tax) || 0; // e.g., 18 for 18% GST
      const discountRate = parseFloat(quotationData.discount) || 0; // e.g., 10 for 10% discount
      const taxMultiplier = 1 + taxRate / 100;
      const discountMultiplier = 1 - discountRate / 100;
      // Avoid division by zero
      const baseAmount = taxMultiplier === 0 || discountMultiplier === 0 ? 0 : totalAmount / (taxMultiplier * discountMultiplier);
      setPrevTotal(baseAmount > 0 ? baseAmount.toFixed(2) : '0.00');
    } else {
      setPrevTotal('0.00');
    }
  }, [quotationData]);

  // Calculate total amount based on prevTotal, otherCharges, otherTax, and discount
  const calculateTotalAmount = () => {
    const chargesSubtotal = billData.otherCharges.reduce((total, charge) => {
      const rate = parseFloat(charge.rate) || 0;
      return total + rate;
    }, parseFloat(prevTotal) || 0);

    const taxSubtotal = billData.otherTax.reduce((total, tax) => {
      const value = parseFloat(tax.value) || 0;
      return total + value;
    }, 0);

    const subtotal = chargesSubtotal + (prevTotal*taxSubtotal/100);
    const discount = parseFloat(billData.discount) || 0;
    const discountedAmount = subtotal - (discount / 100) * subtotal;

    return discountedAmount > 0 ? discountedAmount.toFixed(2) : '0.00';
  };

  // Update totalAmount whenever otherTax, otherCharges, discount, or prevTotal changes
  useEffect(() => {
    setBillData((prev) => ({
      ...prev,
      invoiceNo:quotationData ? quotationData.quotationNumber : '',
      quotation:quotationData ? quotationData.id :'',
      totalAmount: calculateTotalAmount(),
    }));
  }, [billData.otherTax, billData.otherCharges, billData.discount, prevTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes for otherTax array
  const handleTaxChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTaxes = [...billData.otherTax];
    updatedTaxes[index] = { ...updatedTaxes[index], [name]: value };
    setBillData((prev) => ({
      ...prev,
      otherTax: updatedTaxes,
    }));
  };

  // Add new tax entry
  const addTax = () => {
    setBillData((prev) => ({
      ...prev,
      otherTax: [...prev.otherTax, { tax_NameOrType: '', value: '' }],
    }));
  };

  // Remove tax entry
  const removeTax = (index) => {
    setBillData((prev) => ({
      ...prev,
      otherTax: prev.otherTax.filter((_, i) => i !== index),
    }));
  };

  // Handle changes for otherCharges array
  const handleChargeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCharges = [...billData.otherCharges];
    updatedCharges[index] = { ...updatedCharges[index], [name]: value };
    setBillData((prev) => ({
      ...prev,
      otherCharges: updatedCharges,
    }));
  };

  // Add new charge entry
  const addCharge = () => {
    setBillData((prev) => ({
      ...prev,
      otherCharges: [...prev.otherCharges, { Description: '', rate: '' }],
    }));
  };

  // Remove charge entry
  const removeCharge = (index) => {
    setBillData((prev) => ({
      ...prev,
      otherCharges: prev.otherCharges.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/sales/genrate-bill/${objId}/`, billData);
      alert('Bill created successfully!');
      setBillData({
        workOrderNo: '',
        otherTax: [{ tax_NameOrType: '', value: '' }],
        otherCharges: [{ Description: '', rate: '' }],
        comments: '',
        discount: 0,
        totalAmount: 0,
      });
      navigate('/quotations', { replace: true });
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Error creating bill. Please try again.');
    }
  };

  return (
    <>
      <style>
        {`
          input[type="number"] {
            -webkit-appearance: textfield;
            -moz-appearance: textfield;
            appearance: textfield;
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
      </style>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quotation Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
            <input
              type="text"
              value={quotationData?.quotationNumber || ''}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer *</label>
            <input
              type="text"
              value={quotationData?.customerName || ''}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="text"
              value={quotationData?.totalAmount || ''}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">With *</label>
            <input
              type="text"
              value={'GST@' + (quotationData?.tax || '') + '%'}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Bill</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bill Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Bill Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Order No *</label>
                <input
                  type="text"
                  name="workOrderNo"
                  value={billData.workOrderNo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter work order number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Other Taxes Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Other Taxes</h2>
              <button
                type="button"
                onClick={addTax}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
              >
                Add Tax
              </button>
            </div>
            {billData.otherTax.map((tax, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Name/Type *</label>
                  <input
                    type="text"
                    name="tax_NameOrType"
                    value={tax.tax_NameOrType}
                    onChange={(e) => handleTaxChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tax Name/Type"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Value *</label>
                  <input
                    type="number"
                    name="value"
                    value={tax.value}
                    onChange={(e) => handleTaxChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tax Value"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end">
                  {billData.otherTax.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTax(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Other Charges Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Other Charges</h2>
              <button
                type="button"
                onClick={addCharge}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-800"
              >
                Add Charge
              </button>
            </div>
            {billData.otherCharges.map((charge, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Charge Description *</label>
                  <textarea
                    name="Description"
                    value={charge.Description}
                    onChange={(e) => handleChargeChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Charge Description"
                    required
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Charge Rate *</label>
                  <input
                    type="number"
                    name="rate"
                    value={charge.rate}
                    onChange={(e) => handleChargeChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Charge Rate"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end">
                  {billData.otherCharges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCharge(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comments, Discount, and Total Amount Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea
                  name="comments"
                  value={billData.comments}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter any additional comments"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={billData.discount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter discount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={billData.totalAmount}
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
              Submit Bill
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BillForm;
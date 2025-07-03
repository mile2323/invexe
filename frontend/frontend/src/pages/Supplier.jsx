import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const APIURL = import.meta.env.VITE_API_URL;

  // Fetch supplier data from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APIURL}/purchases/suppliers/`);
        setSuppliers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []); // Empty dependency array to run once on mount

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Supplier List</h1>
        <p>Loading suppliers...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Supplier List</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Company Name</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">City</th>
              <th className="py-2 px-4 border-b text-left">Pin Code</th>
              <th className="py-2 px-4 border-b text-left">State</th>
              <th className="py-2 px-4 border-b text-left">Country</th>
              <th className="py-2 px-4 border-b text-left">Owner Name</th>
              <th className="py-2 px-4 border-b text-left">Contact Person</th>
              <th className="py-2 px-4 border-b text-left">Office Contact</th>
              <th className="py-2 px-4 border-b text-left">Plant Contact</th>
              <th className="py-2 px-4 border-b text-left">Residence Contact</th>
              <th className="py-2 px-4 border-b text-left">Mobile</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Organization Type</th>
              <th className="py-2 px-4 border-b text-left">Business Nature</th>
              <th className="py-2 px-4 border-b text-left">GST No</th>
              <th className="py-2 px-4 border-b text-left">PAN No</th>
              <th className="py-2 px-4 border-b text-left">MSME</th>
              <th className="py-2 px-4 border-b text-left">Enterprise Type</th>
              <th className="py-2 px-4 border-b text-left">Bank Name</th>
              <th className="py-2 px-4 border-b text-left">Account No</th>
              <th className="py-2 px-4 border-b text-left">IFSC Code</th>
              <th className="py-2 px-4 border-b text-left">Branch Code</th>
              <th className="py-2 px-4 border-b text-left">Branch Address</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="24" className="py-4 px-4 text-center text-gray-500">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, index) => (
                <tr key={supplier.id || index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{supplier.companyName || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    {supplier.addressLine1 || ''} {supplier.addressLine2 || ''}
                  </td>
                  <td className="py-2 px-4 border-b">{supplier.city || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.pinCode || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.state || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.country || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.ownerName || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.contactPerson || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.officeContact || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.plantContact || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.residenceContact || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.mobile || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.email || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.organizationType || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    {Array.isArray(supplier.businessNature)
                      ? supplier.businessNature.join(', ')
                      : '-'}
                  </td>
                  <td className="py-2 px-4 border-b">{supplier.gstNo || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.panNo || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.msme || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.enterpriseType || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.bankName || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.accountNo || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.ifscCode || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.branchCode || '-'}</td>
                  <td className="py-2 px-4 border-b">{supplier.branchAddress || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Supplier;
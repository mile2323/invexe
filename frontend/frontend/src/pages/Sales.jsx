import { useNavigate,Link } from 'react-router-dom';
import {  useEffect,useState } from 'react';
import axios from 'axios';  


function Sales() {
  const navigate = useNavigate();

    useEffect(() => {fetchVendorData();}, []);
    const [CustomerCount, setCustomerCount] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;

      const fetchVendorData = async () => {
        try {
          const res = await axios.get(`${API_URL}/sales/customers/`);
          const count = Object.keys(res.data).length;
          setCustomerCount(count);
          console.log('Vendor data fetched successfully:', res.data);
        } catch (error) {
          console.error('Error fetching vendor data:', error);
        }
      };

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">Sales Management</h1>
      <p className="text-gray-600">Manage Customers, quotations, and Sales orders</p>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Master */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Customer Master</h2>
          <p className="text-sm text-gray-600 mb-2">Add and manage your Customers</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            
            
          </ul>
          <button onClick={() => navigate('/Customer')} className="mt-4 bg-gray-200 px-4 py-2 rounded">Manage Customers</button>
        </div>

        {/* Quotation Management */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Quotation Management</h2>
          <p className="text-sm text-gray-600 mb-2">Create and manage quotations</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
          
          </ul>
          <button onClick={() => navigate('/quotations')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Create Quotation</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Total Customers</h4>
          <p className="text-2xl font-bold">{CustomerCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Quotations</h4>

          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Pending Approvals</h4>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">This Month</h4>
          <p className="text-2xl font-bold">₹0</p>
        </div>
      </div>
    </div>
  );
}

export default Sales;

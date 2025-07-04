import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-10 space-y-8">
      
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-gray-600">Choose a module to get started with managing your business</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Purchase Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Purchase</h2>
          <p className="text-sm text-gray-600">Manage suppliers, create purchase orders, and track quotations</p>
          <ul className="list-disc pl-5 my-4 text-sm text-gray-700">
            <li>Supplier Master</li>
            <li>Quotation Creation</li>
            <li>Purchase Orders</li>
            <li>Vendor Management</li>
          </ul>
          <button
            onClick={() => navigate('/purchase')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Access Purchase Module
          </button>
        </div>

        {/* Sales Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Sales</h2>
          <p className="text-sm text-gray-600">Handle customer orders, invoicing, and sales analytics</p>
          <ul className="list-disc pl-5 my-4 text-sm text-gray-700">
            <li>Customer Management</li>
            <li>Sales Orders</li>
            <li>Invoicing</li>
            <li>Sales Reports</li>
          </ul>
          <button  onClick={() => navigate('/salespage')}
             className="bg-green-600 text-white px-4 py-2 rounded">
           
            Access Sales Module
          </button>
        </div>

        {/* Inventory Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Inventory</h2>
          <p className="text-sm text-gray-600">Track stock levels, manage warehouses, and monitor inventory</p>
          <ul className="list-disc pl-5 my-4 text-sm text-gray-700">
            <li>Stock Management</li>
            <li>Warehouse Tracking</li>
            <li>Inventory Reports</li>
            <li>Stock Alerts</li>
          </ul>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Access Inventory Module
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Total Suppliers</h4>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-400">Start by adding suppliers</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Active Quotations</h4>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-400">Create your first quotation</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Inventory Items</h4>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-400">Add products to inventory</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

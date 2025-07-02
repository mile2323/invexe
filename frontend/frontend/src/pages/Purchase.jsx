import { useNavigate } from 'react-router-dom';

function Purchase() {
  const navigate = useNavigate();

  return (
    <div className="p-10 space-y-8">
      <button onClick={() => navigate('/')} className="text-blue-600">&larr; Back</button>
      <h1 className="text-3xl font-bold">Purchase Management</h1>
      <p className="text-gray-600">Manage suppliers, quotations, and purchase orders</p>

      <div className="flex space-x-4 border-b pb-2">
        <button className="border-b-2 border-blue-600 font-medium pb-1">Overview</button>
        <button className="text-gray-500">Supplier Master</button>
        <button className="text-gray-500">Quotations</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Master */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Supplier Master</h2>
          <p className="text-sm text-gray-600 mb-2">Add and manage your suppliers</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Add new suppliers</li>
            <li>Edit supplier details</li>
            <li>View supplier list</li>
          </ul>
          <button className="mt-4 bg-gray-200 px-4 py-2 rounded">Manage Suppliers</button>
        </div>

        {/* Quotation Management */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">Quotation Management</h2>
          <p className="text-sm text-gray-600 mb-2">Create and manage quotations</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Create new quotations</li>
            <li>Track quotation status</li>
            <li>Compare quotes</li>
          </ul>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Create Quotation</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Total Suppliers</h4>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h4 className="text-sm text-gray-500">Active Quotations</h4>
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

export default Purchase;

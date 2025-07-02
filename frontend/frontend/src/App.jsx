import { Routes, Route, Link } from 'react-router-dom';
import ModuleCard from './components/ModuleCard';
import PurchasePage from './pages/PurchasePage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import VendorForm from './components/VendorForm';

function App() {
  return (
    <>
    <VendorForm/>
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="max-w-5xl w-full">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Business Management Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModuleCard
                  title="Purchase"
                  description="Manage your procurement process, track orders, and handle supplier relationships efficiently."
                  icon="📦"
                  link="/purchase"
                />
                <ModuleCard
                  title="Sales"
                  description="Monitor sales performance, manage customer orders, and analyze revenue trends."
                  icon="💰"
                  link="/sales"
                />
                <ModuleCard
                  title="Inventory"
                  description="Keep track of stock levels, manage warehouse operations, and optimize inventory flow."
                  icon="📋"
                  link="/inventory"
                />
              </div>
              <Link to="/" className="mt-8 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
          </div>
        }
      />
      <Route
        path="/purchase"
        element={
          <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="max-w-5xl w-full">
              <PurchasePage />
              <Link to="/" className="mt-8 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
          </div>
        }
      />
      
      <Route
        path="/sales"
        element={
          <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="max-w-5xl w-full">
              <SalesPage />
              <Link to="/" className="mt-8 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
          </div>
        }
      />
      <Route
        path="/inventory"
        element={
          <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="max-w-5xl w-full">
              <InventoryPage />
              <Link to="/" className="mt-8 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
          </div>
        }
      />
    </Routes>
    </>
  );
}

export default App;
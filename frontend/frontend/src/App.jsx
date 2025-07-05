import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModuleCard from './components/ModuleCard';
import Purchase from './pages/Purchase';
import SalesPage from './pages/SalesPage';
import Dashboard from './pages/Dashboard';
import VendorForm from './components/VendorForm';
import Supplier from './pages/Supplier';
import Inventory from './pages/Inventory';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <Routes>  
      <Route path="/" element={<Dashboard />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/salespage" element={<SalesPage />} />
      <Route path="/vendor" element={<VendorForm />} />
      <Route path="/vendor/edit/:objectId" element={<VendorForm />} />
      <Route path="/supplier" element={<Supplier />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:objectId" element={<AddProduct />} />
    </Routes>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModuleCard from './components/ModuleCard';
import Purchase from './pages/Purchase';
import SalesPage from './pages/SalesPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import VendorForm from './components/VendorForm';
import Supplier from './pages/Supplier';

function App() {
  return (
    <Routes>  
      <Route path="/" element={<Dashboard />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/salespage" element={<SalesPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/vendor" element={<VendorForm />} />
      <Route path="/supplier" element={<Supplier />} />
    </Routes>
  );
}

export default App;

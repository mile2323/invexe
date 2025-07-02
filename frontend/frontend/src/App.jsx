import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModuleCard from './components/ModuleCard';
import Purchase from './pages/Purchase';
import SalesPage from './pages/SalesPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import VendorForm from './components/VendorForm';

function App() {
  return (
    
    
   
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Dashboard />} />
    //     <Route path="/purchase" element={<PurchasePage />} />
    //   </Routes>
    // </Router>
    <>
    <Dashboard />
    {/* <Purchase /> */}
    </>

    
  );
}

export default App;
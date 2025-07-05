import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModuleCard from './components/ModuleCard';
import Purchase from './pages/Purchase';
import Dashboard from './pages/Dashboard';
import VendorForm from './components/VendorForm';
import Supplier from './pages/Supplier';
import Inventory from './pages/Inventory';
import AddProduct from './components/AddProduct';
import Sales from './pages/Sales';
import Customer from './pages/Customer';
import QuotationForm from './components/QuotationForm';

function App() {
  const APIURL = import.meta.env.VITE_API_URL;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/vendor/add-supplier" element={
        <VendorForm
          submitUrl={`${APIURL}/purchases/suppliers/`}
          redirectPath="/supplier"
          formTitle="Register New Supplier"
        />} />
      <Route path="/vendor/edit-supplier/:objectId" element={<VendorForm
        editUrl={`${APIURL}/purchases/suppliers/`}
        redirectPath="/supplier"
        formTitle="Edit Supplier"
      />} />

      <Route path="/vendor/add-customer" element={
        <VendorForm
          submitUrl={`${APIURL}/sales/customers/`}
          redirectPath="/customer"
          formTitle="Register New Customer"
        />} />
      <Route path="/vendor/edit-customer/:objectId" element={<VendorForm
        editUrl={`${APIURL}/sales/customers/`}
        redirectPath="/customer"
        formTitle="Edit Customer"
      />} />
      <Route path="/supplier" element={<Supplier />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:objectId" element={<AddProduct />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/quotation" element={<QuotationForm />} />
    </Routes>
  );
}

export default App;

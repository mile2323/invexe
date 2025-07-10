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
import QuotationContent from './components/QuotationContent';
import Quotation from './pages/Quotations';
import CustomerForm from './components/CustomerForm';
import AddService from './components/AddService';
import Bill from './components/Bill';


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
        <CustomerForm
          submitUrl={`${APIURL}/sales/customers/`}
          redirectPath="/customer"
          formTitle="Register New Customer"
        />} />
      <Route path="/vendor/edit-customer/:objectId" element={<CustomerForm
        editUrl={`${APIURL}/sales/customers/`}
        redirectPath="/customer"
        formTitle="Edit Customer"
      />} />
      <Route path="/supplier" element={<Supplier />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:objectId" element={<AddProduct />} />
      <Route path="/services/add" element={<AddService />} />
      <Route path="/services/edit/:objectId" element={<AddService />} />

      <Route path="/customer" element={<Customer />} />
      <Route path="/creat-quotation" element={<QuotationForm />} />
      <Route path="/quotation-content/:objectId" element={<QuotationContent />} />
      <Route path="/quotation-bill/:objectId" element={<Bill />} />
      <Route path="/quotations" element={<Quotation />} />
    </Routes>
  );
}

export default App;

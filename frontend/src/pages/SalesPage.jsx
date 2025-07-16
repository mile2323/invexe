
import { Container } from '@mui/material';
import QuotationForm from '../components/QuotationForm';
import ModuleCard from '../components/ModuleCard';
import { Routes, Route, Link } from 'react-router-dom';





function SalesPage() {
  return (
    <div className="max-w-5xl w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Module</h1>
     
      {/* Add more content or functionality as needed */}
        <Container>
            <QuotationForm/>
        </Container>

    </div>
  );
}

export default SalesPage;
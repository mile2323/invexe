import { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/sales';

const QuotationForm = () => {
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 0, unit_price: 0 }]);
  const [quotationNumber, setQuotationNumber] = useState(`QT-${Date.now()}`);

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 0, unit_price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const data = {
      quotation_number: quotationNumber,
      customer,
      items,
      status: 'Draft',
    };
    try {
      await axios.post(`${API_URL}/quotations/`, data);
      alert('Quotation created!');
      setCustomer('');
      setItems([{ product_id: '', quantity: 0, unit_price: 0 }]);
      setQuotationNumber(`QT-${Date.now()}`);
    } catch (error) {
      console.error('Failed to create quotation', error);
      alert('Error creating quotation');
    }
  };

  return (
    <div>
      <h2>Create Quotation</h2>
      <TextField
        label="Quotation Number"
        value={quotationNumber}
        onChange={(e) => setQuotationNumber(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Customer ID"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addItem} variant="outlined" style={{ marginTop: '10px' }}>
        Add Item
      </Button>
      <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px', marginLeft: '10px' }}>
        Create Quotation
      </Button>
    </div>
  );
};

export default QuotationForm;
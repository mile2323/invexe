import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');
  const APIURL = import.meta.env.VITE_API_URL;

  // Fetch product data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APIURL}/inventory/products`);
        setProducts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

     fetchProducts();
  }, []); // Empty dependency array to run once on mount

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 bg-white p-6 rounded-lg shadow-md">
       <div className="relative rounded-lg isolate flex items-center gap-x-6 overflow-hidden bg-blue-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
        
      </div>
     
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="text-sm/6 text-gray-900">
          <h1 className="text-2xl font-bold">Product List</h1>
          </div>
       
      </div>
      <div className="flex flex-1 justify-end">
        <button
         onClick={() => navigate('/products')}
      type="button"
      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Add New
    </button>
        
      </div>
    </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">

                <th className="py-2 px-4 border-b text-left">Action</th>
              <th className="py-2 px-4 border-b text-left">Product ID</th>
              <th className="py-2 px-4 border-b text-left">Product Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Unit price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
            </tr>
          </thead>
          </table>
          <p>loding</p>
          </div>
          </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4 bg-white p-6 rounded-lg shadow-md">
       <div className="relative rounded-lg isolate flex items-center gap-x-6 overflow-hidden bg-blue-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
        
      </div>
     
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="text-sm/6 text-gray-900">
          <h1 className="text-2xl font-bold">Product List</h1>
          </div>
       
      </div>
      <div className="flex flex-1 justify-end">
        <button
         onClick={() => navigate('/products/add')}
      type="button"
      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Add New
    </button>
        
      </div>
    </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Action</th>
              <th className="py-2 px-4 border-b text-left">Product ID</th>
              <th className="py-2 px-4 border-b text-left">Product Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Unit price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
            </tr>
          </thead>
          </table>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>

    );
  }

  return (
    <div className="container mx-auto p-4 bg-white p-6 rounded-lg shadow-md">
     <div className="relative rounded-lg isolate flex items-center overflow-hidden bg-blue-50 px-6 py-2.5 sm:px-3.5">
  {/* Background Decorations */}
  <div
    aria-hidden="true"
    className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
  >
    <div
      style={{
        clipPath:
          'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
      }}
      className="aspect-577/310 w-144.25 bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
    />
  </div>

  {/* Left: Input */}
  <div className="flex items-center gap-x-4">
    <input
      type="text"
      placeholder="Search supplier..."
      value={filterTerm}
      onChange={(e) => setFilterTerm(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Center: Product List Title */}
  <div className="absolute left-1/2 transform -translate-x-1/2">
    <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
  </div>

  {/* Right: Add New Button */}
  <div className="ml-auto">
    <button
      onClick={() => navigate('/products/add')}
      type="button"
      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Add New
    </button>
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Action</th>
              <th className="py-2 px-4 border-b text-left">Product ID</th>
              <th className="py-2 px-4 border-b text-left">Product Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Unit price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="24" className="py-4 px-4 text-center text-gray-500">
                  No Product found
                </td>
              </tr>
            ) : (
              products.filter(
                (product) =>
                  product.name &&
                  product.name.toLowerCase().includes(filterTerm.toLowerCase())
              ).map((product, index) => (
                <tr key={product.product_id || index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b"><nav className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"><Link to={`/products/edit/${product.id}`} >Edit</Link></nav></td>

                  <td className="py-2 px-4 border-b">{product.name || '-'}</td>
                  <td className="py-2 px-4 border-b">{product.description || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    {product.description || ''} 
                  </td>
                  <td className="py-2 px-4 border-b">{product.unit_price || '-'}</td>
                  <td className="py-2 px-4 border-b">{product.quantity_in_stock || '-'}</td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AddProduct = () => {
  const { objectId } = useParams(); // Get objectId from URL
  const navigate = useNavigate(); // For navigation after submission
  const isEditMode = !!objectId; // Check if in edit mode

  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    description: "",
    unit_price: "",
    quantity_in_stock: "",
  });

  // Fetch product data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(`${API_URL}/inventory/products/${objectId}`);
          setFormData(response.data); // Populate form with fetched data
        } catch (error) {
          console.error("Error fetching product data:", error);
          alert("Failed to load product data. Please try again.");
        }
      };
      fetchProductData();
    }
  }, [objectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing product
        await axios.put(`${API_URL}/inventory/products/${objectId}/`, formData);
        alert("Product updated successfully!");
      } else {
        console.log("Product created successfully:", formData);

        // Create new product
        await axios.post(`${API_URL}/inventory/products/`, formData);
        setFormData({
          product_id: "",
          name: "",
          description: "",
          unit_price: "",
          quantity_in_stock: "",
        });
        alert("Product created successfully!");
      }
      navigate("/Inventory"); // Redirect to product list page
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error ${isEditMode ? "updating" : "creating"} product. Please try again.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product ID *</label>
              <input
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                maxLength={100}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity in Stock</label>
              <input
                type="number"
                name="quantity_in_stock"
                value={formData.quantity_in_stock}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditMode ? "Update Product" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
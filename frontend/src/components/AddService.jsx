import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AddService = () => {
  const { objectId } = useParams(); // Get objectId from URL
  const navigate = useNavigate(); // For navigation after submission
  const isEditMode = !!objectId; // Check if in edit mode

  const [formData, setFormData] = useState({
    name:"",
    description: "",
    rate: "",
  });

  // Fetch service data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchServiceData = async () => {
        try {
          const response = await axios.get(`${API_URL}/inventory/services/${objectId}`);
          setFormData(response.data); // Populate form with fetched data
        } catch (error) {
          console.error("Error fetching service data:", error);
          alert("Failed to load service data. Please try again.");
        }
      };
      fetchServiceData();
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
        // Update existing service
        await axios.put(`${API_URL}/inventory/service/${objectId}/`, formData);
        alert("Service updated successfully!");
      } else {
        console.log("Service created successfully:", formData);
        // Create new service
        await axios.post(`${API_URL}/inventory/service/`, formData);
        setFormData({
          description: "",
          rate: "",
        });
        alert("Service created successfully!");
      }
     navigate("/Inventory", { replace: true });  // Redirect to service list page
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error ${isEditMode ? "updating" : "creating"} service. Please try again.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isEditMode ? "Edit Service" : "Add Service"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Service Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <textarea
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Rate</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
                min="0"
              />
            </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditMode ? "Update Service" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
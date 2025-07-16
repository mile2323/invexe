import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const initialFormData = {
  companyName: "",
  ownerName: "",
  contact: "",
  email: "",
  address: "",
};

const CustomerForm = ({ submitUrl, editUrl, redirectPath, formTitle }) => {
  const { objectId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!objectId;
  const fullEditUrl = isEditMode ? `${editUrl}${objectId}/` : editUrl;

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isEditMode && editUrl) {
      const fetchCustomerData = async () => {
        try {
          const response = await axios.get(fullEditUrl);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching customer data:", error);
          alert("Failed to load customer data.");
        }
      };
      fetchCustomerData();
    }
  }, [editUrl, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(fullEditUrl, formData);
        alert("Customer updated successfully!");
      } else {
        await axios.post(submitUrl, formData);
        setFormData(initialFormData);
        alert("Customer created successfully!");
      }
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error ${isEditMode ? "updating" : "creating"} customer.`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {formTitle || (isEditMode ? "Edit Customer" : "Customer Registration Form")}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            rows={3}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditMode ? "Update Customer" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;

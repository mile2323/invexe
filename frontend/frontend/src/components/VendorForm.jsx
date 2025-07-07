import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Initial form structure
const initialFormData = {
  companyName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pinCode: "",
  state: "",
  country: "",
  ownerName: "",
  contactPerson: "",
  officeContact: "",
  plantContact: "",
  residenceContact: "",
  mobile: "",
  email: "",
  organizationType: "",
  businessNature: [],
  gstNo: "",
  panNo: "",
  msme: "No",
  enterpriseType: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
  branchCode: "",
  branchAddress: "",
};

const VendorForm = ({ submitUrl, editUrl, redirectPath , formTitle }) => {
  const { objectId } = useParams(); // Optional usage
  const navigate = useNavigate();
  const isEditMode = !!objectId;
  const fullEditUrl = isEditMode ? `${editUrl}${objectId}/` : editUrl;

  const [formData, setFormData] = useState(initialFormData);

  // Fetch vendor data for editing
  useEffect(() => {
    if (isEditMode && editUrl) {
      const fetchVendorData = async () => {
        try {
          const response = await axios.get(fullEditUrl);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          alert("Failed to load vendor data. Please try again.");
        }
      };
      fetchVendorData();
    }
  }, [editUrl, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        businessNature: checked
          ? [...prev.businessNature, value]
          : prev.businessNature.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  console.log("Form Data:", submitUrl, editUrl); // Debugging line to check form data

    e.preventDefault();
    try {
      if (isEditMode && editUrl) {
        await axios.put(fullEditUrl, formData);
        alert("Vendor updated successfully!");
      } else {
        await axios.post(submitUrl, formData);
        setFormData(initialFormData);
        alert("Vendor created successfully!");
      }
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error ${isEditMode ? "updating" : "creating"} vendor. Please try again.`);
    }
  };

  return (
    
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {formTitle || (isEditMode ? "Edit Vendor" : "Supplier/Customer/Transporter Registration Form")}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* General Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company/Firm Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Address Info */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Billing Address *</label>
            <input
              type="text"
              name="addressLine1"
              placeholder="Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Line 2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="block w-full border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                value={formData.pinCode}
                onChange={handleChange}
                required
                className="block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="block w-full border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              ["ownerName", "Owner/Partner Name *"],
              ["contactPerson", "Contact Person Name *"],
              ["officeContact", "Office Contact"],
              ["plantContact", "Plant/Works Contact"],
              ["residenceContact", "Residence Contact"],
              ["mobile", "Mobile Number *"],
              ["email", "Email ID *"],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={field.includes("email") ? "email" : "tel"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={label.includes("*")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Type of Organization */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Type of Organization</h2>
          <div className="flex flex-wrap gap-4">
            {["Sole Proprietorship", "Partnership", "Private Limited", "Public Limited"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="organizationType"
                  value={type}
                  checked={formData.organizationType === type}
                  onChange={handleChange}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Nature of Business */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Nature of Business</h2>
          <div className="flex flex-wrap gap-4">
            {[
              "Manufacturer",
              "Dealer",
              "Stockiest",
              "General Order Supplier",
              "Contractor",
              "Transporter",
              "Courier",
            ].map((nature) => (
              <label key={nature} className="flex items-center">
                <input
                  type="checkbox"
                  name="businessNature"
                  value={nature}
                  checked={formData.businessNature.includes(nature)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {nature}
              </label>
            ))}
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tax Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["gstNo", "GST No *"],
              ["panNo", "PAN No *"],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700">MSME</label>
              <select
                name="msme"
                value={formData.msme}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {formData.msme === "Yes" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Enterprise Type</label>
                <select
                  name="enterpriseType"
                  value={formData.enterpriseType}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Type</option>
                  <option value="Micro">Micro</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Note: Please provide copies of GST, PAN & MSME registration certificate if applicable.
          </p>
        </div>

        {/* Bank Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["bankName", "Bank Name *"],
              ["accountNo", "Account Number *"],
              ["ifscCode", "IFSC Code *"],
              ["branchCode", "Branch Code *"],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Branch Address *</label>
              <textarea
                name="branchAddress"
                value={formData.branchAddress}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditMode ? "Update Vendor" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorForm;

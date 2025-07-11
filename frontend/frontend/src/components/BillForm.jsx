import { useState, useEffect, useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";



const API_URL = import.meta.env.VITE_API_URL;

const BillForm = ({objId}) => {
  const navigate = useNavigate();

  const [billData, setData] = useState({
    workOrderNo: "",
    otherTax: [{ tax_NameOrType: "", value: "" }],
    otherCharges: [{Description:"", rate: "" }],
    discount: 0,
    tax: 0,
    totalAmount: 0,
  });

  const [quotationData,setQuotationData] =useState()
  

  useEffect(() => {
      const fetchData = async () => {
        try {
          const  quotationRes = await Promise.all([
            axios.get(`${API_URL}/sales/quotations/${objId}/`),
          ]);
          setQuotationData(quotationRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          alert("Failed to load customers, products, or services. Please try again.");
        }
      };
      fetchData();
    }, []);

  



  return(<>
  <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Quotation Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
              <input
                type="text"
                value={quotationData.quotationNumber}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer *</label>
              <div className="flex items-center space-x-2">
                <text
                  value={quotationData.customer_id}
                  onChange={handleCustomerChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                 
                 
                </text>
                
              </div>
            </div>
          </div>
        </div>
  
  
  </>);}


export default BillForm;
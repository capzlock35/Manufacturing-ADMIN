import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://backend-admin.jjm-manufacturing.com/api/requestresources'
  : 'http://localhost:7690/api/requestresources';

  const baseURLTable= process.env.NODE_ENV === 'production'
  ? 'https://backend-admin.jjm-manufacturing.com/api/resources'
  : 'http://localhost:7690/api/resources';

const RequestResources = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newResourceRequest, setNewResourceRequest] = useState({
    name: '', // Staff enters their name
    resourceName: '',  // Staff enters the resource name
    type: '',
    description: '',
    quantity: 1,
    unit: '',
    allocatedTo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestFormCollapsed, setIsRequestFormCollapsed] = useState(false); // State for collapse/uncollapse

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(baseURLTable);
      setResources(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError(err.message || "Failed to fetch resources");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    setNewResourceRequest({ ...newResourceRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsSubmitting(true);
    try {
      await axios.post(baseURL, {
        ...newResourceRequest,
        requestDate: new Date(),
        status: 'pending',
      });
  
      alert('Request submitted successfully!');
      setNewResourceRequest({
        name: '',
        resourceName: '',
        type: '',
        description: '',
        quantity: 1,
        unit: '',
        allocatedTo: '',
      });
    } catch (err) {
      console.error("Error submitting request:", err);
      setError(err.message || "Failed to submit request");
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRequestForm = () => {
    setIsRequestFormCollapsed(!isRequestFormCollapsed);
  };
  

  return (
    <div className="px-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Request Resources</h1>

        {/* Request New Resource Form */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Request New Resource</h2>
            <button onClick={toggleRequestForm} className="cursor-pointer">
              {isRequestFormCollapsed ? <FaCaretDown /> : <FaCaretUp />}
            </button>
          </div>

          {!isRequestFormCollapsed && (
            <form onSubmit={handleSubmit}>

              {/* Display User Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  name="name"
                  value={newResourceRequest.name}
                  onChange={handleInputChange}
                  placeholder="Enter Your Name"
                  required  // Make it required
                />
              </div>

              {/* Resource Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceName">
                  Resource Name:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="resourceName"
                  type="text"
                  name="resourceName"
                  value={newResourceRequest.resourceName}
                  onChange={handleInputChange}
                  placeholder="Enter Resource Name"
                  required
                />
              </div>

              {/* Type */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Type:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="type"
                  name="type"
                  value={newResourceRequest.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Tool">Tool</option>
                  <option value="Material">Material</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description:
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  value={newResourceRequest.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  Quantity:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={newResourceRequest.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              {/* Unit */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
                  Unit:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="unit"
                  type="text"
                  name="unit"
                  value={newResourceRequest.unit}
                  onChange={handleInputChange}
                  placeholder="Unit (e.g., kg, liters, pieces)"
                  required
                />
              </div>

              {/* Allocated To */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allocatedTo">
                  Allocated To:
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="allocatedTo"
                  name="allocatedTo"
                  value={newResourceRequest.allocatedTo}
                  onChange={handleInputChange}
                  placeholder="Enter the location or department where this resource will be allocated"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Resource List - Display Only */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-black">Available Resources</h2>
          {isLoading ? (
            <p>Loading resources...</p>
          ) : resources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Resource Name</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">Unit</th>
                    <th className="py-2 px-4 border-b">Allocated To</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource._id}>
                      <td className="py-2 px-4 border-b">{resource.name}</td>
                      <td className="py-2 px-4 border-b">{resource.resourceName}</td>
                      <td className="py-2 px-4 border-b">{resource.type}</td>
                      <td className="py-2 px-4 border-b">{resource.description}</td>
                      <td className="py-2 px-4 border-b">{resource.quantity}</td>
                      <td className="py-2 px-4 border-b">{resource.unit}</td>
                      <td className="py-2 px-4 border-b">{resource.allocatedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No resources found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestResources;
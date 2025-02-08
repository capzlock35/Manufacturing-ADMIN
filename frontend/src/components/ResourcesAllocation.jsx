import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/resources'
    : 'http://localhost:7690/api/resources';

const requestBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/requestresources'
    : 'http://localhost:7690/api/requestresources';

const ResourcesAllocation = () => {
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({
        resourceName: '', // Added resourceName field
        name: '',  //Re-added name field
        type: '',
        description: '',
        quantity: 1,
        unit: '',
        allocatedTo: '',
    });
    const [editingResourceId, setEditingResourceId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [resourceRequests, setResourceRequests] = useState([]);  // NEW: State for resource requests
    const [isRequestLoading, setIsRequestLoading] = useState(false); // NEW: Loading state for requests

    useEffect(() => {
        fetchResources();
        fetchResourceRequests(); // Load resource requests on component mount
    }, []);

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(baseURL);
            setResources(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching resources:", err);
            setError(err.message || "Failed to fetch resources");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchResourceRequests = async () => {
        setIsRequestLoading(true);
        try {
            const response = await axios.get(requestBaseURL);
            setResourceRequests(response.data); // Get the list of resource requests
            setError(null);
        } catch (err) {
            console.error("Error fetching resource requests:", err);
            setError(err.message || "Failed to fetch resource requests");
        } finally {
            setIsRequestLoading(false);
        }
    };


    const handleInputChange = (e) => {
        setNewResource({ ...newResource, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(baseURL, newResource);
            fetchResources();
            setNewResource({ resourceName: '', name: '', type: '', description: '', quantity: 1, unit: '', allocatedTo: '' }); // Clear the form
            setIsFormOpen(false);
        } catch (err) {
            console.error("Error creating resource:", err);
            setError(err.message || "Failed to create resource");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${baseURL}/${editingResourceId}`, newResource);
            fetchResources();
            setEditingResourceId(null);
            setNewResource({ resourceName: '', name: '', type: '', description: '', quantity: 1, unit: '', allocatedTo: '' }); // Clear the form
            setIsFormOpen(false);
        } catch (err) {
            console.error("Error creating resource:", err);
            setError(err.message || "Failed to create resource");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/${id}`);
            fetchResources();
        } catch (err) {
            console.error("Error deleting resource:", err);
            setError(err.message || "Failed to delete resource");
        }
    };

    const handleEdit = (resource) => {
        setEditingResourceId(resource._id);
        setNewResource({ ...resource });
        setIsFormOpen(true);
    };

    const handleCancelEdit = () => {
        setEditingResourceId(null);
        setNewResource({ resourceName: '', name: '', type: '', description: '', quantity: 1, unit: '', allocatedTo: '' });
        setIsFormOpen(false);
    };

    const toggleForm = () => {
        setIsFormOpen(!isFormOpen);
        if (editingResourceId) {
            handleCancelEdit();
        }
    };
    const handleApproveRequest = async (request) => {
      try {
          // Add the resource to the resources collection
          await axios.post(baseURL, {
              resourceName: request.resourceName,
              name: request.name,
              type: request.type,
              description: request.description,
              quantity: request.quantity,
              unit: request.unit,
              allocatedTo: request.allocatedTo,
          });
  
          // Then delete the request from the requestresources collection
          await axios.delete(`${requestBaseURL}/${request._id}`);
  
          // Fetch the updated request list
          await fetchResourceRequests();
  
          // Refresh the resources list
          await fetchResources();
  
          alert('Request approved and resource added.');
      } catch (err) {
          console.error("Error approving resource request:", err);
          setError(err.response?.data?.message || "Failed to approve resource request.");
          alert('Failed to approve resource request.');
      }
  };
  
  

    const handleDeclineRequest = async (id) => {
        try {
            await axios.delete(`${requestBaseURL}/${id}`);
            fetchResourceRequests();
            alert('Request declined and removed.');
        } catch (err) {
            console.error("Error declining resource request:", err);
            setError(err.message || "Failed to decline resource request");
            alert('Failed to decline resource request.');
        }
    };


 

    return (
        <div className="px-4 bg-gray-200 min-h-screen">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-black">Resources Allocation</h1>

                {/* Add/Edit Resource Form (Collapsible) */}
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">{editingResourceId ? 'Edit Resource' : 'Add New Resource'}</h2>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
                            onClick={toggleForm}
                        >
                            {isFormOpen ? <FaCaretUp /> : <FaCaretDown />}
                        </button>
                    </div>

                    {isFormOpen && (
                        <form onSubmit={editingResourceId ? handleUpdate : handleSubmit}>


                            {/* Display Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={newResource.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    required
                                />
                            </div>

                            {/* Resource Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceName">
                                    Resource Name:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="resourceName"
                                    type="text"
                                    name="resourceName"
                                    value={newResource.resourceName}
                                    onChange={handleInputChange}
                                    placeholder="Resource Name"
                                    required
                                />
                            </div>


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                    Type:
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white  leading-tight focus:outline-none focus:shadow-outline"
                                    id="type"
                                    name="type"
                                    value={newResource.type}
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description:
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white  leading-tight focus:outline-none focus:shadow-outline"
                                    id="description"
                                    name="description"
                                    value={newResource.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                                    Quantity:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white  leading-tight focus:outline-none focus:shadow-outline"
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={newResource.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Quantity"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
                                    Unit:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white  leading-tight focus:outline-none focus:shadow-outline"
                                    id="unit"
                                    type="text"
                                    name="unit"
                                    value={newResource.unit}
                                    onChange={handleInputChange}
                                    placeholder="Unit (e.g., kg, liters, pieces)"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allocatedTo">
                                    Allocated To:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white  leading-tight focus:outline-none focus:shadow-outline"
                                    id="allocatedTo"
                                    type="text"
                                    name="allocatedTo"
                                    value={newResource.allocatedTo}
                                    onChange={handleInputChange}
                                    placeholder="Location/Department"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    {editingResourceId ? 'Update Resource' : 'Add Resource'}
                                </button>
                                {editingResourceId && (
                                    <button
                                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* Resource Requests Section */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 text-black">Resource Requests</h2>
                    {isRequestLoading ? (
                        <p>Loading resource requests...</p>
                    ) : resourceRequests.length > 0 ? (
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
                                        <th className="py-2 px-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resourceRequests.map((request) => (
                                        <tr key={request._id}>
                                            <td className="py-2 px-4 border-b">{request.name}</td>
                                            <td className="py-2 px-4 border-b">{request.resourceName}</td>
                                            <td className="py-2 px-4 border-b">{request.type}</td>
                                            <td className="py-2 px-4 border-b">{request.description}</td>
                                            <td className="py-2 px-4 border-b">{request.quantity}</td>
                                            <td className="py-2 px-4 border-b">{request.unit}</td>
                                            <td className="py-2 px-4 border-b">{request.allocatedTo}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                    onClick={() => handleApproveRequest(request)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleDeclineRequest(request._id)}
                                                >
                                                    Decline
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No resource requests found.</p>
                    )}
                </div>

                {/* Resource List (MOVED TO BOTTOM) */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 text-black">Resource List</h2>
                    {isLoading ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                        <th className="py-2 px-4 border-b"><Skeleton height={20} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                            <td className="py-2 px-4 border-b"><Skeleton height={20} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Resource Name</th>{/* Add Resource Name */}
                                        <th className="py-2 px-4 border-b">Type</th>
                                        <th className="py-2 px-4 border-b">Description</th>
                                        <th className="py-2 px-4 border-b">Quantity</th>
                                        <th className="py-2 px-4 border-b">Unit</th>
                                        <th className="py-2 px-4 border-b">Allocated To</th>
                                        <th className="py-2 px-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resources.map((resource) => (
                                        <tr key={resource._id}>
                                            <td className="py-2 px-4 border-b">{resource.name}</td>
                                            <td className="py-2 px-4 border-b">{resource.resourceName}</td>{/* Add ResourceName */}
                                            <td className="py-2 px-4 border-b">{resource.type}</td>
                                            <td className="py-2 px-4 border-b">{resource.description}</td>
                                            <td className="py-2 px-4 border-b">{resource.quantity}</td>
                                            <td className="py-2 px-4 border-b">{resource.unit}</td>
                                            <td className="py-2 px-4 border-b">{resource.allocatedTo}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                    onClick={() => handleEdit(resource)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleDelete(resource._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
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

export default ResourcesAllocation;
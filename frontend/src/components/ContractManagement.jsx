import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/contracts'
    : 'http://localhost:7690/api/contracts';

const ContractManagement = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        contractNumber: '',
        partiesInvolved: { supplier: '', customer: '', partner: '' },
        contractDocument: '',
        status: 'draft',
        // You can add more fields here based on your Contract model
    });
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [reviewNoteText, setReviewNoteText] = useState(''); // State for review note input
    const [selectedContractForReview, setSelectedContractForReview] = useState(null); // Track contract for review notes


    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/contracts`);
            setContracts(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch contracts');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('partiesInvolved.')) {
            const partiesPart = name.split('.')[1];
            setFormData(prevState => ({
                ...prevState,
                partiesInvolved: {
                    ...prevState.partiesInvolved,
                    [partiesPart]: value,
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
          const userName = localStorage.getItem('userName'); // Get username
 
          if (isEditing && selectedContractId) {
              await axios.put(`${BASE_URL}/contracts/${selectedContractId}`, { ...formData, updatedByUsername: userName }); // Include for update
              alert('Contract updated successfully!');
          } else {
              await axios.post(`${BASE_URL}/contracts`, { ...formData, createdByUsername: userName }); // Include for CREATE! <---- IMPORTANT CHANGE
              alert('Contract created successfully!');
          }
          fetchContracts();
          resetForm();
          setIsCreating(false);
          setIsEditing(false);
          setLoading(false);
      } catch (err) {
          setError(err.response?.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'create'} contract`);
          setLoading(false);
      }
  };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contract?')) {
            setLoading(true);
            setError(null);
            try {
                await axios.delete(`${BASE_URL}/contracts/${id}`);
                alert('Contract deleted successfully!');
                fetchContracts(); // Refresh contract list
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to delete contract');
                setLoading(false);
            }
        }
    };

    const handleEdit = async (id) => {
        setIsEditing(true);
        setIsCreating(true); // Open the form area
        setSelectedContractId(id);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/contracts/${id}`);
            setFormData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch contract for editing');
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setIsEditing(false);
        resetForm();
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setIsEditing(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            contractNumber: '',
            partiesInvolved: { supplier: '', customer: '', partner: '' },
            contractDocument: '',
            status: 'draft',
        });
        setSelectedContractId(null);
    };

    // --- NEW FUNCTIONS: Approve, Reject, Search, Review Note ---
    const handleApprove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const userName = localStorage.getItem('userName'); // Get username from localStorage
            await axios.post(`${BASE_URL}/contracts/${id}/approve`, { userName }); // Send username in body
            alert('Contract approved successfully!');
            fetchContracts();
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to approve contract');
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const userName = localStorage.getItem('userName'); // Get username from localStorage
            await axios.post(`${BASE_URL}/contracts/${id}/reject`, { userName }); // Send username in body
            alert('Contract rejected successfully!');
            fetchContracts();
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reject contract');
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/contracts/search?q=${searchTerm}`);
            setContracts(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to search contracts');
            setLoading(false);
        }
    };

    const handleAddReviewNote = async (id) => {
        if (!reviewNoteText.trim()) {
            alert('Please enter a review note.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${BASE_URL}/contracts/${id}/review-note`, { comment: reviewNoteText });
            alert('Review note added successfully!');
            setReviewNoteText(''); // Clear input after successful submission
            setSelectedContractForReview(null); // Hide review input after submission
            fetchContracts(); // Refresh contracts to show new review notes
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to add review note');
            setLoading(false);
        }
    };

    const handleReviewNoteClick = (contractId) => {
        setSelectedContractForReview(contractId === selectedContractForReview ? null : contractId); // Toggle visibility
    };


    if (loading) return <div className="text-center">Loading contracts...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
      <div className="min-h-screen py-6"> 
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Contract Management</h2>

            <div className="mb-4 flex justify-between items-center">
                <div>
                    {!isCreating && <button onClick={handleCreateNew} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Create New Contract
                    </button>}
                    {isCreating && <button onClick={handleCancelCreate} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2">
                        Cancel
                    </button>}
                </div>
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border rounded-md mr-2"
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
                </form>
            </div>


            {isCreating && (
                <div className="mb-8 p-4 border rounded shadow-md">
                    <h3 className="text-xl font-semibold mb-3">{isEditing ? 'Edit Contract' : 'Create New Contract'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Form Fields - unchanged */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 p-2 w-full border rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700">Contract Number</label>
                            <input type="text" id="contractNumber" name="contractNumber" value={formData.contractNumber} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parties Involved</label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label htmlFor="supplier" className="block text-xs font-medium text-gray-700">Supplier</label>
                                    <input type="text" id="supplier" name="partiesInvolved.supplier" value={formData.partiesInvolved.supplier} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md text-xs" />
                                </div>
                                <div>
                                    <label htmlFor="customer" className="block text-xs font-medium text-gray-700">Customer</label>
                                    <input type="text" id="customer" name="partiesInvolved.customer" value={formData.partiesInvolved.customer} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md text-xs" />
                                </div>
                                <div>
                                    <label htmlFor="partner" className="block text-xs font-medium text-gray-700">Partner</label>
                                    <input type="text" id="partner" name="partiesInvolved.partner" value={formData.partiesInvolved.partner} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md text-xs" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="contractDocument" className="block text-sm font-medium text-gray-700">Contract Document</label>
                            <textarea id="contractDocument" name="contractDocument" value={formData.contractDocument} onChange={handleInputChange} required rows="3" className="mt-1 p-2 w-full border rounded-md"></textarea>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md">
                                <option value="draft">Draft</option>
                                <option value="review">Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="terminated">Terminated</option>
                            </select>
                        </div>


                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                {isEditing ? 'Update Contract' : 'Create Contract'}
                            </button>
                        </div>
                    </form>
                </div>
            )}


            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-200 px-4 py-2">Title</th>
                            <th className="border border-gray-200 px-4 py-2">Contract Number</th>
                            <th className="border border-gray-200 px-4 py-2">Start Date</th>
                            <th className="border border-gray-200 px-4 py-2">End Date</th>
                            <th className="border border-gray-200 px-4 py-2">Status</th>
                            <th className="border border-gray-200 px-4 py-2">Actions</th>
                            <th className="border border-gray-200 px-4 py-2">Workflow</th>
                            <th className="border border-gray-200 px-4 py-2">Review Notes</th>
                            <th className="border border-gray-200 px-4 py-2">History Tracker</th>
                            <th className="border border-gray-200 px-4 py-2">Created By</th> {/* NEW Created By */}
                            <th className="border border-gray-200 px-4 py-2">Last Edited By</th> {/* NEW Last Edited By */}
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(contract => (
                            <tr key={contract._id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2">{contract.title}</td>
                                <td className="border border-gray-200 px-4 py-2">{contract.contractNumber || 'N/A'}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                    {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{contract.status}</td>
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                    <button onClick={() => handleEdit(contract._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs mr-1">Edit</button>
                                    <button onClick={() => handleDelete(contract._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Delete</button>
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                    {contract.status !== 'approved' && (
                                        <button onClick={() => handleApprove(contract._id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs mr-1">Approve</button>
                                    )}
                                    {contract.status !== 'rejected' && (
                                        <button onClick={() => handleReject(contract._id)} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded text-xs">Reject</button>
                                    )}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <button onClick={() => handleReviewNoteClick(contract._id)} className="text-blue-500 hover:text-blue-700 text-xs underline cursor-pointer">
                                        {contract.reviewNotes && contract.reviewNotes.length > 0 ? `View Notes (${contract.reviewNotes.length})` : 'Add Note'}
                                    </button>
                                    {selectedContractForReview === contract._id && (
                                        <div className="mt-2">
                                            {contract.reviewNotes && contract.reviewNotes.map((note, index) => (
                                                <div key={index} className="mb-1 p-2 border rounded bg-gray-50 text-xs">
                                                    <p className="font-semibold">Note {index + 1}:</p>
                                                    <p>{note.comment}</p>
                                                    <p className="text-gray-500 text-xs text-right">{new Date(note.date).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                            <textarea
                                                placeholder="Add a review note..."
                                                value={reviewNoteText}
                                                onChange={(e) => setReviewNoteText(e.target.value)}
                                                className="mt-2 p-2 w-full border rounded-md text-xs"
                                                rows="2"
                                            />
                                            <div className="text-right mt-1">
                                                <button onClick={() => handleAddReviewNote(contract._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">Add Note</button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                {/* --- HISTORY TRACKER COLUMN --- */}
                                <td className="border border-gray-200 px-4 py-2 text-xs">
                                    {contract.approvalHistory && contract.approvalHistory.length > 0 ? (
                                        contract.approvalHistory[contract.approvalHistory.length - 1].status === 'approved' ? (
                                            <span className="text-green-600">Approved by: <br/> {contract.approvalHistory[contract.approvalHistory.length - 1].username}</span>
                                        ) : contract.approvalHistory[contract.approvalHistory.length - 1].status === 'rejected' ? (
                                            <span className="text-orange-600">Rejected by: <br/> {contract.approvalHistory[contract.approvalHistory.length - 1].username}</span>
                                        ) : (
                                            'No Action Yet' // Or handle other history statuses if needed
                                        )
                                    ) : (
                                        'No History'
                                    )}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{contract.createdByUsername}</td>  {/* NEW Created By */}
                                <td className="border border-gray-200 px-4 py-2">{contract.updatedByUsername}</td> {/* NEW Last Edited By */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            </div>
      </div>
  );
};

export default ContractManagement;
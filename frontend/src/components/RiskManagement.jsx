// frontend/src/components/RiskAssessment/RiskManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList
} from 'recharts';

// Define BASE_URL based on environment
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/risk-assessments'
    : 'http://localhost:7690/api/risk-assessments';

const RiskManagement = () => {
  const navigate = useNavigate();
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    likelihood: 'Medium',
    impact: 'Medium',
    mitigationStrategies: '',
    status: 'Open',
    reviewDate: '',
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [viewingAssessmentId, setViewingAssessmentId] = useState(null);
  const [viewingAssessmentDetails, setViewingAssessmentDetails] = useState(null);
  const [loadingViewDetails, setLoadingViewDetails] = useState(false);
  const [errorViewDetails, setErrorViewDetails] = useState(null);


  console.log("RiskManagement component is being rendered!");

  useEffect(() => {
    // Fetch ACTIVE Risk Assessments List
    const fetchRiskAssessments = async () => {
      setLoadingList(true);
      setErrorList(null);
      try {
        const response = await axios.get(BASE_URL); // BASE_URL already fetches active ones by default
        console.log("API Response Data (Active):", response.data);
        setRiskAssessments(response.data);
        setLoadingList(false);
      } catch (err) {
        setErrorList(err.message);
        setLoadingList(false);
        console.error("Error fetching active risk assessments:", err);
      }
    };
    fetchRiskAssessments();
  }, []);

  useEffect(() => {
    if (isEditMode && currentAssessmentId) {
      const fetchAssessmentForEdit = async () => {
        setLoadingForm(true);
        setErrorForm(null);
        try {
          const response = await axios.get(`${BASE_URL}/${currentAssessmentId}`);
          setFormData(response.data);
        } catch (err) {
          setErrorForm(err.message);
          console.error("Error fetching risk assessment for edit:", err);
        } finally {
          setLoadingForm(false);
        }
      };
      fetchAssessmentForEdit();
    } else if (!isEditMode) {
      resetForm();
    }
  }, [isEditMode, currentAssessmentId]);

  useEffect(() => {
    if (viewingAssessmentId) {
      const fetchAssessmentDetails = async () => {
        setLoadingViewDetails(true);
        setErrorViewDetails(null);
        try {
          const response = await axios.get(`${BASE_URL}/${viewingAssessmentId}`);
          setViewingAssessmentDetails(response.data);
        } catch (err) {
          setErrorViewDetails(err.message);
          console.error("Error fetching risk assessment details for view:", err);
        } finally {
          setLoadingViewDetails(false);
        }
      };
      fetchAssessmentDetails();
    } else {
      setViewingAssessmentDetails(null);
    }
  }, [viewingAssessmentId]);


  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Other',
      likelihood: 'Medium',
      impact: 'Medium',
      mitigationStrategies: '',
      status: 'Open',
      reviewDate: '',
    });
    setErrorForm(null);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setErrorForm(null);
    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/${currentAssessmentId}`, formData);
        alert('Risk Assessment updated successfully!');
      } else {
        await axios.post(BASE_URL, formData);
        alert('Risk Assessment created successfully!');
      }
      setShowForm(false);
      setIsEditMode(false);
      setCurrentAssessmentId(null);
      resetForm();
      // Refetch the risk assessment list to update the view (active list)
      const response = await axios.get(BASE_URL);
      setRiskAssessments(response.data);
    } catch (err) {
      setErrorForm(err.response?.data?.message || err.message);
      console.error("Error submitting risk assessment:", err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} risk assessment. See console for details.`);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleCreateNewClick = () => {
    setShowForm(true);
    setIsEditMode(false);
    setCurrentAssessmentId(null);
    resetForm();
    setViewingAssessmentId(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setCurrentAssessmentId(null);
    resetForm();
  };

  const handleEditClick = (id) => {
    setShowForm(true);
    setIsEditMode(true);
    setCurrentAssessmentId(id);
    setViewingAssessmentId(null);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this risk assessment? This action cannot be undone.")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`); // Hard delete
        alert('Risk Assessment permanently deleted successfully!');
        // Update the list after successful deletion (active list)
        const response = await axios.get(BASE_URL);
        setRiskAssessments(response.data);
        setViewingAssessmentId(null);
      } catch (err) {
        console.error("Error deleting risk assessment:", err);
        alert('Failed to permanently delete risk assessment.');
      }
    }
  };

  const handleRemoveClick = async (id) => { // Soft delete (archive)
    if (window.confirm("Are you sure you want to REMOVE this risk assessment? It will be moved to archive.")) {
      try {
        await axios.patch(`${BASE_URL}/${id}/archive`); // Call the archive endpoint
        alert('Risk Assessment removed to archive successfully!');
        // Update the list after successful remove (active list)
        const response = await axios.get(BASE_URL);
        setRiskAssessments(response.data);
        setViewingAssessmentId(null);
      } catch (err) {
        console.error("Error removing risk assessment:", err);
        alert('Failed to remove risk assessment to archive.');
      }
    }
  };


  const handleViewClick = (id) => {
    setViewingAssessmentId(id);
    setShowForm(false);
  };

  const handleBackToList = () => {
    setViewingAssessmentId(null);
    setViewingAssessmentDetails(null);
  };

  const getNumericalValue = (level) => {
    switch (level) {
      case 'Very Low': return 1;
      case 'Low': return 2;
      case 'Medium': return 3;
      case 'High': return 4;
      case 'Very High': return 5;
      default: return 0; // Or handle error/unknown cases
    }
  };


  const renderRiskAssessmentList = () => {
    if (loadingList) {
      return <div className="text-center p-4">Loading Risk Assessments...</div>;
    }

    if (errorList) {
      return <div className="text-red-500 p-4">Error: {errorList}</div>;
    }

    if (viewingAssessmentId && viewingAssessmentDetails) {
      return renderRiskAssessmentDetails();
    }

    // Prepare chart data for Recharts
    const chartData = riskAssessments.map(assessment => ({
      name: assessment.title,
      likelihood: getNumericalValue(assessment.likelihood),
      impact: getNumericalValue(assessment.impact),
    }));


    return (
      <div className="min-h-screen py-6">
      <div>
        <div className="mb-4 flex justify-between items-center"> {/* Use flex to align buttons */}
          <div> {/* Container for Create New button */}
            <button onClick={handleCreateNewClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Create New Risk Assessment
            </button>
          </div>
          <div> {/* Container for Inactive Assessments Link */}
            <Link to="/home/InactiveRiskAssessments" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 inline-block"> {/* ml-2 for spacing */}
              View Inactive Assessments
            </Link>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="mb-6">
          <LineChart width={700} height={300} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"  >
              <Label value="Risk Assessment Title" offset={0} position="bottom" />
            </XAxis>
            <YAxis domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(value) => {
                switch (value) {
                    case 1: return 'Very Low';
                    case 2: return 'Low';
                    case 3: return 'Medium';
                    case 4: return 'High';
                    case 5: return 'Very High';
                    default: return '';
                }
            }}>
              <Label value="Risk Level" angle={-90} position='left' style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="likelihood" stroke="#82ca9d" strokeWidth={2} label={<LabelList dataKey="likelihood" position="top" formatter={(value) => {
                 switch (value) {
                    case 1: return 'Very Low';
                    case 2: return 'Low';
                    case 3: return 'Medium';
                    case 4: return 'High';
                    case 5: return 'Very High';
                    default: return '';
                }
            }}/>}>
             </Line>
            <Line type="monotone" dataKey="impact" stroke="#8884d8" strokeWidth={2} label={<LabelList dataKey="impact" position="top" formatter={(value) => {
                 switch (value) {
                    case 1: return 'Very Low';
                    case 2: return 'Low';
                    case 3: return 'Medium';
                    case 4: return 'High';
                    case 5: return 'Very High';
                    default: return '';
                }
            }}/>}/>
          </LineChart>
           <div className="text-center mb-4">
              Risk Assessment Likelihood and Impact
            </div>
        </div>


        {riskAssessments.length === 0 ? (
          <p>No active risk assessments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Likelihood</th>
                  <th className="py-2 px-4 border-b">Impact</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskAssessments.map(assessment => (
                  <tr key={assessment._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{assessment.title}</td>
                    <td className="py-2 px-4 border-b">{assessment.category}</td>
                    <td className="py-2 px-4 border-b">{assessment.likelihood}</td>
                    <td className="py-2 px-4 border-b">{assessment.impact}</td>
                    <td className="py-2 px-4 border-b">{assessment.status}</td>
                    <td className="py-2 px-4 border-b space-x-2">
                      <button onClick={() => handleViewClick(assessment._id)} className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline">View</button>
                      <button onClick={() => handleEditClick(assessment._id)} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline">Update</button>
                      <button onClick={() => handleRemoveClick(assessment._id)} className="inline-block bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline">Remove</button>
                      {/* <button onClick={() => handleDeleteClick(assessment._id)} className="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline">Delete</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    );
  };

  const renderRiskAssessmentDetails = () => {
    if (loadingViewDetails) {
      return <div className="text-center p-4">Loading Risk Assessment Details...</div>;
    }
    if (errorViewDetails) {
      return <div className="text-red-500 p-4">Error: {errorViewDetails}</div>;
    }
    if (!viewingAssessmentDetails) {
      return <div className="text-center p-4">Could not load Risk Assessment Details.</div>;
    }

    const assessment = viewingAssessmentDetails;

    return (
      <div className="min-h-screen py-6">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Risk Assessment Details</h2>
          <h3 className="text-xl font-semibold mb-2">{assessment.title}</h3>
          <p className="mb-4"><strong>Description:</strong> {assessment.description}</p>
          <p className="mb-2"><strong>Category:</strong> {assessment.category}</p>
          <p className="mb-2"><strong>Likelihood:</strong> {assessment.likelihood}</p>
          <p className="mb-2"><strong>Impact:</strong> {assessment.impact}</p>
          <p className="mb-2"><strong>Mitigation Strategies:</strong> {assessment.mitigationStrategies || 'N/A'}</p>
          <p className="mb-2"><strong>Status:</strong> {assessment.status}</p>
          {assessment.reviewDate && <p className="mb-2"><strong>Review Date:</strong> {new Date(assessment.reviewDate).toLocaleDateString()}</p>}
          <div className="mt-6">
            <button onClick={handleBackToList} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  };


  const renderRiskAssessmentForm = () => {
    if (loadingForm) {
      return <div className="text-center p-4">Loading form...</div>;
    }

    if (errorForm) {
      return <div className="text-red-500 p-4">Error: {errorForm}</div>;
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Risk Assessment' : 'Create New Risk Assessment'}</h2>
        {/* Form fields - Title, Description, Category, etc. (same as before) */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Operations">Operations</option>
            <option value="Supply Chain">Supply Chain</option>
            <option value="Product Liability">Product Liability</option>
            <option value="Legal">Legal</option>
            <option value="Financial">Financial</option>
            <option value="Reputational">Reputational</option>
            <option value="Strategic">Strategic</option>
            <option value="Compliance">Compliance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="likelihood" className="block text-gray-700 text-sm font-bold mb-2">Likelihood:</label>
          <select id="likelihood" name="likelihood" value={formData.likelihood} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Very Low">Very Low</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Very High">Very High</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="impact" className="block text-gray-700 text-sm font-bold mb-2">Impact:</label>
          <select id="impact" name="impact" value={formData.impact} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Very Low">Very Low</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Very High">Very High</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="mitigationStrategies" className="block text-gray-700 text-sm font-bold mb-2">Mitigation Strategies:</label>
          <textarea id="mitigationStrategies" name="mitigationStrategies" value={formData.mitigationStrategies} onChange={handleChange} rows="3" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="reviewDate" className="block text-gray-700 text-sm font-bold mb-2">Review Date (Optional):</label>
          <input type="date" id="reviewDate" name="reviewDate" value={formData.reviewDate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isEditMode ? 'Update Risk Assessment' : 'Create Risk Assessment'}
          </button>
          <button type="button" onClick={handleCancelForm} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Cancel
          </button>
        </div>
      </form>
    );
  };



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Active Risk Assessments</h2> {/* Updated title */}
      {showForm ? renderRiskAssessmentForm() : renderRiskAssessmentList()}
    </div>
  );
};

export default RiskManagement;  
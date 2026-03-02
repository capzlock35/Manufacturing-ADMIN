// frontend/src/components/RiskAssessment/InactiveRiskAssessments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

// Define BASE_URL based on environment (reuse from RiskManagement)
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/risk-assessments'
    : 'http://localhost:7690/api/risk-assessments';

const InactiveRiskAssessments = () => {
  const [inactiveRiskAssessments, setInactiveRiskAssessments] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);
  const [viewingAssessmentId, setViewingAssessmentId] = useState(null);
  const [viewingAssessmentDetails, setViewingAssessmentDetails] = useState(null);
  const [loadingViewDetails, setLoadingViewDetails] = useState(false);
  const [errorViewDetails, setErrorViewDetails] = useState(null);


  useEffect(() => {
    // Fetch INACTIVE Risk Assessments List
    const fetchInactiveRiskAssessments = async () => {
      setLoadingList(true);
      setErrorList(null);
      try {
        const response = await axios.get(`${BASE_URL}/inactive`); // Call the inactive endpoint
        console.log("API Response Data (Inactive):", response.data);
        setInactiveRiskAssessments(response.data);
        setLoadingList(false);
      } catch (err) {
        setErrorList(err.message);
        setLoadingList(false);
        console.error("Error fetching inactive risk assessments:", err);
      }
    };
    fetchInactiveRiskAssessments();
  }, []);

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


  const handleRestoreClick = async (id) => { // Undo soft delete (restore)
    if (window.confirm("Are you sure you want to RESTORE this risk assessment? It will be moved back to active list.")) {
      try {
        await axios.patch(`${BASE_URL}/${id}/restore`); // Call the restore endpoint
        alert('Risk Assessment restored to active list successfully!');
        // Update the list after successful restore (inactive list)
        const response = await axios.get(`${BASE_URL}/inactive`);
        setInactiveRiskAssessments(response.data);
        setViewingAssessmentId(null);
      } catch (err) {
        console.error("Error restoring risk assessment:", err);
        alert('Failed to restore risk assessment to active list.');
      }
    }
  };

  const handleViewClick = (id) => {
    setViewingAssessmentId(id);
  };

  const handleBackToList = () => {
    setViewingAssessmentId(null);
    setViewingAssessmentDetails(null);
  };


  const renderInactiveRiskAssessmentList = () => {
    if (loadingList) {
      return <div className="text-center p-4">Loading Inactive Risk Assessments...</div>;
    }

    if (errorList) {
      return <div className="text-red-500 p-4">Error: {errorList}</div>;
    }

    if (viewingAssessmentId && viewingAssessmentDetails) {
      return renderRiskAssessmentDetails();
    }

    return (
      <div className="min-h-screen py-6">
        <div>
          <div className="mb-4"> {/* Container for button */}
            <Link to="/home/RiskManagement" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block">
              Back to Active Risk Assessments
            </Link>
          </div>
          {inactiveRiskAssessments.length === 0 ? (
            <p>No inactive risk assessments found.</p>
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
                  {inactiveRiskAssessments.map(assessment => (
                    <tr key={assessment._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{assessment.title}</td>
                      <td className="py-2 px-4 border-b">{assessment.category}</td>
                      <td className="py-2 px-4 border-b">{assessment.likelihood}</td>
                      <td className="py-2 px-4 border-b">{assessment.impact}</td>
                      <td className="py-2 px-4 border-b">{assessment.status}</td>
                      <td className="py-2 px-4 border-b space-x-2">
                        <button onClick={() => handleViewClick(assessment._id)} className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline">View</button>
                        <button onClick={() => handleRestoreClick(assessment._id)} className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline">Undo</button> {/* Undo (Restore) Button */}
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

  const renderRiskAssessmentDetails = () => { // Reused details rendering from RiskManagement.jsx
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
          <h2 className="text-2xl font-bold mb-4">Risk Assessment Details (Inactive)</h2>
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


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inactive/Archived Risk Assessments</h2> {/* Title for inactive list */}
      {viewingAssessmentId ? renderRiskAssessmentDetails() : renderInactiveRiskAssessmentList()}
    </div>
  );
};

export default InactiveRiskAssessments;
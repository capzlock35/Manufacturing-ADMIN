// frontend/src/components/QualityControl.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CiTrash } from "react-icons/ci";

const QualityControl = () => {
    const [batchId, setBatchId] = useState('');
    const [pHLevel, setPHLevel] = useState('');
    const [moisture, setMoisture] = useState('');
    const [fragranceRating, setFragranceRating] = useState('');
    const [colorRating, setColorRating] = useState('');
    const [concentration, setConcentration] = useState('');
    const [qcDataList, setQcDataList] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [notesCollapsed, setNotesCollapsed] = useState(true);
    const [pHLevelFeedback, setPHLevelFeedback] = useState('');

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/qc'
        : 'http://localhost:7690/api/qc';

  

    const qualityLimits = {
        pH: { 
            goodLower: 9.0, goodUpper: 10.5, 
            acceptableLower: 8.5, acceptableUpper: 11.0, 
            badLower: 8.5, badUpper: 11.0 // While badLower and badUpper are same as acceptable, it's good to have them for completeness in frontend notes if needed
        },
        moisture: { 
            goodLower: 8, goodUpper: 20, 
            acceptableLower: 5, acceptableUpper: 25, 
            badLower: 5, badUpper: 25 
        },
        fragranceRating: { 
            goodLower: 7, goodUpper: 10, 
            acceptableLower: 5, acceptableUpper: 6, 
            badLower: 5, badUpper: 0 // badUpper can be 0 as 'less than 5' implies below 5
        },
        colorRating: { 
            goodLower: 7, goodUpper: 10, 
            acceptableLower: 5, acceptableUpper: 6, 
            badLower: 5, badUpper: 0 // badUpper can be 0 as 'less than 5' implies below 5
        },
        concentration: { 
            goodLower: 15, goodUpper: 30, 
            acceptableLower: 10, acceptableUpper: 35, 
            badLower: 10, badUpper: 35 
        },
    };

    useEffect(() => {
        fetchQCMetrics();
    }, []);

    const fetchQCMetrics = async () => {
        try {
            const response = await axios.get(`${baseURL}/metrics`);
            setQcDataList(response.data.metrics.qcDataList);
        } catch (error) {
            console.error("Error fetching QC Metrics:", error);
            setErrorMessage("Error fetching QC data. Please check console.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus(null);
        setErrorMessage('');

        const qcData = {
            batchId,
            pHLevel: parseFloat(pHLevel),
            moisture: parseFloat(moisture),
            fragranceRating: parseFloat(fragranceRating),
            colorRating: parseFloat(colorRating),
            concentration: parseFloat(concentration),
        };

        try {
            await axios.post(`${baseURL}/data`, qcData);
            setSubmissionStatus('success');
            setBatchId('');
            setPHLevel('');
            setMoisture('');
            setFragranceRating('');
            setColorRating('');
            setConcentration('');
            fetchQCMetrics();
        } catch (error) {
            console.error("Error submitting QC Data:", error);
            setSubmissionStatus('error');
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Failed to submit QC data. Please check console.");
            }
        }
    };

    const toggleNotes = () => {
        setNotesCollapsed(!notesCollapsed);
    };

    const handlePHLevelChange = (e) => {
        const value = e.target.value;
        setPHLevel(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            if (numValue >= qualityLimits.pH.goodLower && numValue <= qualityLimits.pH.goodUpper) {
                setPHLevelFeedback('Good pH Level');
            } else if ((numValue >= qualityLimits.pH.acceptableLower && numValue < qualityLimits.pH.goodLower) || (numValue > qualityLimits.pH.goodUpper && numValue <= qualityLimits.pH.acceptableUpper)) {
                setPHLevelFeedback('Acceptable pH Level');
            }
             else {
                setPHLevelFeedback('pH Level is Bad');
            }
        } else {
            setPHLevelFeedback('');
        }
    };


    const handleDelete = async (batchIdToDelete) => { // Function to handle delete action
        if (!window.confirm(`Are you sure you want to delete QC Data for Batch ID: ${batchIdToDelete}? This action cannot be undone.`)) {
            return; // If user cancels confirmation, do nothing
        }

        try {
            await axios.delete(`${baseURL}/data/${batchIdToDelete}`); // DELETE request to backend
            setSubmissionStatus('success'); // Optionally set success status
            setErrorMessage('');
            fetchQCMetrics(); // Refresh data table after deletion
        } catch (error) {
            console.error("Error deleting QC Data:", error);
            setSubmissionStatus('error'); // Set error status
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Failed to delete QC data. Please check console.");
            }
        }
    };



    return (
        <div className="min-h-screen bg-white py-6">
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4 text-black">Quality Control Data Entry</h2>

                <div className="mb-4 border rounded shadow-sm">
        <button
            onClick={toggleNotes}
            className="w-full text-left py-2 px-4 bg-gray-100 text-black hover:bg-gray-200 rounded-t font-semibold flex justify-between items-center"
            aria-expanded={!notesCollapsed}
            aria-controls="qc-notes-content"
        >
            <span>Quality Parameter Limits & Notes</span>
            <svg
                className={`w-4 h-4 ml-2 transition-transform ${notesCollapsed ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>
        <div
            id="qc-notes-content"
            className={`overflow-hidden transition-max-height duration-300 ease-in-out ${notesCollapsed ? 'max-h-0' : 'max-h-96'}`}
        >
                        <div className="p-4 overflow-auto max-h-64">
                            <p className="mb-2">Quality status is determined based on these parameter ranges:</p>
                            <ul className="list-disc list-inside">
                                <li><strong>pH Level (0-14):</strong>
                                    <ul>
                                        <li>✅ Good (Pass): {qualityLimits.pH.goodLower} - {qualityLimits.pH.goodUpper}</li>
                                        <li>🟡 Acceptable (Borderline): {qualityLimits.pH.acceptableLower} - {qualityLimits.pH.goodLower} or {qualityLimits.pH.goodUpper} - {qualityLimits.pH.acceptableUpper}</li>
                                        <li>🔴 Bad (Fail): {"<"}{qualityLimits.pH.acceptableLower} or {">"}{qualityLimits.pH.acceptableUpper}</li>
                                    </ul>
                                </li>
                                <li><strong>Moisture % (0-100):</strong>
                                    <ul>
                                        <li>✅ Good (Pass): {qualityLimits.moisture.goodLower}% - {qualityLimits.moisture.goodUpper}%</li>
                                        <li>🟡 Acceptable (Borderline): {qualityLimits.moisture.acceptableLower}% - {qualityLimits.moisture.goodLower}% or {qualityLimits.moisture.goodUpper}% - {qualityLimits.moisture.acceptableUpper}%</li>
                                        <li>🔴 Bad (Fail): {"<"}{qualityLimits.moisture.acceptableLower}% or {">"}{qualityLimits.moisture.acceptableUpper}%</li>
                                    </ul>
                                </li>
                                <li><strong>Fragrance Rating (0-10):</strong>
                                    <ul>
                                        <li>✅ Good (Pass): {qualityLimits.fragranceRating.goodLower} - {qualityLimits.fragranceRating.goodUpper} (strong, pleasant)</li>
                                        <li>🟡 Acceptable (Borderline): {qualityLimits.fragranceRating.acceptableLower} - {qualityLimits.fragranceRating.acceptableUpper} (faint but acceptable)</li>
                                        <li>🔴 Bad (Fail): {"<"}{qualityLimits.fragranceRating.acceptableLower} (weak or bad smell)</li>
                                    </ul>
                                </li>
                                <li><strong>Color Rating (0-10):</strong>
                                    <ul>
                                        <li>✅ Good (Pass): {qualityLimits.colorRating.goodLower} - {qualityLimits.colorRating.goodUpper} (consistent & correct)</li>
                                        <li>🟡 Acceptable (Borderline): {qualityLimits.colorRating.acceptableLower} - {qualityLimits.colorRating.acceptableUpper} (slightly off but acceptable)</li>
                                        <li>🔴 Bad (Fail): {"<"}{qualityLimits.colorRating.acceptableLower} (wrong or uneven)</li>
                                    </ul>
                                </li>
                                <li><strong>Concentration (%):</strong>
                                    <ul>
                                        <li>✅ Good (Pass): {qualityLimits.concentration.goodLower}% - {qualityLimits.concentration.goodUpper}% (Normal)</li>
                                        <li>🟡 Acceptable (Borderline): {qualityLimits.concentration.acceptableLower}% - {qualityLimits.concentration.goodLower}% or {qualityLimits.concentration.goodUpper}% - {qualityLimits.concentration.acceptableUpper}%</li>
                                        <li>🔴 Bad (Fail): {"<"}{qualityLimits.concentration.acceptableLower}% (too weak) or {">"}{qualityLimits.concentration.acceptableUpper}% (too strong)</li>
                                    </ul>
                                </li>
                            </ul>
                            <p className="mt-2 text-sm text-gray-600"><strong>Note:</strong> These limits are for quality assessment.</p>
                        </div>
                    </div>
                </div>



                {submissionStatus === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4" role="alert">
                        <strong className="font-bold">Success!</strong> QC Data submitted successfully.
                    </div>
                )}
                {submissionStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4" role="alert">
                        <strong className="font-bold">Error!</strong> {errorMessage || "Failed to submit QC data."}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mb-8 border px-8 py-8 border-black bg-gray-200">
                    <div className="mb-4">
                        <label htmlFor="batchId" className="block text-gray-700 text-sm font-bold mb-2">Batch ID:</label>
                        <input type="text" id="batchId" className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black  leading-tight focus:outline-none focus:shadow-outline" value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="Enter Batch ID" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pHLevel" className="block text-gray-700 text-sm font-bold mb-2">pH Level (Range: 0-14):</label>
                        <input
                            type="number"
                            id="pHLevel"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black  leading-tight focus:outline-none focus:shadow-outline ${pHLevelFeedback === 'pH Level is Bad' ? 'border-red-500' : (pHLevelFeedback === 'Acceptable pH Level' ? 'border-yellow-500' : '')}`}
                            value={pHLevel}
                            onChange={handlePHLevelChange}
                            placeholder="Enter pH Level"
                            required
                            min="0"
                            max="14"
                            step="any"
                        />
                        {pHLevelFeedback && (
                            <p className={`text-sm ${pHLevelFeedback === 'Good pH Level' ? 'text-green-500' : (pHLevelFeedback === 'Acceptable pH Level' ? 'text-yellow-500' : 'text-red-500')} mt-1`}>{pHLevelFeedback}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="moisture" className="block text-gray-700 text-sm font-bold mb-2">Moisture % (Range: 0-100):</label>
                        <input type="number" id="moisture" className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black  leading-tight focus:outline-none focus:shadow-outline" value={moisture} onChange={(e) => setMoisture(e.target.value)} placeholder="Enter Moisture %" required min="0" max="100" step="any" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fragranceRating" className="block text-gray-700 text-sm font-bold mb-2">Fragrance Rating (Range: 0-10):</label>
                        <input type="number" id="fragranceRating" className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black  leading-tight focus:outline-none focus:shadow-outline" value={fragranceRating} onChange={(e) => setFragranceRating(e.target.value)} placeholder="Enter Fragrance Rating" required min="0" max="10" step="any" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="colorRating" className="block text-gray-700 text-sm font-bold mb-2">Color Rating (Range: 0-10):</label>
                        <input type="number" id="colorRating" className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black  leading-tight focus:outline-none focus:shadow-outline" value={colorRating} onChange={(e) => setColorRating(e.target.value)} placeholder="Enter Color Rating" required min="0" max="10" step="any" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="concentration" className="block text-gray-700 text-sm font-bold mb-2">Concentration:</label>
                        <input type="number" id="concentration" className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black  leading-tight focus:outline-none focus:shadow-outline" value={concentration} onChange={(e) => setConcentration(e.target.value)} placeholder="Enter Concentration" required step="any" />
                    </div>

                    <div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Submit QC Data
                        </button>
                    </div>
                </form>

                <h3 className="text-xl font-semibold text-black mb-2">QC Data Table</h3>
                <div className="overflow-x-auto">
                    <table className="table-auto min-w-full bg-white border border-b-2  border-black shadow-md rounded-md ">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-black">Batch ID</th>
                                <th className="py-2 px-4 border-b text-black">Timestamp</th>
                                <th className="py-2 px-4 border-b text-black">pH Level</th>
                                <th className="py-2 px-4 border-b text-black">Moisture %</th>
                                <th className="py-2 px-4 border-b text-black">Fragrance Rating</th>
                                <th className="py-2 px-4 border-b text-black">Color Rating</th>
                                <th className="py-2 px-4 border-b text-black">Concentration</th>
                                <th className="py-2 px-4 border-b text-center text-black">Status</th>
                                <th className="py-2 px-4 border-b text-center text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qcDataList.map((data) => (
                                <tr key={data._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-black">{data.batchId}</td>
                                    <td className="py-2 px-4 border-b text-black">{new Date(data.timestamp).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b text-black">{data.pHLevel}</td>
                                    <td className="py-2 px-4 border-b text-black">{data.moisture !== null ? data.moisture : '-'}</td>
                                    <td className="py-2 px-4 border-b text-black">{data.fragranceRating !== null ? data.fragranceRating : '-'}</td>
                                    <td className="py-2 px-4 border-b text-black">{data.colorRating !== null ? data.colorRating : '-'}</td>
                                    <td className="py-2 px-4 border-b text-black">{data.concentration !== null ? data.concentration : '-'}</td>
                                    <td className={`py-2 px-4 border-b font-semibold text-center`}>
                                        {data.status === 'Good' && <span className="text-green-600">✅ Good</span>}
                                        {data.status === 'Acceptable' && <span className="text-yellow-600">🟡 Acceptable</span>}
                                        {data.status === 'Bad' && <span className="text-red-600">🔴 Bad</span>}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center"> {/* Actions column */}
                                        <button
                                            onClick={() => handleDelete(data.batchId)} // Call handleDelete function
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                                        >
                                            <CiTrash className="inline-block align-middle mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {qcDataList.length === 0 && (
                                <tr>
                                    <td className="py-2 px-4 text-center" colSpan="8">No QC data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>    
    );
};

export default QualityControl;
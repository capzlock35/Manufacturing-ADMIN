import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CiTrash, CiRead } from "react-icons/ci"; // Added CiRead for view icon

// --- Simple Modal Component ---
const IngredientsModal = ({ isOpen, onClose, batchId, ingredients }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Ingredients for Batch: {batchId}</h3>
                    <div className="mt-2 px-7 py-3 max-h-60 overflow-y-auto">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {ingredients || 'No ingredients specified.'}
                        </p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const QualityControl = () => {
    // Existing state
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

    // New state for ingredients, expiration, and modal
    const [ingredients, setIngredients] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ batchId: '', ingredients: '' });


    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/qc'
        : 'http://localhost:7690/api/qc';


    const qualityLimits = {
        pH: { goodLower: 9.0, goodUpper: 10.5, acceptableLower: 8.5, acceptableUpper: 11.0, badLower: 8.5, badUpper: 11.0 },
        moisture: { goodLower: 8, goodUpper: 20, acceptableLower: 5, acceptableUpper: 25, badLower: 5, badUpper: 25 },
        fragranceRating: { goodLower: 7, goodUpper: 10, acceptableLower: 5, acceptableUpper: 6, badLower: 5, badUpper: 0 },
        colorRating: { goodLower: 7, goodUpper: 10, acceptableLower: 5, acceptableUpper: 6, badLower: 5, badUpper: 0 },
        concentration: { goodLower: 15, goodUpper: 30, acceptableLower: 10, acceptableUpper: 35, badLower: 10, badUpper: 35 },
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

        // Ensure Expiration Date is provided
        if (!expirationDate) {
            setSubmissionStatus('error');
            setErrorMessage("Expiration Date is required.");
            return;
        }


        const qcData = {
            batchId,
            pHLevel: parseFloat(pHLevel),
            moisture: parseFloat(moisture),
            fragranceRating: parseFloat(fragranceRating),
            colorRating: parseFloat(colorRating),
            concentration: parseFloat(concentration),
            ingredients, // Add ingredients
            expirationDate, // Add expiration date
        };

        try {
            await axios.post(`${baseURL}/data`, qcData);
            setSubmissionStatus('success');
            // Clear form fields
            setBatchId('');
            setPHLevel('');
            setMoisture('');
            setFragranceRating('');
            setColorRating('');
            setConcentration('');
            setIngredients(''); // Clear ingredients
            setExpirationDate(''); // Clear expiration date
            setPHLevelFeedback(''); // Clear feedback
            fetchQCMetrics(); // Refresh data
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
            } else {
                setPHLevelFeedback('pH Level is Bad');
            }
        } else {
            setPHLevelFeedback('');
        }
    };


    const handleDelete = async (batchIdToDelete) => {
        if (!window.confirm(`Are you sure you want to delete QC Data for Batch ID: ${batchIdToDelete}? This action cannot be undone.`)) {
            return;
        }

        try {
            await axios.delete(`${baseURL}/data/${batchIdToDelete}`);
            setSubmissionStatus('success');
            setErrorMessage(`Successfully deleted data for Batch ID: ${batchIdToDelete}`); // Provide specific feedback
            fetchQCMetrics();
        } catch (error) {
            console.error("Error deleting QC Data:", error);
            setSubmissionStatus('error');
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Failed to delete QC data. Please check console.");
            }
        }
    };

    // --- Modal Handlers ---
    const handleViewIngredients = (batchId, ingredients) => {
        setModalContent({ batchId, ingredients });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent({ batchId: '', ingredients: '' }); // Clear content
    };


    return (
        <div className="min-h-screen bg-white py-6">
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4 text-black">Quality Control Data</h2>

                {/* --- Quality Limits Notes Section (Unchanged) --- */}
                <div className="mb-4 border rounded shadow-sm">
                    <button
                        onClick={toggleNotes}
                        className="w-full text-left py-2 px-4 bg-gray-100 text-black hover:bg-gray-200 rounded-t font-semibold flex justify-between items-center"
                        aria-expanded={!notesCollapsed}
                        aria-controls="qc-notes-content"
                    >
                        <span>Quality Parameter Limits & Notes</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform ${notesCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="qc-notes-content" className={`overflow-hidden transition-max-height duration-300 ease-in-out ${notesCollapsed ? 'max-h-0' : 'max-h-96'}`}>
                        <div className="p-4 overflow-auto max-h-64">
                            {/* Content unchanged */}
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

                {/* --- Submission Status Messages (Unchanged) --- */}
                {submissionStatus === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4" role="alert">
                        <strong className="font-bold">Success!</strong> {errorMessage || "QC Data submitted successfully."}
                    </div>
                )}
                {submissionStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4" role="alert">
                        <strong className="font-bold">Error!</strong> {errorMessage || "Failed to process QC data."}
                    </div>
                )}

                {/* --- QC Data Entry Form (Updated) --- */}
                <form onSubmit={handleSubmit} className="mb-8 border px-8 py-8 border-black bg-gray-200 rounded shadow">
                    {/* Existing Fields */}
                    <div className="mb-4">
                        <label htmlFor="batchId" className="block text-gray-700 text-sm font-bold mb-2">Batch ID:</label>
                        <input type="text" id="batchId" className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline" value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="Enter Unique Batch ID" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pHLevel" className="block text-gray-700 text-sm font-bold mb-2">pH Level (0-14):</label>
                        <input type="number" id="pHLevel" className={`shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline ${pHLevelFeedback === 'pH Level is Bad' ? 'border-red-500' : (pHLevelFeedback === 'Acceptable pH Level' ? 'border-yellow-500' : '')}`} value={pHLevel} onChange={handlePHLevelChange} placeholder="Enter pH Level" required min="0" max="14" step="any" />
                        {pHLevelFeedback && (<p className={`text-sm ${pHLevelFeedback === 'Good pH Level' ? 'text-green-600' : (pHLevelFeedback === 'Acceptable pH Level' ? 'text-yellow-600' : 'text-red-600')} mt-1`}>{pHLevelFeedback}</p>)}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="moisture" className="block text-gray-700 text-sm font-bold mb-2">Moisture % (0-100):</label>
                        <input type="number" id="moisture" className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline" value={moisture} onChange={(e) => setMoisture(e.target.value)} placeholder="Enter Moisture %" required min="0" max="100" step="any" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fragranceRating" className="block text-gray-700 text-sm font-bold mb-2">Fragrance Rating (0-10):</label>
                        <input type="number" id="fragranceRating" className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline" value={fragranceRating} onChange={(e) => setFragranceRating(e.target.value)} placeholder="Enter Fragrance Rating" required min="0" max="10" step="any" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="colorRating" className="block text-gray-700 text-sm font-bold mb-2">Color Rating (0-10):</label>
                        <input type="number" id="colorRating" className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline" value={colorRating} onChange={(e) => setColorRating(e.target.value)} placeholder="Enter Color Rating" required min="0" max="10" step="any" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="concentration" className="block text-gray-700 text-sm font-bold mb-2">Concentration (%):</label>
                        <input type="number" id="concentration" className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline" value={concentration} onChange={(e) => setConcentration(e.target.value)} placeholder="Enter Concentration %" required step="any" />
                    </div>

                    {/* --- New Fields --- */}
                    <div className="mb-4">
                        <label htmlFor="ingredients" className="block text-gray-700 text-sm font-bold mb-2">Ingredients:</label>
                        <textarea
                            id="ingredients"
                            rows="3"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="Enter ingredients list (optional)"
                        />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="expirationDate" className="block text-gray-700 text-sm font-bold mb-2">Expiration Date:</label>
                        <input
                            type="date"
                            id="expirationDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            required // Make expiration date required
                        />
                    </div>


                    <div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Submit QC Data
                        </button>
                    </div>
                </form>

                {/* --- QC Data Table (Updated) --- */}
                <h3 className="text-xl font-semibold text-black mb-2">QC Data Table</h3>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="table-auto min-w-full bg-white border border-b-2 border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-black">Batch ID</th>
                                <th className="py-2 px-4 border-b text-left text-black">QC Date</th>
                                <th className="py-2 px-4 border-b text-left text-black">pH Level</th>
                                <th className="py-2 px-4 border-b text-left text-black">Moisture %</th>
                                <th className="py-2 px-4 border-b text-left text-black">Fragrance</th>
                                <th className="py-2 px-4 border-b text-left text-black">Color</th>
                                <th className="py-2 px-4 border-b text-left text-black">Conc. %</th>
                                <th className="py-2 px-4 border-b text-left text-black">Expiration</th> {/* Added */}
                                <th className="py-2 px-4 border-b text-center text-black">Status</th>
                                <th className="py-2 px-4 border-b text-center text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qcDataList.map((data) => (
                                <tr key={data._id} className="hover:bg-gray-50 border-b">
                                    <td className="py-2 px-4 text-black">{data.batchId}</td>
                                    <td className="py-2 px-4 text-black">{new Date(data.timestamp).toLocaleString()}</td> {/* QC submission date */}
                                    <td className="py-2 px-4 text-black">{data.pHLevel}</td>
                                    <td className="py-2 px-4 text-black">{data.moisture !== null ? data.moisture : '-'}</td>
                                    <td className="py-2 px-4 text-black">{data.fragranceRating !== null ? data.fragranceRating : '-'}</td>
                                    <td className="py-2 px-4 text-black">{data.colorRating !== null ? data.colorRating : '-'}</td>
                                    <td className="py-2 px-4 text-black">{data.concentration !== null ? data.concentration : '-'}</td>
                                    <td className="py-2 px-4 text-black"> {/* Expiration Date Column */}
                                        {data.expirationDate ? new Date(data.expirationDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className={`py-2 px-4 font-semibold text-center`}>
                                        {data.status === 'Good' && <span className="text-green-600">✅ Good</span>}
                                        {data.status === 'Acceptable' && <span className="text-yellow-600">🟡 Acceptable</span>}
                                        {data.status === 'Bad' && <span className="text-red-600">🔴 Bad</span>}
                                    </td>
                                    <td className="py-2 px-4 text-center whitespace-nowrap"> {/* Actions column */}
                                        <button
                                            onClick={() => handleViewIngredients(data.batchId, data.ingredients)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs mr-1"
                                            title="View Ingredients"
                                        >
                                            <CiRead className="inline-block align-middle " /> View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(data.batchId)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                                            title="Delete Entry"
                                        >
                                            <CiTrash className="inline-block align-middle" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {qcDataList.length === 0 && (
                                <tr>
                                    <td className="py-4 px-4 text-center text-gray-500" colSpan="10">No QC data available.</td> {/* Increased colspan */}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Ingredients Modal --- */}
            <IngredientsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                batchId={modalContent.batchId}
                ingredients={modalContent.ingredients}
            />
        </div>
    );
};

export default QualityControl;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiEyeOff, FiEye, FiLock, FiUnlock } from "react-icons/fi"; // Import icons
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro'; // IMPORT html2canvas-pro

// --- Define the required PIN ---
const REQUIRED_PIN = "#JJM2025";

const FinancialReportsTable = () => {
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isBlurred, setIsBlurred] = useState(true);
    const [showPinPrompt, setShowPinPrompt] = useState(false); // <-- State for PIN prompt visibility
    const [pinInput, setPinInput] = useState('');             // <-- State for PIN input value
    const [pinError, setPinError] = useState(null);           // <-- State for PIN error message

    const detailedViewRef = useRef(null);
    const reportContentRef = useRef(null);
    const pinInputRef = useRef(null); // Ref for focusing PIN input

    // Financial Report Fields (no changes)
    const financialFields = [ /* ... */ ];

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api'
        : 'http://localhost:7690/api';

    useEffect(() => {
        fetchReports();
    }, []);

     // Focus PIN input when prompt appears
     useEffect(() => {
        if (showPinPrompt && pinInputRef.current) {
            pinInputRef.current.focus();
        }
    }, [showPinPrompt]);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/finance-reports`);
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports from backend:", error);
            if (error.response) {
                setError(`Failed to load financial reports. Status: ${error.response.status}. ${error.response.data.error || ''} ${error.response.data.details || ''}`);
            } else {
                setError("Failed to load financial reports. Network error.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) {
            return '₱ 0.00';
        }
        return `₱${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const selectedReport = reports.find(report => report._id === selectedReportId);

    // Renamed/Modified: Triggered when user clicks 'View' in the list
    const handleRequestView = (reportId) => {
        setSelectedReportId(reportId); // Set the target report
        setIsBlurred(true);           // Ensure content starts blurred *after* PIN
        setPinInput('');              // Clear previous PIN input
        setPinError(null);            // Clear previous PIN error
        setShowPinPrompt(true);       // Show the PIN prompt
        console.log("Requesting view for report ID:", reportId);
    };

    // Handles closing the modal/detailed view AND the PIN prompt
    const handleCloseModal = () => {
        setSelectedReportId(null);
        setIsBlurred(true);
        setShowPinPrompt(false); // Hide PIN prompt
        setPinInput('');         // Clear PIN input
        setPinError(null);       // Clear PIN error
    };

    const handleToggleBlur = () => {
        setIsBlurred(prev => !prev);
    };

    // --- New Handler: Verify the entered PIN ---
    const handlePinSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        if (pinInput === REQUIRED_PIN) {
            setShowPinPrompt(false); // Hide prompt on success
            setPinError(null);       // Clear any error
            console.log("PIN Verified for report:", selectedReportId);
            // The detailed view will now render because showPinPrompt is false
        } else {
            setPinError("Incorrect PIN. Please try again."); // Set error message
            setPinInput(''); // Optionally clear input on error
            if (pinInputRef.current) pinInputRef.current.focus(); // Refocus input
        }
    };

    const exportToPDF = async () => {
        // Check for blur BEFORE checking PIN (already handled by disabling button)
        if (isBlurred) {
            alert("Please unblur the report content before exporting to PDF.");
            return;
        }
        // PIN check is implicitly done because this button is only active when !showPinPrompt

        // ... (rest of the exportToPDF function remains the same) ...
        const backBtn = document.querySelector('.back-button');
        const exportBtn = document.querySelector('.export-button');
        const toggleBtn = document.querySelector('.toggle-blur-button');

        if (backBtn) backBtn.style.visibility = 'hidden';
        if (exportBtn) exportBtn.style.visibility = 'hidden';
        if (toggleBtn) toggleBtn.style.visibility = 'hidden';

        const pdf = new jsPDF('p', 'mm', 'a4');
        const sections = [ /* ... section IDs ... */
             document.getElementById('report-header'),
            document.getElementById('narrative-report'),
            document.getElementById('balance-sheet'),
            document.getElementById('income-statement'),
            document.getElementById('cash-flow'),
        ];

        const captureSection = async (section) => {
             // ... (captureSection logic remains the same) ...
            if (!section) return;
            try {
                section.querySelectorAll('table').forEach(table => {
                   if (!table.style.backgroundColor) table.style.backgroundColor = 'white';
                });

                const canvas = await html2canvas(section, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                let imgWidth = 210; // A4 width in mm
                let pageHeight = pdf.internal.pageSize.getHeight();
                let imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 10; // Initial top margin

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= (pageHeight - position - 10);

                while (heightLeft > 0) {
                    position = -heightLeft + 10 ;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                 section.querySelectorAll('table').forEach(table => {
                   if (table.style.backgroundColor === 'white') table.style.backgroundColor = '';
                 });

            } catch (error) {
                console.error("Error capturing section:", section.id, error);
                 section.querySelectorAll('table').forEach(table => {
                    if (table.style.backgroundColor === 'white') table.style.backgroundColor = '';
                 });
            }
        };

        for (let i = 0; i < sections.length; i++) {
            if (i > 0 && sections[i-1]) {
                 pdf.addPage();
            }
            await captureSection(sections[i]);
        }

        pdf.save(`Financial_Report_${selectedReport?._id}.pdf`);

        if (backBtn) backBtn.style.visibility = 'visible';
        if (exportBtn) exportBtn.style.visibility = 'visible';
        if (toggleBtn) toggleBtn.style.visibility = 'visible';
    };


    return (
        <div className="min-h-screen py-6">
            <div className="max-w-6xl mx-auto p-4 font-sans">

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* --- Condition 1: Show List View --- */}
                {!selectedReportId && (
                    <>
                        <Link to="/home/DocumentStorage" className="mb-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none">
                            <IoMdArrowRoundBack /> Back
                        </Link>
                        <h1 className="text-2xl font-bold mb-6 text-center">Financial Reports</h1>
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="min-w-full bg-white">
                                {/* ... table thead ... */}
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">Report ID</th>
                                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">Created At</th>
                                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700"><Skeleton /></td>
                                                <td className="py-3 px-4 text-gray-700"><Skeleton width={100} /></td>
                                                <td className="py-3 px-4"><Skeleton width={80} /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        reports.map(report => (
                                            <tr key={report._id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{report._id}</td>
                                                <td className="py-3 px-4 text-gray-700">{formatDate(report.createdAt)}</td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleRequestView(report._id)} // <-- Use new handler
                                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {/* ... no reports row ... */}
                                     {reports.length === 0 && !loading && !error && (
                                        <tr>
                                            <td className="py-3 px-4 text-gray-700 text-center" colSpan="3">No reports available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                 {/* --- Condition 2: Show PIN Prompt --- */}
                 {selectedReportId && showPinPrompt && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Enter PIN to View Report</h2>
                            <p className="text-sm text-gray-500 mb-4 text-center">Report ID: {selectedReportId}</p>
                            <form onSubmit={handlePinSubmit}>
                                <div className="mb-4 relative">
                                     <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        ref={pinInputRef} // <-- Assign ref
                                        type="password" // Use password type to hide input
                                        value={pinInput}
                                        onChange={(e) => setPinInput(e.target.value)}
                                        className={`w-full px-10 py-2 border rounded-md ${pinError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Enter PIN"
                                        required
                                        autoComplete="off" // Prevent browser autocomplete
                                    />
                                </div>
                                {pinError && (
                                    <p className="text-red-500 text-sm mb-4 text-center">{pinError}</p>
                                )}
                                <div className="flex justify-between items-center">
                                     <button
                                        type="button" // Important: type="button" to prevent form submission
                                        onClick={handleCloseModal} // Go back to list
                                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center"
                                    >
                                        <IoMdArrowRoundBack className="mr-1"/> Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
                                    >
                                        <FiUnlock className="mr-1" /> Verify PIN
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- Condition 3: Show Detailed View (if PIN verified) --- */}
                {selectedReportId && !showPinPrompt && (
                     <div ref={detailedViewRef}>
                         {/* --- Control Buttons Section (Now visible only after PIN) --- */}
                        <div className="flex justify-between items-center mb-6">
                            {/* Back Button */}
                            <button
                                onClick={handleCloseModal} // Use handler
                                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded flex items-center back-button"
                            >
                                <IoMdArrowRoundBack className="mr-1"/> Back to List
                            </button>

                            {/* Right side buttons */}
                            <div className="flex items-center space-x-2">
                                {/* Toggle Blur Button */}
                                <button
                                    onClick={handleToggleBlur}
                                    className={`toggle-blur-button py-1 px-3 rounded flex items-center transition-colors duration-200 ${
                                        isBlurred ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                                    }`}
                                    title={isBlurred ? "Reveal Report Content" : "Hide Report Content"}
                                >
                                    {isBlurred ? <FiEyeOff className="mr-1" /> : <FiEye className="mr-1" />}
                                    {isBlurred ? 'Reveal' : 'Hide'}
                                </button>

                                {/* Export Button */}
                                <button
                                    className={`bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded export-button ${isBlurred ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={exportToPDF}
                                    disabled={isBlurred}
                                    title={isBlurred ? "Unblur the report to enable export" : "Export to PDF"}
                                >
                                    Export to PDF
                                </button>
                            </div>
                        </div>

                        {/* --- Report Content Area (Conditionally Blurred) --- */}
                        <div
                            ref={reportContentRef}
                            className={`transition-filter duration-300 ease-in-out ${
                                isBlurred ? 'filter blur-md pointer-events-none select-none' : 'filter-none'
                            }`}
                        >
                            {/* Header Section */}
                            <div id="report-header" className="mb-8">
                                 <div className="text-center mb-6">
                                    <h1 className="text-green-500 text-2xl font-bold">JJM</h1>
                                    <p className="text-gray-600 mb-1">Financial Report ID {selectedReport?._id}</p>
                                    <p className="text-gray-600 mb-1">Prepared by: Financial Management</p>
                                    <p className="text-gray-600">Date: {formatDate(selectedReport?.createdAt)}</p>
                                </div>
                            </div>

                            {/* Narrative Report Section */}
                             <div className="mb-8" id="narrative-report">
                                <h2 className="text-lg font-bold mb-2">Narrative Report</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    {selectedReport?.narrativeReport || "N/A"}
                                </p>
                            </div>

                             {/* Balance Sheet Section */}
                            <div className="mb-8" id="balance-sheet">
                                 <h2 className="text-center text-lg font-bold mb-4">BALANCE SHEET</h2>
                                <p className="text-center text-gray-600 mb-4">{formatDate(selectedReport?.createdAt)}</p>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border mt-4 bg-white">
                                        {/* ... Balance Sheet thead/tbody ... */}
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="border px-4 py-2 text-left">ASSETS</th>
                                                <th className="border px-4 py-2 text-left">LIABILITIES</th>
                                                <th className="border px-4 py-2 text-left">EQUITY</th>
                                            </tr>
                                        </thead>
                                         <tbody>
                                            <tr>
                                                <td className="border p-2">Cash = {formatCurrency(selectedReport?.beginningBalance ?? 0)}</td>
                                                <td className="border p-2">Accounts Payable = {formatCurrency(selectedReport?.accountsPayable ?? 0)}</td>
                                                <td className="border p-2">Owner's Equity = {formatCurrency(selectedReport?.ownersEquity?? 0)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Inventory (Unsold Product) = {formatCurrency(selectedReport?.inventory?? 0)}</td>
                                                <td className="border p-2">Total Liabilities = {formatCurrency(selectedReport?.totalLiabilities?? 0)}</td>
                                                <td className="border p-2"></td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Accounts Receivable = {formatCurrency(selectedReport?.accountsReceivable?? 0)}</td>
                                                <td className="border p-2"></td>
                                                <td className="border p-2"></td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Total Assets = {formatCurrency(selectedReport?.totalAssets?? 0)}</td>
                                                <td className="border p-2">Total Liabilities = {formatCurrency(selectedReport?.totalLiabilities?? 0)}</td>
                                                <td className="border p-2">Total Equity = {formatCurrency(selectedReport?.totalEquity?? 0)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2"></td>
                                                <td className="border p-2 font-bold" colSpan="2">Total Liabilities and Equity = {formatCurrency(selectedReport?.totalLiabilitiesAndEquity?? 0)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Income Statement Section */}
                            <div className="mb-8" id="income-statement">
                                <h2 className="text-center text-lg font-bold mb-4">INCOME STATEMENT</h2>
                                <p className="text-center text-gray-600 mb-4">{formatDate(selectedReport?.createdAt)}</p>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border mt-4 bg-white">
                                         {/* ... Income Statement thead/tbody ... */}
                                          <thead className="bg-gray-200">
                                            <tr>
                                                <th className="border px-4 py-2 text-left">REVENUE</th>
                                                <th className="border px-4 py-2 text-left">COST OF GOODS SOLD</th>
                                                <th className="border px-4 py-2 text-left">OPERATING EXPENSES</th>
                                                <th className="border px-4 py-2 text-left">NET PROFITS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border p-2">Sales Revenue = {formatCurrency(selectedReport?.totalRevenue)}</td>
                                                <td className="border p-2">Raw Materials = {formatCurrency(selectedReport?.rawMaterials)}</td>
                                                <td className="border p-2">Salaries and Wages= {formatCurrency(selectedReport?.salariesAndWages)}</td>
                                                <td className="border p-2">Gross Profit = {formatCurrency(selectedReport?.grossProfit)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2"></td>
                                                <td className="border p-2">Labor Costs = {formatCurrency(selectedReport?.laborCosts)}</td>
                                                <td className="border p-2">Utilities = {formatCurrency(selectedReport?.utilities)}</td>
                                                <td className="border p-2">Operating Expenses  = {formatCurrency(selectedReport?.totalOperatingExpenses)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2"></td>
                                                <td className="border p-2"></td>
                                                <td className="border p-2">Employee Expenses = {formatCurrency(selectedReport?.employeeExpenses)}</td>
                                                <td className="border p-2"></td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Total Revenue = {formatCurrency(selectedReport?.totalRevenue)}</td>
                                                <td className="border p-2">Total COGS = {formatCurrency(selectedReport?.totalCogs)}</td>
                                                <td className="border p-2">Total Operating Expenses = {formatCurrency(selectedReport?.totalOperatingExpenses)}</td>
                                                <td className="border p-2">Net Income = {formatCurrency(selectedReport?.netIncome)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cash Flow Section */}
                            <div className="mb-8" id="cash-flow">
                                 <h2 className="text-center text-lg font-bold mb-4">CASH FLOW</h2>
                                <p className="text-center text-gray-600 mb-4">{formatDate(selectedReport?.createdAt)}</p>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border mt-4 bg-white">
                                         {/* ... Cash Flow thead/tbody ... */}
                                          <thead className="bg-gray-200">
                                            <tr>
                                                <th className="border px-4 py-2 text-left">CASH INFLOWS</th>
                                                <th className="border px-4 py-2 text-left">CASH OUTFLOWS (Operating Activities)</th>
                                                <th className="border px-4 py-2 text-left">CASH OUTFLOWS (Investing Activities)</th>
                                                <th className="border p-2 text-left">TOTAL CASH FLOW</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border p-2">Customer Payments = {formatCurrency(selectedReport?.customerPayments)}</td>
                                                <td className="border p-2">Payments to Supplier = {formatCurrency(selectedReport?.paymentToSupplier)}</td>
                                                <td className="border p-2">Purchase of New Equipment = {formatCurrency(selectedReport?.purchaseOfNewEquipments)}</td>
                                                <td className="border p-2">Net Cash Flow = {formatCurrency(selectedReport?.netCashFlow)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Sale of Old Equipment = {formatCurrency(selectedReport?.saleOfOldEquipment)}</td>
                                                <td className="border p-2">Salaries and Wages= {formatCurrency(selectedReport?.salariesAndWages)}</td>
                                                <td className="border p-2">Utilities = {formatCurrency(selectedReport?.utilities)}</td>
                                                <td className="border p-2">Beginning Balance = {formatCurrency(selectedReport?.beginningBalance)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Total Inflows = {formatCurrency(selectedReport?.totalInflows)}</td>
                                                <td className="border p-2">Total Outflows = {formatCurrency(selectedReport?.totalOutflowsO)}</td>
                                                <td className="border p-2">Total Outflows = {formatCurrency(selectedReport?.totalOutflowsI)}</td>
                                                <td className="border p-2">Ending Balance = {formatCurrency(selectedReport?.endingBalance)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> {/* End of blurred content div */}
                    </div> // End of detailed view container
                )}
            </div>
        </div>
    );
};

export default FinancialReportsTable;
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

const FinancialReportsTable = () => {
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reports, setReports] = useState([]); // Remove dummy data, start with empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Financial Report Fields - for structure and detailed view (no changes needed here)
    const financialFields = [
        "totalRevenue",
        "rawMaterials",
        "laborCosts",
        "totalCogs",
        "salariesWages",
        "utilities",
        "employeeExpenses",
        "totalOperatingExpenses",
        "grossProfit",
        "operatingIncome",
        "netIncome",
        "customerPayments",
        "saleOfOldEquipment",
        "totalInFlows",
        "paymentToSupplier",
        "salariesAndWages",
        "totalOutflowsO",
        "purchaseOfNewEquipments",
        "totalOutflowsI",
        "netCashFlow",
        "beginningBalance",
        "endingBalance",
        "narrativeReport",
        "createdAt",
        "updatedAt",
    ];

    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api' 
        : 'http://localhost:7690/api'; 
    console.log("API_BASE_URL:", API_BASE_URL);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/financial-reports`);
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setError("Failed to load financial reports.");
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

    // Format date (no changes needed here)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Get selected report
    const selectedReport = reports.find(report => report._id === selectedReportId);

    console.log("selectedReportId before render:", selectedReportId);
    console.log("selectedReport before render:", selectedReport);

    const handleViewDetails = (reportId) => {
        setSelectedReportId(reportId);
        // No need to set isModalOpen here, as it's not used in this version
    };

    const handleCloseModal = () => {
        setSelectedReportId(null);
        // No need to set isModalOpen here, as it's not used in this version
    };


    return (
        <div className="min-h-screen py-6">
            <div className="max-w-6xl mx-auto p-4 font-sans">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {!selectedReportId ? (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-center">Financial Reports</h1>
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">Report ID</th>
                                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">Created At</th>
                                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="3" className="py-3 px-4 text-center">Loading reports...</td></tr>
                                    ) : (
                                        reports.map(report => (
                                            <tr key={report._id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{report._id}</td>
                                                <td className="py-3 px-4 text-gray-700">{formatDate(report.createdAt)}</td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => {
                                                            console.log("View button clicked, report ID:", report._id);
                                                            setSelectedReportId(report._id);
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {reports.length === 0 && !loading && !error && (
                                        <tr>
                                            <td className="py-3 px-4 text-gray-700 text-center" colSpan="3">No reports available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {console.log("rendering detailed view, selectedReport:", selectedReport)}
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => setSelectedReportId(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
                            >
                                Back to List
                            </button>
                            <h1 className="text-green-500 text-2xl font-bold">JJM</h1>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded"
                            >
                                Export to PDF
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-1">Financial Report ID {selectedReport?._id}</p>
                            <p className="text-gray-600 mb-1">Prepared by: Financial Management</p>
                            <p className="text-gray-600">Date: {formatDate(selectedReport?.createdAt)}</p>
                        </div>

                        {/* Narrative Report */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold mb-2">Narrative Report</h2>
                            <p className="text-sm text-gray-700 mb-4">
                                {selectedReport?.narrativeReport}
                            </p>
                        </div>

                        {/* Balance Sheet */}
                        <div className="mb-8">
                            <h2 className="text-center text-lg font-bold mb-4">BALANCE SHEET</h2>
                            <p className="text-center text-gray-600 mb-4">{formatDate(selectedReport?.createdAt)}</p>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border mt-4">
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

                        {/* Income Statement */}
                        <div className="mb-8">
                            <h2 className="text-center text-lg font-bold mb-4">INCOME STATEMENT</h2>
                            <p className="text-center text-gray-600 mb-4">{formatDate(selectedReport?.createdAt)}</p>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border mt-4">
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


                        {/* Cash Flow */}
                        <div className="mb-8">
                            <h2 className="text-center text-lg font-bold mb-4">CASH FLOW</h2>
                            <p className="text-center text-gray-600 mb-4">{formatDate(selectedReport?.createdAt)}</p>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border mt-4">
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
                                            {/* <td className="border p-2">Utilities = {formatCurrency(selectedReport?.utilities / 2)}</td> */}
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


                    </>
                )}
            </div>
        </div>
    );
};

export default FinancialReportsTable;



import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoSearchSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';

const AuditReport = () => {
    const [auditReports, setAuditReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

// Dynamic API URL (same as in Hr3Documents)
    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api' // Base URL of your backend in production
        : 'http://localhost:7690/api'; // Base URL of your backend in development


    useEffect(() => {
        const fetchAuditReports = async () => {
            setLoading(true);
            setError(null);
            try {
                // **CHANGED LINE:** Fetch from your backend's proxy endpoint
                const response = await axios.get(`${API_BASE_URL}/audit-reports-admin`); // CORRECTED LINE in AuditReport.js
                // No direct fetch to backend-core2 anymore

                if (!response.data) { // Check if response.data exists (important for axios)
                    throw new Error('No data received from backend'); // More descriptive error
                }

                setAuditReports(response.data); // Backend now returns the audit reports directly
            } catch (e) {
                setError(e);
                console.error("Error fetching audit reports from backend:", e); // Log error for debugging
            } finally {
                setLoading(false);
            }
        };

        fetchAuditReports();
    }, []);

    const handleViewClick = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const openPreviewModal = (imageSrc) => {
        setPreviewImage(imageSrc);
        setIsPreviewModalOpen(true);
    };

    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewImage(null);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < Math.ceil(auditReports.length / reportsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredReports = auditReports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        return (
            report.department.toLowerCase().includes(searchLower) ||
            report.description.toLowerCase().includes(searchLower)
        );
    });

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen py-6">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Audit Reports</h1>
                        <Skeleton width={200} height={30} />
                    </div>
                    <div className="py-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Completed At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[...Array(reportsPerPage)].map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Skeleton height={20} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Skeleton height={20} width={150} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Skeleton height={20} width={80} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Skeleton height={20} width={60} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Skeleton height={20} width={50} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen py-6"><div className="text-center py-8 text-red-500">Error fetching audit reports: {error.message}</div></div>;
    }

    return (
        <div className="min-h-screen py-6">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Audit Reports</h1>
                    <div className="flex items-center space-x-4"> {/* Flex container for button and search */}
                        <Link to="/home/RequestAudit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Request Audit
                        </Link>
                        <div className="relative w-full sm:w-64">
                            <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search department or description"
                                className="pl-8 pr-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border block w-full sm:text-sm  rounded-md"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="py-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completed At
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentReports.map((report, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.completedAt ? new Date(report.completedAt).toLocaleDateString() : 'Pending'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.completedAt ? 'Completed' : 'Pending'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewClick(report)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage <= 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage >= totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstReport + 1}</span> to <span className="font-medium">{indexOfLastReport > filteredReports.length ? filteredReports.length : indexOfLastReport}</span> of{' '}
                                    <span className="font-medium">{filteredReports.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage <= 1}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <span  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:z-20">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage >= totalPages}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Report Details Modal */}
                {isModalOpen && selectedReport && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                        Audit Report Details
                                    </h3>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">Department: <span className="font-semibold">{selectedReport.department}</span></p>
                                        <p className="text-sm text-gray-500 mb-2">Description: <span className="font-semibold">{selectedReport.description}</span></p>

                                        <div>
                                            <p className="text-sm text-gray-700 font-semibold mb-1">Responses:</p>
                                            {selectedReport.responses.length > 0 ? (
                                                <ul className="space-y-4">
                                                    {selectedReport.responses.map((response, index) => (
                                                        <li key={index} className="border p-4 rounded-md">
                                                            <p className="text-sm text-gray-700"><span className="font-semibold">Task:</span> {response.task}</p>
                                                            <p className="text-sm text-gray-700"><span className="font-semibold">Text:</span> {response.text}</p>
                                                            {response.image && (
                                                                <>
                                                                    <p className="text-sm text-gray-700 mt-2"><span className="font-semibold">Response Image:</span></p>
                                                                    <button onClick={() => openPreviewModal(response.image)} className="cursor-pointer">
                                                                        <img src={response.image} alt="Response Image" className="mt-1 max-h-40 rounded-md" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <p className="text-xs text-gray-500 mt-2"><span className="font-semibold">Created At:</span> {new Date(response.createdAt).toLocaleString()}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500">No responses yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Preview Modal */}
                {isPreviewModalOpen && previewImage && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="image-preview-modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closePreviewModal}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="image-preview-modal-title">
                                                Response Image Preview
                                            </h3>
                                            <div className="mt-2">
                                                <img src={previewImage} alt="Full Size Response Image" className="max-w-full max-h-[70vh] mx-auto block rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closePreviewModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditReport;
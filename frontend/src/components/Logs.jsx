// src/components/Logs.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Logs = () => {
    const [loginLogs, setLoginLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5; // Number of logs per page
    const [totalPages, setTotalPages] = useState(1); // State to hold total pages

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

    useEffect(() => {
        const fetchLoginLogs = async () => {
            try {
                const response = await axios.get(`${baseURL}/login-logs/get`);
                setLoginLogs(response.data);
                setTotalPages(Math.ceil(response.data.length / logsPerPage)); // Calculate total pages
            } catch (error) {
                console.error("Error fetching login logs:", error);
                // Handle error appropriately
            }
        };

        fetchLoginLogs();
    }, [logsPerPage]); // Added logsPerPage to dependency array in case you want to make it dynamic later

    // Get current logs for the current page
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = loginLogs.slice(indexOfFirstLog, indexOfLastLog);

    // Change page handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
      <div className="min-h-screen py-6">  
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Login Logs</h2>
            {loginLogs.length > 0 ? (
                <>
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">Username</th>
                                    <th className="border border-gray-300 p-2 text-left">Email</th>
                                    <th className="border border-gray-300 p-2 text-left">Login Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLogs.map((log) => (
                                    <tr key={log._id}>
                                        <td className="border border-gray-300 p-2">{log.userName}</td>
                                        <td className="border border-gray-300 p-2">{log.email}</td>
                                        <td className="border border-gray-300 p-2">
                                            {new Date(log.loginTime).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center space-x-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No login logs found.</p>
            )}
        </div>
      </div>  
    );
};

export default Logs;
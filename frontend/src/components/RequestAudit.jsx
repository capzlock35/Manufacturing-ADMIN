import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import axios from 'axios'; // Import axios

const RequestAudit = () => {
    const [department, setDepartment] = useState('');
    const [description, setDescription] = useState('');
    const [taskInput, setTaskInput] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null);

    // Dynamic API URL (same as in AuditReport)
    const API_BASE_URL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api' // Base URL of your backend in production
        : 'http://localhost:7690/api'; // Base URL of your backend in development


    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionStatus(null);

        const tasksArray = taskInput.split('\n').map(task => task.trim()).filter(task => task !== '');

        const auditRequestData = {
            department: department,
            description: description,
            task: tasksArray,
        };

        try {
            // Use axios.post to your backend's proxy endpoint
            const response = await axios.post(`${API_BASE_URL}/request-audit-admin`, auditRequestData);

            if (response.status === 200 || response.status === 201) { // Check for successful response status
                setSubmissionStatus('success');
                setDepartment('');
                setDescription('');
                setTaskInput('');
            } else {
                const errorData = response.data; // axios automatically parses JSON
                console.error('Submission error:', errorData);
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setSubmissionStatus('error');
        }
    };

    return (
        <div className="min-h-screen py-12 bg-gray-100 flex justify-center items-center">
            <div className="container mx-auto px-6 sm:px-8 max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="mb-6 flex justify-start"> {/* Container for back button above header */}
                    <Link to="/home/AuditReport" className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm">
                        <IoArrowBack className="mr-2" /> {/* Back Icon */}
                        Back
                    </Link>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-8 px-6 sm:px-10">
                    <h1 className="text-3xl font-bold text-white text-center">Request Audit</h1>
                    <p className="mt-2 text-md text-indigo-100 text-center">Submit your audit request below</p>
                </div>
                <div className="bg-white p-6 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                                Department
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="department"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter department name"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="description"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Brief description of audit"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="taskInput" className="block text-sm font-semibold text-gray-700 mb-2">
                                Tasks (one per line)
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="taskInput"
                                    rows="4"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="List audit tasks, each on a new line"
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {/* You can add an icon here if you want */}
                                </span>
                                Request Audit
                            </button>
                        </div>
                    </form>

                    {submissionStatus === 'success' && (
                        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md font-semibold text-center">
                            Audit request submitted successfully!
                        </div>
                    )}

                    {submissionStatus === 'error' && (
                        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md font-semibold text-center">
                            Error submitting audit request. Please try again.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestAudit;
// src/components/InactiveFinanceList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx';
import { CiExport } from "react-icons/ci";
import Skeleton from 'react-loading-skeleton';

const InactiveFinanceList = () => {
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/finance'
        : 'http://localhost:7690/api/finance';

    const authURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
        : 'http://localhost:7690/api/auth/get-token';

    const fetchInactiveUsers = async () => {
        setIsLoading(true);
        try {
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;

            if (!token) {
                console.error("🚨 No token received from backend!");
                return;
            }

            const response = await axios.get(`${baseURL}/inactive`, { // Fetch inactive users
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInactiveUsers(response.data);
        } catch (error) {
            console.error("Error fetching inactive finance users:", error);
            toast.error("Failed to load inactive finance users.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInactiveUsers();
    }, []);

    const handleView = (user) => {
        setSelectedUser(user);
        setModalType('view');
        setIsModalOpen(true);
    };

    const handleUndoRemove = (user) => {
        setSelectedUser(user);
        setModalType('undo');
        setIsModalOpen(true);
    };

    const handleUndoFinanceUser = async (userId) => {
        try {
            const response = await axios.patch(`${baseURL}/undo/${userId}`);
            if (response.status === 200) {
                toast.success('Finance user removal undone (set to active) successfully!');
                setInactiveUsers(inactiveUsers.filter(user => user._id !== userId)); // Optimistically remove from inactive list
                handleCloseModal();
                fetchInactiveUsers(); // Refresh inactive list, or consider refetching active list in FinanceList as well for immediate update.
            }
        } catch (error) {
            console.error('Failed to undo finance user removal:', error);
            toast.error('An error occurred while trying to undo the finance user removal.');
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setModalType('');
    };

    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(inactiveUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "inactive_finance_users.xlsx");
    };

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentInactiveUsers = inactiveUsers.slice(indexOfFirstUser, indexOfLastUser);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => setCurrentPage(currentPage - 1);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const totalPages = Math.ceil(inactiveUsers.length / usersPerPage);


    const Modal = ({ user, type, onClose, onUndoRemove }) => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed z-50 top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold text-black mb-4">
                        {type === 'view' ? 'View User' : type === 'undo' ? 'Undo Remove User' : ''}
                    </h2>

                    {type === 'view' && (
                        <div>
                            <p>Username: {user.userName}</p>
                            <p>Email: {user.email}</p>
                            <p>Full Name: {user.fullName}</p>
                            <p>Role: {user.role}</p>
                            <img src={user.image.secure_url} alt={user.userName} className="w-32 h-32 object-cover rounded-full mt-4" />
                        </div>
                    )}

                    {type === 'undo' && (
                        <div>
                            <p>Are you sure you want to undo removal for user {user.userName}?</p>
                            <p className="text-sm text-gray-500">This will set the user back to active.</p>
                            <div className="flex justify-end mt-4">
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => {
                                    onUndoRemove(user._id);
                                    handleCloseModal();
                                }}>
                                    Yes, Undo
                                </button>
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        {(type === 'view' || type === 'undo') && (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="p-4 h-screen bg-gray-200">
            <div className="container mx-auto p-4">
                {/* Back Button */}
                <div className="mb-4">
                    <Link to="/home/FinanceList">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
                            <IoMdArrowRoundBack /> Back to Active Finance
                        </button>
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-black">Inactive Finance Department</h1>
                <button onClick={handleExportToExcel} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
                    <CiExport />
                </button>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left border">Image</th>
                            <th className="py-3 px-6 text-left border">Username</th>
                            <th className="py-3 px-6 text-left border">Email</th>
                            <th className="py-3 px-6 text-left border">Role</th>
                            <th className="py-3 px-6 text-center border">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light border">
                        {isLoading ? (
                            Array(usersPerPage).fill(0).map((_, index) => (
                                <tr key={index}>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">
                                        <Skeleton circle={true} height={64} width={64} />
                                    </td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                    <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={100} /></td>
                                </tr>
                            ))
                        ) : (
                            currentInactiveUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">
                                        <img src={user.image.secure_url} alt={user.userName} className="w-16 h-16 object-cover rounded-full" />
                                    </td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.userName}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                    <td className="py-3 px-6 text-center flex justify-center">
                                        <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-xs">View</button>
                                        <button onClick={() => handleUndoRemove(user)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Undo</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${currentPage === pageNumber ? 'bg-blue-500 text-white hover:bg-blue-700' : ''}`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <Modal
                user={selectedUser}
                type={modalType}
                onClose={handleCloseModal}
                onUndoRemove={handleUndoFinanceUser}
            />
        </div>
    );
};

export default InactiveFinanceList;
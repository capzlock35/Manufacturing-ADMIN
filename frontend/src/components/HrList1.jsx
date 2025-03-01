import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx';
import { CiExport } from "react-icons/ci";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HrList1 = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editFormData, setEditFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/hrusers'
        : 'http://localhost:7690/api/hrusers';

    const authURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
        : 'http://localhost:7690/api/auth/get-token';

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Get token using dynamic authURL
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;

            if (!token) {
                console.error("🚨 No token received from backend!");
                return;
            }

            // Fetch HR users with authentication
            const response = await axios.get(`${baseURL}/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ HR Users Response:", response.data);
            setUsers(response.data);
        } catch (err) {
            console.error("❌ Error fetching HR users:", err.response ? err.response.data : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    const handleView = (user) => {
        setSelectedUser(user);
        setModalType('view');
        setIsModalOpen(true);
    };

    const handleUpdate = (user) => {
        setSelectedUser(user);
        setModalType('update');
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            Hr: user.Hr,
            position: user.position // Initialize position in edit form data <---- ADDED POSITION HERE
        });
        setIsModalOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setModalType('delete');
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;

            const response = await axios.delete(`${baseURL}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success('User deleted successfully!');
                setUsers(users.filter(user => user._id !== userId));
            } else {
                console.error('Failed to delete user:', response);
                toast.error('Failed to delete user.');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error('An error occurred while trying to delete the user.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setModalType('');
        setEditFormData({});
    };

    const handleEditFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateUser = async (e) => {
        try {
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;

            const response = await axios.put(`${baseURL}/${selectedUser._id}`, editFormData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success('User updated successfully!');
                console.log("Response Data:", response.data);

                setUsers(users.map(user => user._id === selectedUser._id ? response.data.user : user));
                handleCloseModal();
            } else {
                console.error('Failed to update user:', response);
                toast.error('Failed to update user.');
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            toast.error('An error occurred while trying to update the user.');
        }
    };

    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(users);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "Hr_users.xlsx");
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => setCurrentPage(currentPage - 1);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const totalPages = Math.ceil(users.length / usersPerPage);


    const Modal = ({ user, type, onClose, onDelete, onUpdate }) => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed z-50 top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold text-black mb-4">{type === 'view' ? 'View User' : type === 'update' ? 'Update User' : 'Delete User'}</h2>

                    {type === 'view' && (
                        <div>
                            <p>Email: {user.email}</p>
                            <p>First Name: {user.firstName}</p>
                            <p>Last Name: {user.lastName}</p>
                            <p>Role: {user.role}</p>
                            <p>HR Level: {user.Hr}</p>
                            <p>Position: {user.position}</p> {/* Display Position in View Modal <---- ADDED POSITION HERE */}
                        </div>
                    )}

                    {type === 'update' && (
                        <div>
                            {/* Update Form */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editfirstName">firstName</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editfirstName"
                                    type="text"
                                    name="firstName"
                                    value={editFormData.firstName || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editEmail">lastName</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editlastName"
                                    type="text"
                                    name="lastName"
                                    value={editFormData.lastName || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editFullName">Email</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editEmail"
                                    type="email"
                                    name="email"
                                    value={editFormData.email || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editRole">Role</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editRole"
                                    type="text"
                                    name="role"
                                    value={editFormData.role || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            {/*HR Level Edit Form */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editHr">HR Level</label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editHr"
                                    name="Hr"
                                    value={editFormData.Hr || ''}
                                    onChange={handleEditFormChange}
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                </select>
                            </div>

                            {/* Position Edit Form <---- ADDED POSITION HERE */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editPosition">Position</label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editPosition"
                                    name="position"
                                    value={editFormData.position || ''}
                                    onChange={handleEditFormChange}
                                >
                                    <option value="CEO">CEO</option>
                                    <option value="Secretary">Secretary</option>
                                    <option value="Production Head">Production Head</option>
                                    <option value="Resellers Sales Head">Resellers Sales Head</option>
                                    <option value="Resellers">Resellers</option>
                                </select>
                            </div>

                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={onUpdate}>
                                Update User
                            </button>
                        </div>
                    )}

                    {type === 'delete' && (
                        <div>
                            <p>Are you sure you want to delete user {user.firstName}?</p>
                            <div className="flex justify-end mt-4">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => {
                                    onDelete(user._id);
                                    onClose();
                                }}>
                                    Yes, Delete
                                </button>
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        {type !== 'delete' && (
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
                <Link to="/home/accountlist">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
                        <IoMdArrowRoundBack />
                    </button>
                </Link>

                <h1 className="text-2xl font-bold mb-4 text-black">HR Department</h1>
                <button onClick={handleExportToExcel} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
                    <CiExport />
                </button>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left border">First Name</th>
                            <th className="py-3 px-6 text-left border">Last Name</th>
                            <th className="py-3 px-6 text-left border">Email</th>
                            <th className="py-3 px-6 text-left border">Role</th>
                            <th className="py-3 px-6 text-left border">HR Level</th>
                            <th className="py-3 px-6 text-left border">Position</th> {/* Position Header <---- ADDED POSITION HEADER */}
                            <th className="py-3 px-6 text-center border">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light border">
                        {isLoading ? (
                            Array(usersPerPage).fill(0).map((_, index) => (
                                <tr key={index}>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={60} /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={50} /></td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={80} /></td> {/* Skeleton for Position <---- ADDED POSITION SKELETON */}
                                    <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={80} /></td>
                                </tr>
                            ))
                        ) : (
                            currentUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.firstName}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.lastName}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.Hr}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.position}</td>{/* Display Position in Table <---- ADDED POSITION DATA */}
                                    <td className="py-3 px-6 text-center flex">
                                        <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                                        <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                                        <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
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

            {/* Integrated Modal */}
            <Modal
                user={selectedUser}
                type={modalType}
                onClose={handleCloseModal}
                onDelete={handleDeleteUser}
                onUpdate={handleUpdateUser}
            />
        </div>
    );
};

export default HrList1;
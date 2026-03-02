// src/components/AdminList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx';
import { CiExport } from "react-icons/ci";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editFormData, setEditFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState(null); // State to store user role

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

    const authURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
        : 'http://localhost:7690/api/auth/get-token';

    // Fetches *active* admin users (endpoint updated)
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;

            if (!token) {
                console.error("🚨 No token received from backend!");
                return;
            }

            // --- MODIFIED: Fetch only active users using the /users endpoint ---
            const response = await axios.get(`${baseURL}/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Backend Response (Active Admins):", response.data);
            setUsers(response.data);
        } catch (err) {
            console.error("❌ Error fetching active users:", err.response ? err.response.data : err.message);
            toast.error("Failed to load active admin users.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
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
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
             // Format birthday to YYYY-MM-DD for the date input
            birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
            gender: user.gender,
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setModalType('delete');
        setIsModalOpen(true);
    };

     // --- NEW: Handler to initiate the "Remove" action ---
     const handleRemove = (user) => {
         setSelectedUser(user);
         setModalType('remove'); // New modal type for Remove
         setIsModalOpen(true);
     };

    // --- NEW: Function to call the backend soft delete endpoint ---
     const handleRemoveAdminUser = async (userId) => {
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) {
                 console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed.");
                 return;
             }

             const response = await axios.patch(`${baseURL}/remove/${userId}`, {}, { // Call the /remove endpoint
                 headers: {
                     Authorization: `Bearer ${token}`,
                 },
             });
             if (response.status === 200) {
                 toast.success('Admin user removed (set to inactive) successfully!');
                 // Remove the user from the current active list state
                 setUsers(users.filter(user => user._id !== userId));
                 handleCloseModal();
             } else {
                  toast.error(response.data.message || 'Failed to remove user.');
             }
         } catch (error) {
             console.error('Failed to remove admin user:', error.response ? error.response.data : error.message);
             toast.error(error.response?.data?.message || 'An error occurred while trying to remove the user.');
         }
     };


    const handleDeleteUser = async (userId) => {
        try {
            console.log('Delete user with ID:', userId);
            console.log('Base URL:', baseURL);

             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) {
                 console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed.");
                 return;
             }

            const response = await axios.delete(`${baseURL}/delete/${userId}`, {
                 headers: {
                     Authorization: `Bearer ${token}`,
                 },
            });
            console.log('Response status:', response.status);
            if (response.status === 200) {
                toast.success('User deleted successfully!');
                setUsers(users.filter(user => user._id !== userId));
                handleCloseModal();
            } else {
                 toast.error(response.data.message || 'Failed to delete user permanently.');
            }
        } catch (error) {
            console.error('Failed to delete user:', error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'An error occurred while trying to delete the user.');
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

    const handleUpdateUser = async () => {
        try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) {
                 console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed.");
                 return;
             }

            const response = await axios.put(`${baseURL}/update/${selectedUser._id}`, editFormData, {
                 headers: {
                     Authorization: `Bearer ${token}`,
                 },
            });
            if (response.status === 200) {
                toast.success('User updated successfully!');
                // Update the user in the local state
                setUsers(users.map(user => user._id === selectedUser._id ? response.data.user : user));
                handleCloseModal();
            } else {
                 // Handle potential errors from backend validation (e.g., username/email exists)
                 toast.error(response.data.message || 'Failed to update user.');
            }
        } catch (error) {
            console.error('Failed to update user:', error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'An error occurred while trying to update the user.');
        }
    };

    const calculateAge = (birthday) => {
        if (!birthday) return '';
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleExportToExcel = () => {
        const usersForExcel = users.map(user => ({
           Image: user.image?.secure_url || '',
           Username: user.userName,
           FirstName: user.firstName,
           LastName: user.lastName,
           Email: user.email,
           Role: user.role,
           Birthday: user.birthday ? new Date(user.birthday).toLocaleDateString() : '', // Format date for excel
           Gender: user.gender,
           Age: calculateAge(user.birthday),
           Status: user.status // Include status
       }));
        const ws = XLSX.utils.json_to_sheet(usersForExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Active Admin Users");
        XLSX.writeFile(wb, "Active_Admin_users.xlsx");
    };

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => setCurrentPage(currentPage - 1);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const totalPages = Math.ceil(users.length / usersPerPage);


     // Integrated Modal Component (Updated to handle 'remove' type)
    const Modal = ({ user, type, onClose, onDelete, onRemoveAdmin }) => {
        if (!isModalOpen || !user) return null; // Ensure modal is open and user is not null

        return (
            <div className="fixed z-50 top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold text-black mb-4">
                        {type === 'view' ? 'View User' :
                            type === 'update' ? 'Update User' :
                                type === 'delete' ? 'Delete User' :
                                    type === 'remove' ? 'Remove User' : ''}
                    </h2>

                    {type === 'view' && (
                        <div>
                            <p>Username: {user.userName}</p>
                            <p>Email: {user.email}</p>
                            <p>First Name: {user.firstName}</p>
                            <p>Last Name: {user.lastName}</p>
                             <p>Birthday: {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'N/A'}</p> {/* Formatted */}
                            <p>Gender: {user.gender}</p>
                            <p>Role: {user.role}</p>
                             <p>Status: {user.status}</p> {/* Display Status */}
                            {user.image?.secure_url && ( // Added optional chaining
                                <img src={user.image.secure_url} alt={user.userName} className="w-32 h-32 object-cover rounded-full mt-4" />
                            )}
                        </div>
                    )}

                    {type === 'update' && (
                        <div>
                            {/* Update Form */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editUserName">Username</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editUserName"
                                    type="text"
                                    name="userName"
                                    value={editFormData.userName || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editEmail">Email</label>
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editFirstName">First Name</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editFirstName"
                                    type="text"
                                    name="firstName"
                                    value={editFormData.firstName || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editLastName">Last Name</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editLastName"
                                    type="text"
                                    name="lastName"
                                    value={editFormData.lastName || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editBirthday">Birthday</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editBirthday"
                                    type="date"
                                    name="birthday"
                                    value={editFormData.birthday || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editGender">Gender</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editGender"
                                    type="text" // Consider making this a select or radio
                                    name="gender"
                                    value={editFormData.gender || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editRole">Role</label>
                                 {/* Consider making this a select dropdown with allowed roles */}
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                    id="editRole"
                                    type="text"
                                    name="role"
                                    value={editFormData.role || ''}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateUser}>
                                Update User
                            </button>
                        </div>
                    )}

                    {type === 'delete' && (
                        <div>
                            <p>Are you sure you want to permanently delete user {user.userName}?</p>
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
                     {/* --- NEW: Modal content for Remove action --- */}
                    {type === 'remove' && (
                        <div>
                            <p>Are you sure you want to remove user {user.userName}?</p>
                            <p className="text-sm text-gray-500">Removing will set the user to inactive.</p>
                            <div className="flex justify-end mt-4">
                                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => {
                                    onRemoveAdmin(user._id); // Call the remove admin function
                                    handleCloseModal();
                                }}>
                                    Yes, Remove
                                </button>
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}


                    <div className="flex justify-end mt-4">
                         {/* --- MODIFIED: Conditionally show close button --- */}
                        {type !== 'delete' && type !== 'remove' && (
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
                {/* --- MODIFIED: Back Button and Link to Inactive List --- */}
                <div className="flex justify-between items-center mb-4">
                    <Link to="/home/accountlist">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
                            <IoMdArrowRoundBack />
                        </button>
                    </Link>
                     <Link to="/home/InactiveAdminList"> {/* Link to the Inactive Admin List */}
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow">
                            View Inactive Accounts
                        </button>
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-black">Admin Accounts</h1> {/* Updated Title */}
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
                                     <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={180} /></td> {/* Adjusted width for 4 buttons */}
                                 </tr>
                             ))
                         ) : (
                            currentUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">
                                        {user.image?.secure_url && ( // Added optional chaining
                                             <img src={user.image.secure_url} alt={user.userName} className="w-16 h-16 object-cover rounded-full" />
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.userName}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                    <td className="py-3 px-6 text-center flex justify-center items-center">
                                        <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-xs">View</button>
                                        {role === 'superadmin' && ( // Conditional rendering for superadmin actions
                                            <>
                                                <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-2 py-1 rounded mr-1 text-xs">Update</button>
                                                 {/* Prevent superadmin from removing themselves or other superadmins */}
                                                 {user.role !== 'superadmin' && (
                                                    <button onClick={() => handleRemove(user)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-1 text-xs">Remove</button>
                                                 )}
                                                {/* Prevent superadmin from deleting themselves or other superadmins */}
                                                {/* {user.role !== 'superadmin' && (
                                                    <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                                                )} */}
                                            </>
                                        )}
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
                onRemoveAdmin={handleRemoveAdminUser} // Pass the new remove function
            />
        </div>
    );
};

export default AdminList;
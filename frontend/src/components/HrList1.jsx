// src/components/HrList1.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx';
import { CiExport } from "react-icons/ci";

const HrList1 = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editFormData, setEditFormData] = useState({}); // State for edit form data

    const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/hrusers'
    : 'http://localhost:7690/api/hrusers';
  
  const authURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
    : 'http://localhost:7690/api/auth/get-token';
  
  const fetchUsers = async () => {
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
          Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
        },
      });
  
      console.log("✅ HR Users Response:", response.data);
      setUsers(response.data);
    } catch (err) {
      console.error("❌ Error fetching HR users:", err.response ? err.response.data : err.message);
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
        setEditFormData({  // Initialize form data with the user's current values
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
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
          console.log('Delete user with ID:', userId);  // Add this line
          console.log('Base URL:', baseURL); // Add this line
          const response = await axios.delete(`${baseURL}/${userId}`);
          console.log('Response status:', response.status);
          if (response.status === 200) {
              toast.success('User deleted successfully!');
              setUsers(users.filter(user => user._id !== userId));
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
        setEditFormData({}); // Clear edit form data
    };

    const handleEditFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(`${baseURL}/update/${selectedUser._id}`, editFormData);
            if (response.status === 200) {
                toast.success('User updated successfully!');
                // Update the user in the local state
                setUsers(users.map(user => user._id === selectedUser._id ? response.data.user : user));
                handleCloseModal();
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

    // Integrated Modal Component
    const Modal = ({ user, type, onClose, onDelete }) => {
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
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateUser}>
                                Update User
                            </button>
                        </div>
                    )}

                    {type === 'delete' && (
                        <div>
                        <p>Are you sure you want to delete user {user.firstName}?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => {
                                handleDeleteUser(user._id);
                                handleCloseModal();
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
                <Link to="/home/accountlist"> {/* Adjust the link as needed */}
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
                            <th className="py-3 px-6 text-center border">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light border">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="py-3 px-6 text-left border-b border-gray-200">{user.firstName}</td>
                                <td className="py-3 px-6 text-left border-b border-gray-200">{user.lastName}</td>
                                <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                <td className="py-3 px-6 text-center flex">
                                    <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                                    <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                                    <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Integrated Modal */}
            <Modal
                user={selectedUser}
                type={modalType}
                onClose={handleCloseModal}
                onDelete={handleDeleteUser}
            />
        </div>
    );
};

export default HrList1;
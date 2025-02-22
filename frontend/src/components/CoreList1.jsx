 // src/components/CoreList1.jsx
 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import { Link } from 'react-router-dom';
 import { toast } from "react-hot-toast";
 import { IoMdArrowRoundBack } from "react-icons/io";
 import * as XLSX from 'xlsx';
 import { CiExport } from "react-icons/ci";
 import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

 const CoreList1 = () => {
     const [users, setUsers] = useState([]);
     const [selectedUser, setSelectedUser] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalType, setModalType] = useState('');
     const [editFormData, setEditFormData] = useState({});
     const [currentPage, setCurrentPage] = useState(1);
     const [usersPerPage] = useState(10); // 10 accounts per page
     const [isLoading, setIsLoading] = useState(true);

     const baseURL = process.env.NODE_ENV === 'production'
         ? 'https://backend-admin.jjm-manufacturing.com/api/coreusers'
         : 'http://localhost:7690/api/coreusers';

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

             // Fetch users with authentication
             const response = await axios.get(`${baseURL}/get`, {
                 headers: {
                     Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
                 },
             });

             console.log("✅ Backend Response:", response.data);
             setUsers(response.data);
         } catch (err) {
             console.error("❌ Error fetching users:", err.response ? err.response.data : err.message);
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
         setEditFormData({  // Initialize form data with the user's current values
             name: user.name,
             email: user.email,
             Core: user.Core, // Initialize Core
             role: user.role // Initialize role
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
         XLSX.writeFile(wb, "Core_users.xlsx");
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


     // Integrated Modal Component
     const Modal = ({ user, type, onClose, onDelete }) => {
         if (!isModalOpen) return null;

         return (
             <div className="fixed top-0 z-50 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                 <div className="bg-white p-8 rounded shadow-md w-96">
                     <h2 className="text-2xl font-bold text-black mb-4">{type === 'view' ? 'View User' : type === 'update' ? 'Update User' : 'Delete User'}</h2>

                     {type === 'view' && (
                         <div>
                             <p>Name: {user.name}</p>
                             <p>Email: {user.email}</p>
                             <p>Core: {user.Core}</p>
                             <p>Role: {user.role}</p>
                         </div>
                     )}

                     {type === 'update' && (
                         <div>
                             {/* Update Form */}
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editName">Name</label>
                                 <input
                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                     id="editName"
                                     type="text"
                                     name="name"
                                     value={editFormData.name || ''}
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
                             {/* Core Select in Update Form */}
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editCore">Core</label>
                                 <select
                                     className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                                     id="editCore"
                                     name="Core"
                                     value={editFormData.Core || 1}
                                     onChange={handleEditFormChange}
                                 >
                                     <option value={1}>Core 1</option>
                                     <option value={2}>Core 2</option>
                                 </select>
                             </div>

                             {/* Role Select in Update Form */}
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editRole">Role</label>
                                 <select
                                     className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                                     id="editRole"
                                     name="role"
                                     value={editFormData.role || 'audit'}
                                     onChange={handleEditFormChange}
                                 >
                                     <option value="audit">Audit</option>
                                     <option value="admin">Admin</option>
                                     <option value="super admin">Super Admin</option>
                                 </select>
                             </div>
                             <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateUser}>
                                 Update User
                             </button>
                         </div>
                     )}

                     {type === 'delete' && (
                         <div>
                             <p>Are you sure you want to delete user {user.name}?</p>
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

                 <h1 className="text-2xl font-bold mb-4 text-black">Core Department</h1>
                 <button onClick={handleExportToExcel} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
                     <CiExport />
                 </button>

                 <table className="min-w-full bg-white">
                     <thead>
                         <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
                             <th className="py-3 px-6 text-left border">Name</th>
                             <th className="py-3 px-6 text-left border">Email</th>
                             <th className="py-3 px-6 text-left border">Core</th>
                             <th className="py-3 px-6 text-left border">Role</th>
                             <th className="py-3 px-6 text-center border">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="text-gray-600 text-sm font-light border">
                         {isLoading ? (
                             // Skeleton loading state
                             Array(usersPerPage).fill(0).map((_, index) => (
                                 <tr key={index}>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td> {/* Skeleton for Name */}
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td> {/* Skeleton for Email */}
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={50} /></td> {/* Skeleton for Core */}
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={60} /></td> {/* Skeleton for Role */}
                                     <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={80} /></td> {/* Skeleton for Actions */}
                                 </tr>
                             ))
                         ) : (
                             currentUsers.map((user) => ( // Use currentUsers here
                                 <tr key={user._id}>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.name}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.Core}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
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
             />
         </div>
     );
 };

 export default CoreList1;
 // src/components/CoreList1.jsx
 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import { Link } from 'react-router-dom'; // Link is already imported
 import { toast } from "react-hot-toast";
 import { IoMdArrowRoundBack } from "react-icons/io";
 import * as XLSX from 'xlsx';
 import { CiExport } from "react-icons/ci";
 import { FaUserSlash, FaList } from "react-icons/fa"; // Added FaList for inactive list icon
 import Skeleton from 'react-loading-skeleton';
 import 'react-loading-skeleton/dist/skeleton.css';


 const CoreList1 = () => {
     const [users, setUsers] = useState([]);
     const [selectedUser, setSelectedUser] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalType, setModalType] = useState('');
     const [editFormData, setEditFormData] = useState({});
     const [currentPage, setCurrentPage] = useState(1);
     const [usersPerPage] = useState(10);
     const [isLoading, setIsLoading] = useState(true);
     const [role, setRole] = useState(null);

     const baseURL = process.env.NODE_ENV === 'production'
         ? 'https://backend-admin.jjm-manufacturing.com/api/coreusers'
         : 'http://localhost:7690/api/coreusers';

     const authURL = process.env.NODE_ENV === 'production'
         ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
         : 'http://localhost:7690/api/auth/get-token';

     // --- MODIFIED: Fetch only ACTIVE users ---
     const fetchActiveUsers = async () => {
         setIsLoading(true);
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;

             if (!token) {
                 console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed. Please log in again.");
                 setIsLoading(false);
                 return;
             }

             const response = await axios.get(`${baseURL}/getActiveUsers`, {
                 headers: { Authorization: `Bearer ${token}` },
             });

             console.log("✅ Backend Response (Active Users):", response.data);
             setUsers(response.data);
         } catch (err) {
             console.error("❌ Error fetching active users:", err.response ? err.response.data : err.message);
             toast.error("Failed to load users.");
         } finally {
             setIsLoading(false);
         }
     };

     useEffect(() => {
         fetchActiveUsers();
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
             name: user.name,
             email: user.email,
             Core: user.Core,
             role: user.role
         });
         setIsModalOpen(true);
     };

     const handleDeactivateClick = (user) => {
         setSelectedUser(user);
         setModalType('deactivate');
         setIsModalOpen(true);
     };

     const handleDelete = (user) => {
         setSelectedUser(user);
         setModalType('delete');
         setIsModalOpen(true);
     };

     const handleDeactivateUser = async (userId) => {
         setIsLoading(true);
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) { toast.error("Auth error"); setIsLoading(false); return; }

             const response = await axios.patch(`${baseURL}/deactivateUser/${userId}`, {}, {
                 headers: { Authorization: `Bearer ${token}` },
             });

             if (response.status === 200) {
                 toast.success('User removed (deactivated) successfully!');
                 setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                 handleCloseModal();
             } else {
                 console.error('Failed to deactivate user:', response);
                 toast.error('Failed to remove user.');
             }
         } catch (error) {
             console.error('Error deactivating user:', error.response ? error.response.data : error.message);
             toast.error('An error occurred while removing the user.');
         } finally {
             setIsLoading(false);
         }
     };

     const handleDeleteUser = async (userId) => {
         setIsLoading(true);
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) { toast.error("Auth error"); setIsLoading(false); return; }

             const response = await axios.delete(`${baseURL}/${userId}`, {
                 headers: { Authorization: `Bearer ${token}` },
             });

             if (response.status === 200) {
                 toast.success('User permanently deleted!');
                 setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                 handleCloseModal();
             } else {
                 console.error('Failed to delete user:', response);
                 toast.error('Failed to delete user.');
             }
         } catch (error) {
             console.error('Error deleting user:', error.response ? error.response.data : error.message);
             toast.error('An error occurred while deleting the user.');
         } finally {
             setIsLoading(false);
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
         setIsLoading(true);
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) { toast.error("Auth error"); setIsLoading(false); return; }

             const response = await axios.put(`${baseURL}/update/${selectedUser._id}`, editFormData, {
                 headers: { Authorization: `Bearer ${token}` },
             });

             if (response.status === 200) {
                 toast.success('User updated successfully!');
                 setUsers(prevUsers => prevUsers.map(user =>
                     user._id === selectedUser._id ? { ...user, ...response.data.user } : user
                 ));
                 handleCloseModal();
             }
         } catch (error) {
             console.error('Failed to update user:', error.response ? error.response.data : error.message);
             toast.error('An error occurred while updating the user.');
         } finally {
             setIsLoading(false);
         }
     };

     const handleExportToExcel = () => {
         const dataToExport = users.map(user => ({
             Name: user.name,
             Email: user.email,
             Core: user.Core,
             Role: user.role,
             Status: user.status
         }));
         const ws = XLSX.utils.json_to_sheet(dataToExport);
         const wb = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(wb, ws, "Active_Users");
         XLSX.writeFile(wb, "Active_Core_Users.xlsx");
     };

     const indexOfLastUser = currentPage * usersPerPage;
     const indexOfFirstUser = indexOfLastUser - usersPerPage;
     const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

     const paginate = (pageNumber) => setCurrentPage(pageNumber);
     const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
     const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
     const totalPages = Math.ceil(users.length / usersPerPage);

     const Modal = ({ user, type, onClose }) => {
         if (!isModalOpen || !user) return null;

         let title = "User Details";
         if (type === 'update') title = "Update User";
         if (type === 'delete') title = "Confirm Permanent Delete";
         if (type === 'deactivate') title = "Confirm Removal";

         return (
             <div className="fixed top-0 z-50 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                 <div className="bg-white p-8 rounded shadow-md w-96">
                     <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>

                     {type === 'view' && (
                         <div>
                             <p>Name: {user.name}</p>
                             <p>Email: {user.email}</p>
                             <p>Core: {user.Core}</p>
                             <p>Role: {user.role}</p>
                             <p>Status: {user.status}</p>
                         </div>
                     )}

                     {type === 'update' && (
                         <div>
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editName">Name</label>
                                 <input
                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                     id="editName" type="text" name="name" value={editFormData.name || ''} onChange={handleEditFormChange}
                                 />
                             </div>
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editEmail">Email</label>
                                 <input
                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                     id="editEmail" type="email" name="email" value={editFormData.email || ''} onChange={handleEditFormChange}
                                 />
                             </div>
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editCore">Core</label>
                                 <select
                                     className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                                     id="editCore" name="Core" value={editFormData.Core || 1} onChange={handleEditFormChange} >
                                     <option value={1}>Core 1</option>
                                     <option value={2}>Core 2</option>
                                 </select>
                             </div>
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editRole">Role</label>
                                 <select
                                     className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                                     id="editRole" name="role" value={editFormData.role || 'audit'} onChange={handleEditFormChange} >
                                     <option value="audit">Audit</option>
                                     <option value="auditor">Auditor</option>
                                     <option value="maintenancemanager">Maintenance Manager</option>
                                     <option value="admin">Admin</option>
                                     <option value="superadmin">Super Admin</option>
                                 </select>
                             </div>
                             <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateUser}>
                                 Update User
                             </button>
                         </div>
                     )}

                     {type === 'deactivate' && (
                         <div>
                             <p className='text-black'>Are you sure you want to remove user <span className='font-bold'>{user.name}</span> from the active list?</p>
                             <p className='text-sm text-gray-600 mb-4'>(This will mark them as inactive.)</p>
                             <div className="flex justify-end mt-4">
                                 <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
                                         onClick={() => handleDeactivateUser(user._id)}>
                                     Yes, Remove
                                 </button>
                                 <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
                                     Cancel
                                 </button>
                             </div>
                         </div>
                     )}

                     {type === 'delete' && (
                         <div>
                             <p className='text-black'>Are you sure you want to <span className='font-bold text-red-600'>permanently delete</span> user <span className='font-bold'>{user.name}</span>?</p>
                             <p className='text-sm text-red-700 mb-4'>(This action cannot be undone.)</p>
                             <div className="flex justify-end mt-4">
                                 <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                         onClick={() => handleDeleteUser(user._id)}>
                                     Yes, Delete Permanently
                                 </button>
                                 <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
                                     Cancel
                                 </button>
                             </div>
                         </div>
                     )}

                     {(type === 'view' || type === 'update') && (
                         <div className="flex justify-end mt-4">
                             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                                 Close
                             </button>
                         </div>
                     )}
                 </div>
             </div>
         );
     };


     return (
         <div className="p-4 h-screen bg-gray-200">
             <div className="container mx-auto p-4">
                 {/* --- MODIFIED Header Section --- */}
                 <div className="flex justify-between items-center mb-4">
                     {/* Back Button */}
                     <Link to="/home/accountlist">
                         <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center"> {/* Added flex */}
                             <IoMdArrowRoundBack className="mr-1" /> Back {/* Added margin */}
                         </button>
                     </Link>

                     {/* Title */}
                     <h1 className="text-2xl font-bold text-black text-center flex-grow">Core Department - Active Users</h1> {/* Added centering and grow */}

                     {/* Action Buttons Group */}
                     <div className="flex items-center space-x-2"> {/* Group buttons */}
                         {/* --- NEW Link to Inactive List --- */}
                         <Link to="/home/InactiveCoreList" title="View Inactive Users">
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow flex items-center">
                                <FaList className="mr-1" /> Inactive {/* Added icon and text */}
                            </button>
                         </Link>
                         {/* Export Button */}
                         <button onClick={handleExportToExcel} title="Export Active Users" className="bg-yellow-500 text-white px-4 py-2 rounded shadow flex items-center"> {/* Added flex */}
                             <CiExport className="mr-1"/> Export {/* Added margin */}
                         </button>
                     </div>
                 </div>
                 {/* --- End of MODIFIED Header Section --- */}


                 {/* Table - No Design Change */}
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
                             Array(usersPerPage).fill(0).map((_, index) => (
                                 <tr key={index} className="border-b border-gray-200">
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={50} /></td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={60} /></td>
                                     <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={120} /></td>
                                 </tr>
                             ))
                         ) : (
                            currentUsers.length > 0 ? currentUsers.map((user) => (
                                 <tr key={user._id} className="border-b border-gray-200">
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.name}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.Core}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                     <td className="py-3 px-6 text-center border-b border-gray-200">
                                         <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                                         {role === 'superadmin' && (
                                             <>
                                                 <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                                                 <button onClick={() => handleDeactivateClick(user)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Remove</button>
                                                 {/* <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button> */}
                                             </>
                                         )}
                                     </td>
                                 </tr>
                             )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500 border-b border-gray-200">No active users found.</td>
                                </tr>
                             )
                         )}
                     </tbody>
                 </table>

                 {/* Pagination - No Design Change */}
                 {!isLoading && users.length > usersPerPage && (
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
                 )}
             </div>

             {/* Modal Rendering */}
             <Modal
                 user={selectedUser}
                 type={modalType}
                 onClose={handleCloseModal}
             />
         </div>
     );
 };

 export default CoreList1;
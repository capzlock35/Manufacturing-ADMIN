 // src/components/FinanceList.jsx
 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import { Link } from 'react-router-dom';
 import { toast } from "react-hot-toast";
 import { IoMdArrowRoundBack } from "react-icons/io";
 import * as XLSX from 'xlsx';
 import { CiExport } from "react-icons/ci";
 
 const FinanceList = () => {
     const [users, setUsers] = useState([]);
     const [selectedUser, setSelectedUser] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalType, setModalType] = useState('');
     const [editFormData, setEditFormData] = useState({}); // State for edit form data
 
     const baseURL = process.env.NODE_ENV === 'production'
         ? 'https://backend-admin.jjm-manufacturing.com/api/finance'
         : 'http://localhost:7690/api/finance';
 
     useEffect(() => {
         axios.get(`${baseURL}/get`)
             .then(response => {
                 console.log("Backend Response:", response.data);
                 setUsers(response.data);
             })
             .catch(err => {
                 console.log(err);
             });
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
             userName: user.userName,
             email: user.email,
             fullName: user.fullName,
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
           XLSX.writeFile(wb, "finance_users.xlsx");
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
                             <p>Username: {user.userName}</p>
                             <p>Email: {user.email}</p>
                             <p>Full Name: {user.fullName}</p>
                             <p>Role: {user.role}</p>
                             <img src={user.image.secure_url} alt={user.userName} className="w-32 h-32 object-cover rounded-full mt-4" />
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
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editFullName">Full Name</label>
                                 <input
                                     className="shadow appearance-none border rounded w-full py-2 px-3  text-black border-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                     id="editFullName"
                                     type="text"
                                     name="fullName"
                                     value={editFormData.fullName || ''}
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
                         <p>Are you sure you want to delete user {user.userName}?</p>
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
 
                 <h1 className="text-2xl font-bold mb-4 text-black">Finance Department</h1>
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
                         {users.map((user) => (
                             <tr key={user._id}>
                                 <td className="py-3 px-6 text-left border-b border-gray-200">
                                     <img src={user.image.secure_url} alt={user.userName} className="w-16 h-16 object-cover rounded-full" />
                                 </td>
                                 <td className="py-3 px-6 text-left border-b border-gray-200">{user.userName}</td>
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
 
 export default FinanceList;
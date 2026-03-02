 // src/components/InactiveCoreList.jsx
 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import { Link } from 'react-router-dom';
 import { toast } from "react-hot-toast";
 import { IoMdArrowRoundBack } from "react-icons/io";
 import * as XLSX from 'xlsx';
 import { CiExport } from "react-icons/ci";
 import Skeleton from 'react-loading-skeleton';
 import 'react-loading-skeleton/dist/skeleton.css';
 // You might want an icon for Undo/Reactivate, e.g., FaUndo from react-icons/fa
 // import { FaUndo } from "react-icons/fa";

 const InactiveCoreList = () => {
     // State variables - mostly the same, but 'users' will hold inactive users
     const [users, setUsers] = useState([]);
     const [selectedUser, setSelectedUser] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalType, setModalType] = useState(''); // 'view', 'reactivate'
     // editFormData is not needed if there's no update button
     // const [editFormData, setEditFormData] = useState({});
     const [currentPage, setCurrentPage] = useState(1);
     const [usersPerPage] = useState(10);
     const [isLoading, setIsLoading] = useState(true);
     const [role, setRole] = useState(null);

     // API URLs - same as before
     const baseURL = process.env.NODE_ENV === 'production'
         ? 'https://backend-admin.jjm-manufacturing.com/api/coreusers'
         : 'http://localhost:7690/api/coreusers';

     const authURL = process.env.NODE_ENV === 'production'
         ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
         : 'http://localhost:7690/api/auth/get-token';

     // --- FETCH INACTIVE USERS ---
     const fetchInactiveUsers = async () => {
         setIsLoading(true);
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;

             if (!token) {
                 console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed.");
                 setIsLoading(false);
                 return;
             }

             // Fetch INACTIVE users using the specific endpoint
             const response = await axios.get(`${baseURL}/getInactiveUsers`, { // <-- USE getInactiveUsers ENDPOINT
                 headers: {
                     Authorization: `Bearer ${token}`,
                 },
             });

             console.log("✅ Backend Response (Inactive Users):", response.data);
             setUsers(response.data); // Set state with inactive users
         } catch (err) {
             console.error("❌ Error fetching inactive users:", err.response ? err.response.data : err.message);
             toast.error("Failed to load inactive users.");
         } finally {
             setIsLoading(false);
         }
     };

     // Fetch users on component mount
     useEffect(() => {
         fetchInactiveUsers();
     }, []);

     // Get user role from local storage
     useEffect(() => {
         const userRole = localStorage.getItem('role');
         setRole(userRole);
     }, []);

     // --- ACTION HANDLERS ---

     // Handle View button click
     const handleView = (user) => {
         setSelectedUser(user);
         setModalType('view');
         setIsModalOpen(true);
     };

     // Handle Undo (Reactivate) button click
     const handleReactivateClick = (user) => {
         setSelectedUser(user);
         setModalType('reactivate'); // Set type for reactivation modal
         setIsModalOpen(true);
     };

     // Function to perform Reactivation (set status to active)
     const handleReactivateUser = async (userId) => {
         setIsLoading(true);
         try {
             const tokenResponse = await axios.get(authURL);
             const token = tokenResponse.data.token;
             if (!token) { toast.error("Auth error"); setIsLoading(false); return; }

             // Call the REACTIVATE endpoint
             const response = await axios.patch(`${baseURL}/reactivateUser/${userId}`, {}, {
                 headers: { Authorization: `Bearer ${token}` },
             });

             if (response.status === 200) {
                 toast.success('User reactivated successfully!');
                 // Remove the user from this inactive list view
                 setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                 handleCloseModal();
             } else {
                 console.error('Failed to reactivate user:', response);
                 toast.error('Failed to reactivate user.');
             }
         } catch (error) {
             console.error('Error reactivating user:', error.response ? error.response.data : error.message);
             toast.error('An error occurred while reactivating the user.');
         } finally {
             setIsLoading(false);
         }
     };

     // Close modal handler
     const handleCloseModal = () => {
         setIsModalOpen(false);
         setSelectedUser(null);
         setModalType('');
         // setEditFormData({}); // Not needed without update form
     };

     // --- UTILITY FUNCTIONS ---

     // Export inactive users to Excel
     const handleExportToExcel = () => {
         const dataToExport = users.map(user => ({
             Name: user.name,
             Email: user.email,
             Core: user.Core,
             Role: user.role,
             Status: user.status // Should always be 'inactive' here
         }));
         const ws = XLSX.utils.json_to_sheet(dataToExport);
         const wb = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(wb, ws, "Inactive_Users"); // Sheet name
         XLSX.writeFile(wb, "Inactive_Core_Users.xlsx"); // File name
     };

     // --- PAGINATION LOGIC --- (Identical to CoreList1)
     const indexOfLastUser = currentPage * usersPerPage;
     const indexOfFirstUser = indexOfLastUser - usersPerPage;
     const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
     const paginate = (pageNumber) => setCurrentPage(pageNumber);
     const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
     const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
     const totalPages = Math.ceil(users.length / usersPerPage);

     // --- MODAL COMPONENT --- (Simplified for View/Reactivate)
     const Modal = ({ user, type, onClose }) => {
         if (!isModalOpen || !user) return null;

         let title = "Inactive User Details"; // Default/View title
         if (type === 'reactivate') title = "Confirm Reactivation"; // Title for undo/reactivate

         return (
             <div className="fixed top-0 z-50 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                 <div className="bg-white p-8 rounded shadow-md w-96">
                     {/* Modal Title */}
                     <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>

                     {/* View Section */}
                     {type === 'view' && (
                         <div>
                             <p>Name: {user.name}</p>
                             <p>Email: {user.email}</p>
                             <p>Core: {user.Core}</p>
                             <p>Role: {user.role}</p>
                             <p>Status: {user.status}</p> {/* Status will be inactive */}
                             {/* Close button for View */}
                             <div className="flex justify-end mt-4">
                                 <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                                     Close
                                 </button>
                             </div>
                         </div>
                     )}

                     {/* Reactivate Confirmation Section */}
                     {type === 'reactivate' && (
                         <div>
                             <p className='text-black'>Are you sure you want to reactivate user <span className='font-bold'>{user.name}</span>?</p>
                             <p className='text-sm text-gray-600 mb-4'>(They will be moved back to the active list.)</p>
                             <div className="flex justify-end mt-4">
                                 {/* Button to call the reactivate function */}
                                 <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2" // Using green like 'Update'
                                         onClick={() => handleReactivateUser(user._id)}>
                                     Yes, Reactivate
                                 </button>
                                 <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
                                     Cancel
                                 </button>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
         );
     };

     // --- JSX RENDER --- (Structure and Design same as CoreList1)
     return (
         <div className="p-4 h-screen bg-gray-200">
             <div className="container mx-auto p-4">
                 {/* Header */}
                 <div className="flex justify-between items-center mb-4">
                     <Link to="/home/CoreList1"> {/* Adjust link as needed */}
                         <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
                             <IoMdArrowRoundBack />
                         </button>
                     </Link>
                     <h1 className="text-2xl font-bold text-black">Core Department - Inactive Users</h1> {/* Changed Title */}
                     <button onClick={handleExportToExcel} title="Export Inactive Users" className="bg-yellow-500 text-white px-4 py-2 rounded">
                         <CiExport />
                     </button>
                 </div>

                 {/* Table */}
                 <table className="min-w-full bg-white">
                     <thead>
                         <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
                             <th className="py-3 px-6 text-left border">Name</th>
                             <th className="py-3 px-6 text-left border">Email</th>
                             <th className="py-3 px-6 text-left border">Core</th>
                             <th className="py-3 px-6 text-left border">Role</th>
                             {/* Status column could be added for clarity, but sticking to "same design" */}
                             <th className="py-3 px-6 text-center border">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="text-gray-600 text-sm font-light border">
                         {isLoading ? (
                             // Skeleton Loading
                             Array(usersPerPage).fill(0).map((_, index) => (
                                 <tr key={index} className="border-b border-gray-200">
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={50} /></td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton width={60} /></td>
                                     <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={80} /></td> {/* Adjusted width */}
                                 </tr>
                             ))
                         ) : (
                             // User Data Rows
                             currentUsers.length > 0 ? currentUsers.map((user) => (
                                 <tr key={user._id} className="border-b border-gray-200">
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.name}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.Core}</td>
                                     <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                     {/* Action Buttons Column */}
                                     <td className="py-3 px-6 text-center border-b border-gray-200">
                                         {/* View Button */}
                                         <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                                         {/* Conditional Undo (Reactivate) Button for Superadmin */}
                                         {role === 'superadmin' && (
                                             <>
                                                 {/* Undo Button */}
                                                 <button onClick={() => handleReactivateClick(user)} className="bg-green-500 text-white px-3 py-1 rounded">Undo</button>
                                                 {/* Using same green as Update button for design consistency */}
                                             </>
                                         )}
                                     </td>
                                 </tr>
                             )) : (
                                 // Message when no inactive users are found
                                 <tr>
                                     <td colSpan="5" className="text-center py-4 text-gray-500 border-b border-gray-200">No inactive users found.</td>
                                 </tr>
                             )
                         )}
                     </tbody>
                 </table>

                 {/* Pagination */}
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

 export default InactiveCoreList; // Make sure to export the new component name
// src/components/InactiveAdminList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx'; // Added Excel export
import { CiExport } from "react-icons/ci"; // Added Excel export icon
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const InactiveAdminList = () => {
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

    const authURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
        : 'http://localhost:7690/api/auth/get-token';

    // --- Fetches *inactive* admin users ---
    const fetchInactiveUsers = async () => {
        setIsLoading(true);
        try {
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;

            if (!token) {
                console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed."); // Added toast for auth failure
                return;
            }

            const response = await axios.get(`${baseURL}/inactive`, { // Call the /inactive endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("✅ Backend Response (Inactive Admins):", response.data);
            setInactiveUsers(response.data);
        } catch (error) {
            console.error("Error fetching inactive users:", error.response ? error.response.data : error.message);
            toast.error('Failed to load inactive admins.'); // Added toast for fetch errors
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

    // --- Handler to initiate the "Undo" action ---
    const handleUndoRemove = (user) => {
        setSelectedUser(user);
        setModalType('undo'); // New modal type for Undo
        setIsModalOpen(true);
    };


    // --- Function to call the backend undo endpoint ---
    const handleUndoAdminUser = async (userId) => {
        try {
            const tokenResponse = await axios.get(authURL);
            const token = tokenResponse.data.token;
             if (!token) {
                 console.error("🚨 No token received from backend!");
                 toast.error("Authentication failed.");
                 return;
             }

            const response = await axios.patch(`${baseURL}/undo/${userId}`, {}, { // Call the /undo endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Admin status set to active!');
                // Remove the user from the current inactive list state
                setInactiveUsers(inactiveUsers.filter(user => user._id !== userId));
                handleCloseModal();
                // Optionally, if the active list component is also mounted,
                // you might want a way to signal it to refetch or add this user.
                // For simplicity here, we just update the inactive list.
            } else {
                 toast.error(response.data.message || 'Failed to undo removal.');
            }
        } catch (error) {
            console.error('Failed to undo admin remove:', error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'An error occurred while trying to undo remove admin.');
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setModalType('');
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
         const usersForExcel = inactiveUsers.map(user => ({
             Image: user.image?.secure_url || '',
             Username: user.userName,
             FirstName: user.firstName,
             LastName: user.lastName,
             Email: user.email,
             Role: user.role,
              Birthday: user.birthday ? new Date(user.birthday).toLocaleDateString() : '', // Format date for excel
             Gender: user.gender,
             Age: calculateAge(user.birthday),
             Status: user.status
         }));
         const ws = XLSX.utils.json_to_sheet(usersForExcel);
         const wb = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(wb, ws, "Inactive Admin Users");
         XLSX.writeFile(wb, "Inactive_Admin_users.xlsx");
     };


    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentInactiveUsers = inactiveUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => setCurrentPage(currentPage - 1);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const totalPages = Math.ceil(inactiveUsers.length / usersPerPage);


    // Integrated Modal Component (Updated to handle 'view' and 'undo' types for inactive list)
    const Modal = ({ user, type, onClose, onUndoAdmin }) => { // Added onUndoAdmin prop
        if (!isModalOpen || !user) return null; // Ensure modal is open and user is not null

        return (
            <div className="fixed z-50 top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold text-black mb-4">
                        {type === 'view' ? 'View Inactive User' : type === 'undo' ? 'Undo Remove User' : ''} {/* Adjusted titles */}
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
                     {/* --- NEW: Modal content for Undo action --- */}
                     {type === 'undo' && (
                         <div>
                             <p>Are you sure you want to undo removal for user {user.userName}?</p>
                             <p className="text-sm text-gray-500">This will set the user back to active.</p>
                             <div className="flex justify-end mt-4">
                                 <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => {
                                     onUndoAdmin(user._id); // Call the undo admin function
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
                         {/* --- MODIFIED: Conditionally show close button (Undo modal has its own buttons) --- */}
                         {type === 'view' && (
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
                {/* --- MODIFIED: Back Button to Active Admin List --- */}
                <div className="mb-4">
                    <Link to="/home/AdminList"> {/* Link back to the Active Admin List */}
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
                            <IoMdArrowRoundBack /> Back to Active Admin
                        </button>
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-black">Inactive Admin Accounts</h1> {/* Updated Title */}
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
                            <th className="py-3 px-6 text-left border">Status</th> {/* Status Column */}
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
                                     <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td> {/* Skeleton for Status */}
                                     <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={100} /></td> {/* Adjusted width */}
                                 </tr>
                             ))
                         ) : (
                            currentInactiveUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">
                                         {user.image?.secure_url && ( // Added optional chaining
                                            <img src={user.image.secure_url} alt={user.userName} className="w-16 h-16 object-cover rounded-full" />
                                         )}
                                    </td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.userName}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
                                    <td className="py-3 px-6 text-left border-b border-gray-200">{user.status}</td> {/* Display Status */}
                                    <td className="py-3 px-6 text-center flex justify-center items-center">
                                        <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-xs">View</button>
                                        <button onClick={() => handleUndoRemove(user)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Undo</button> {/* Undo Button */}
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
                onUndoAdmin={handleUndoAdminUser} // Pass the undo function
            />
        </div>
    );
};

export default InactiveAdminList;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from '../Modals/ModalUser'; // Assuming ModalUser is used for HR purposes too
import { toast } from 'react-hot-toast';
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import { CiExport } from "react-icons/ci";


const HrList4 = () => {
  // Hooks to manage users and modal state
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  // Base URL setup
  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/user'
    : 'http://localhost:7690/api/user';

  // Fetch users with pagination
  useEffect(() => {
    axios.get(`${baseURL}/get`, {
      params: { page: currentPage, limit: 10, department: 'hr 4' }
    })
      .then(response => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      })
      .catch(err => console.log(err));
  }, [currentPage]); // Re-fetch when page changes

  // Open modal for viewing user details
  const handleView = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setIsModalOpen(true);
  };

  // Open modal for updating user's information
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setModalType('update');
    setIsModalOpen(true);
  };

  // Open modal for deleting the user
  const handleDelete = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setIsModalOpen(true);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${baseURL}/delete/user/${userId}`);
      if (response.status === 200) {
        toast.success('User deleted successfully!');
        setUsers(users.filter(user => user._id !== userId)); // Remove user from state
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('An error occurred while trying to delete the user.');
    }
  };

  // Close the modal and reset state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Go to next page
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Go to previous page
    }
  };

  const exportToExcel = () => {
    // Create an array to hold all users
    let allUsers = [];
    
    // Loop through all pages and fetch users
    const fetchAllUsers = async () => {
      try {
        // Fetch users for each page (you can optimize this with your total page count)
        for (let page = 1; page <= totalPages; page++) {
          const response = await axios.get(`${baseURL}/get`, {
            params: { page: page, limit: 10, department: 'hr 4' }
          });
          allUsers = [...allUsers, ...response.data.users]; // Concatenate the users of each page
        }
  
        // Now export the combined users data
        const ws = XLSX.utils.json_to_sheet(allUsers); // Convert all users data to a sheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Users'); // Append the sheet to the workbook
        XLSX.writeFile(wb, 'users_Hr4_backup.xlsx'); // Save the file
      } catch (error) {
        console.error("Error fetching all users:", error);
        toast.error('Failed to fetch all users for export.');
      }
    };
  
    // Call the function to fetch all users and export
    fetchAllUsers();
  };


  return (
    <div className="p-4 h-screen bg-gray-200">
      <div className="container mx-auto p-4">
      <Link to="/home/accountlist">
            <button
className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              <IoMdArrowRoundBack />

            </button>
          </Link>

        <h1 className="text-2xl font-bold mb-4 text-black">HR4 Department</h1>


        {/* Export Button */}
        <button onClick={exportToExcel} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
        <CiExport />
        </button>


      {/* Navigation Buttons */}
      <div className="mb-4 flex gap-2">
          <Link to="/home/HrList1">
            <button
              className={`px-4 py-2 rounded ${
                location.pathname === '/home/HrList1'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-300 text-black'
              }`}
            >
              HrList1
            </button>
          </Link>
          <Link to="/home/HrList2">
            <button
              className={`px-4 py-2 rounded ${
                location.pathname === '/home/HrList2'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-300 text-black'
              }`}
            >
              HrList2
            </button>
          </Link>
          <Link to="/home/HrList3">
            <button
              className={`px-4 py-2 rounded ${
                location.pathname === '/home/HrList3'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-300 text-black'
              }`}
            >
              HrList3
            </button>
          </Link>
          <Link to="/home/HrList4">
            <button
              className={`px-4 py-2 rounded ${
                location.pathname === '/home/HrList4'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-300 text-black'
              }`}
            >
              HrList4
            </button>
          </Link>
        </div>


        
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left border">No.</th>
              <th className="py-3 px-6 text-left border">Username</th>
              <th className="py-3 px-6 text-left border">Email</th>
              <th className="py-3 px-6 text-left border">Role</th>
              <th className="py-3 px-6 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{user.username}</td>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                  <td className="py-3 px-6 text-left border-b border-gray-200 border">{user.role}</td>
                  <td className="py-3 px-6 text-center flex">
                    <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                    <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                    <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-6 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          {currentPage > 1 && (
            <button onClick={handlePreviousPage} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
              Previous
            </button>
          )}
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages && (
            <button onClick={handleNextPage} className="px-6 py-2 bg-blue-500 text-white rounded ml-2">
              Next
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          type={modalType}
          user={selectedUser}
          onClose={handleCloseModal}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default HrList4
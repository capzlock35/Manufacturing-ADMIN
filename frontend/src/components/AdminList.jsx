import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalUser from '../Modals/ModalUser';
import { Link } from 'react-router-dom';
import { toast } from "react-hot-toast"
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/user'
    : 'http://localhost:7690/api/user';

  useEffect(() => {
    setIsLoading(true); // Start loading
    axios.get(`${baseURL}/get`, {
      params: { page: currentPage, limit: 10, department: 'admin' }
    })
      .then(response => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setIsLoading(false); // Stop loading
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, [currentPage]);

  const handleView = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setModalType('update');
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${baseURL}/delete/user/${userId}`);
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
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportToExcel = () => {
    let allUsers = [];

    const fetchAllUsers = async () => {
      try {
        for (let page = 1; page <= totalPages; page++) {
          const response = await axios.get(`${baseURL}/get`, {
            params: { page: page, limit: 10, department: 'admin' }
          });
          allUsers = [...allUsers, ...response.data.users];
        }

        const ws = XLSX.utils.json_to_sheet(allUsers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'users_admin_backup.xlsx');
      } catch (error) {
        console.error("Error fetching all users:", error);
        toast.error('Failed to fetch all users for export.');
      }
    };

    fetchAllUsers();
  };

  const SkeletonRow = () => (
    <tr>
      <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
      <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
      <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
      <td className="py-3 px-6 text-left border-b border-gray-200"><Skeleton /></td>
      <td className="py-3 px-6 text-center border-b border-gray-200"><Skeleton width={100} /></td>
    </tr>
  );


  return (
    <div className="p-4 h-screen bg-gray-200">
      <div className="container mx-auto p-4">
        <Link to="/home/accountlist">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
            <IoMdArrowRoundBack />
          </button>
        </Link>

        <h1 className="text-2xl font-bold mb-4 text-black">Admin Department</h1>

        <button onClick={exportToExcel} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
          <CiExport />
        </button>

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
          <tbody className="text-gray-600 text-sm font-light border">
            {isLoading ? (
              // Render skeleton rows while loading
              Array(10).fill(0).map((_, index) => <SkeletonRow key={index} />) // Adjust number '10' to match your typical table row count
            ) : users && Array.isArray(users) ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{user.username}</td>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{user.email}</td>
                  <td className="py-3 px-6 text-left border-b border-gray-200">{user.role}</td>
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

      {isModalOpen && (
        <ModalUser
          type={modalType}
          user={selectedUser}
          onClose={handleCloseModal}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default AdminList;
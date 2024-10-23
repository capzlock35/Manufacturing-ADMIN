import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalUser from '../Modals/ModalUser'; // Import ModalUser component

const AdminList = () => {
  // Hooks
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Determine base URL based on the environment
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://backend-admin.jjm-manufacturing.com/api/user'
    : 'http://localhost:7690/api/user';


  useEffect(() => {
    // Fetch users using BASE_URL
    axios.get(`${baseURL}/get`)
      .then(users => setUsers(users.data))
      .catch(err => console.log(err));
  }, []);

  // Handle view, update, delete
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear selected user when modal closes
  };

  const handleUpdatePassword = (userId, currentPassword, newPassword) => {
    // Axios PUT request for updating password
    axios.put(`${baseURL}/api/user/${userId}/update-password`, {
      currentPassword,
      newPassword,
    })
    .then(response => {
      console.log('Password updated:', response.data);
      setIsModalOpen(false);
    })
    .catch(error => {
      console.error('Error updating password:', error);
    });
  };

  const handleDeleteUser = (userId) => {
    // Axios DELETE request for deleting user
    axios.delete(`${baseURL}/api/user/${userId}`)
    .then(response => {
      console.log('User deleted:', response.data);
      setUsers(users.filter(user => user._id !== userId)); // Update the list after deletion
      setIsModalOpen(false);
    })
    .catch(error => {
      console.error('Error deleting user:', error);
    });
  };

  return (
    <div className='p-4 h-screen bg-gray-200'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Admin Account List</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border">Username</th>
              <th className="py-3 px-6 text-left border">Email</th>
              <th className="py-3 px-6 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {/* Check if users is an array before mapping */}
            {users && Array.isArray(users) ? (
              users.map(user => (
                <tr key={user._id}>
                  <td className="py-3 px-6 text-left">{user.username}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-center flex">
                    <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                    <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                    <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-3 px-6 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ModalUser */}
      {isModalOpen && (
        <ModalUser
          type={modalType}
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdate={handleUpdatePassword}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default AdminList;

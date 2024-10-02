import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './ModalUser';

const AdminList = () => {
  // Hooks
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', email: 'user1@example.com', firstName: 'John', lastName: 'Doe', birthday: '1990-01-01', gender: 'Male' },
    { id: 2, username: 'user2', email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith', birthday: '1992-05-15', gender: 'Female' },
    { id: 3, username: 'user3', email: 'user3@example.com', firstName: 'Alex', lastName: 'Johnson', birthday: '1988-11-30', gender: 'Non-binary' },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalType(null);
  };

  return (
    <div className='p-4  h-screen bg-gray-200'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Admin Account List</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border">No.</th>
              <th className="py-3 px-6 text-left border">Username</th>
              <th className="py-3 px-6 text-left border">Email</th>
              <th className="py-3 px-6 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{user.username}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-center flex">
                  <button onClick={() => handleView(user)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                  <button onClick={() => handleUpdate(user)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                  <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <Modal
            type={modalType}
            user={selectedUser}
            onClose={closeModal}
            // onUpdate={updatePassword}
            // onDelete={deleteUser}
          />
        )}
      </div>
    </div>
  );
};

export default AdminList;

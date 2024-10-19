import React, { useState } from 'react';

const ModalUser = ({ type, user, onClose, onUpdate, onDelete }) => {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleUpdatePassword = () => {
    onUpdate(user.id, currentPassword, newPassword);
    onClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {type === 'view' ? 'User Details' : type === 'update' ? 'Update Password' : 'Delete User'}
        </h2>

        {type === 'view' && (
          <div className="mb-4">
            <p><strong>First Name:</strong> {user.firstname}</p>
            <p><strong>Last Name:</strong> {user.lastname}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Birthday:</strong> {user.birthday}</p>
          </div>
        )}

        {type === 'update' && (
          <div className="mb-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 mb-2 border rounded bg-white"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-white"
            />
          </div>
        )}

        {type === 'delete' && (
          <p className="mb-4">Are you sure you want to delete this user account permanently?</p>
        )}

        <div className="flex justify-end">
          {type === 'update' && (
            <button onClick={handleUpdatePassword} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              Confirm
            </button>
          )}
          {type === 'delete' && (
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Delete
            </button>
          )}
          <button onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUser;

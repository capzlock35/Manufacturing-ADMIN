import React, { useState, useEffect } from 'react';
import Modal from '../Modals/ModalUser'; 

const LogisticList1 = () => {
  // Hooks to manage users and modal state
  const [users, setUsers] = useState([
    { id: 1, firstname: 'Oliver', lastname: 'Miller', gender: 'Male', age: '31', birthday: '1992-09-05', username: 'olivermiller', email: 'olivermiller@example.com' },
    { id: 2, firstname: 'Sophia', lastname: 'Johnson', gender: 'Female', age: '27', birthday: '1996-02-18', username: 'sophiajohnson', email: 'sophiajohnson@example.com' },
    { id: 3, firstname: 'Liam', lastname: 'Brown', gender: 'Male', age: '22', birthday: '2001-04-22', username: 'liambrown', email: 'liambrown@example.com' },
    { id: 4, firstname: 'Isabella', lastname: 'Davis', gender: 'Female', age: '29', birthday: '1994-12-10', username: 'isabelladavis', email: 'isabelladavis@example.com' },
    { id: 5, firstname: 'James', lastname: 'Wilson', gender: 'Male', age: '35', birthday: '1988-08-03', username: 'jameswilson', email: 'jameswilson@example.com' }
  ]);
  const [selectedUser, setSelectedUser] = useState(null); // To track the selected user for viewing, updating, or deleting
  const [modalType, setModalType] = useState(null); // control modal type (view, update, delete)
  const [isModalOpen, setIsModalOpen] = useState(false); //toggle modal



  // Open modal for viewing user details
  const handleView = (user) => {
    setSelectedUser(user); // Sets the user to be viewed
    setModalType('view'); // Set modal type to 'view'
    setIsModalOpen(true); // Opens the modal
  };

  // Open modal for updating user's information
  const handleUpdate = (user) => {
    setSelectedUser(user); // Sets the user whose information will be updated
    setModalType('update'); // Set modal type to 'update'
    setIsModalOpen(true); // Opens the modal
  };

  // Open modal for deleting the user
  const handleDelete = (user) => {
    setSelectedUser(user); // Sets the user to be deleted
    setModalType('delete'); // Set modal type to 'delete'
    setIsModalOpen(true); // Opens the modal
  };

  // Close the modal and reset the modal state
  const closeModal = () => {
    setIsModalOpen(false); // Closes the modal
    setSelectedUser(null); // Clears the selected user
    setModalType(null); // Resets the modal type
  };

  // Placeholder: Updating user's information (this will be passed as a prop to the Modal)
  const updateUser = async (userId, updatedInfo) => {

  };

  // Placeholder: Deleting a user (this will be passed as a prop to the Modal)
  const deleteUser = async (userId) => {

  };

  return (
    <div className='p-4 h-screen bg-gray-200'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Logistic1 User List</h1>

        {/* Table displaying the list of users */}
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border">No.</th>
              <th className="py-3 px-6 text-left border">Username</th> {/* Changed from "Employee Name" to "Username" */}
              <th className="py-3 px-6 text-left border">Email</th>
              <th className="py-3 px-6 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{user.username}</td> {/* Displays username */}
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

        {/* Conditionally renders the modal */}
        {isModalOpen && (
          <Modal
            type={modalType} // Passes the modal type ('view', 'update', or 'delete')
            user={selectedUser} // Passes the selected user data to the modal
            onClose={closeModal} // Passes the close modal function
            onUpdate={updateUser} // Passes the update user function
            onDelete={deleteUser} // Passes the delete user function
          />
        )}
      </div>
    </div>
    
  );
};

export default LogisticList1;

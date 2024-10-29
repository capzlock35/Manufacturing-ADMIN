import React, { useState } from 'react';
import Modal from '../Modals/ModalUser'; 

const CoreList1 = () => {
  // Adding dummy users
  const [users, setUsers] = useState([
    { id: 1, firstname:'john', lastname:'Doe', gender:'Male', age:'30', birthday:'01-15-1994', username: 'johndoe', email: 'johndoe@example.com' },
    { id: 2, firstname:'Jane', lastname:'Smith', gender:'FeMale', age:'28', birthday:'03-22-1996', username: 'janesmith', email: 'janesmith@example.com' },
    { id: 3, firstname:'Brian', lastname:'Lee', gender:'Male', age:"21", birthday:'03-03-2003', username: 'brianlee', email: 'brianlee@example.com' },
    { id: 4, firstname:'Emily', lastname:'Watson', gender:'FeMale', age:'25', birthday:'07-03-1999', username: 'emilywatson', email: 'emilywatson@example.com' },
    { id: 5, firstname:'Michael', lastname:'Wood', gender:'Male', age:'40', birthday:'10-10-1983', username: 'michaelwood', email: 'michaelwood@example.com' }
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
    console.log('User updated:', userId, updatedInfo);
  };

  // Placeholder: Deleting a user (this will be passed as a prop to the Modal)
  const deleteUser = async (userId) => {
    console.log('User deleted:', userId);
    setUsers(users.filter(user => user.id !== userId)); // Update users list after deletion
  };

  return (
    <div className='p-4 h-screen bg-gray-200'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Core1 User List</h1>

        {/* Table displaying the list of users */}
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

export default CoreList1;

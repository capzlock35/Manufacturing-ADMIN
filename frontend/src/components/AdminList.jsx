import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AdminList = () => {
  // Hooks
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios.get('http://localhost:7690/api/user/get')
    .then(users => setUsers(users.data))
    .catch(err => console.log(err))
  }, [])


  // Handle
  const handleView = (user) => {
    setSelectedUser(user._id);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleUpdate = (users) => {
    setSelectedUser(users);
    setModalType('update');
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setIsModalOpen(true);
  };


  return (
    <div className='p-4  h-screen bg-gray-200'>
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
            {
            users.map(user => {
              return <tr key={ user._id }>
                <td className="py-3 px-6 text-left">{user.username}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-center flex">
                  <button onClick={() => handleView(users)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                  <button onClick={() => handleUpdate(users)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Update</button>
                  <button onClick={() => handleDelete(users)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
})
}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;

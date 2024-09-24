import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAdmins = async () => {
//       try {
//         const response = await axios.get('/api/admin-accounts');
//         setAdmins(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching admin accounts:', error);
//         setError('Failed to fetch admin accounts. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchAdmins();
//   }, []);

//   if (loading) {
//     return <div className="text-center p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 p-4">{error}</div>;
//   }

  return (
    <div className="p-4 bg-gray-200 h-screen">
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Account List</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin, index) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap border-b">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap border-b">{admin.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap border-b">{admin.email}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {admins.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No admin accounts found.</p>
        )}
        </div>
    </div>    
  );
};

export default AdminList;
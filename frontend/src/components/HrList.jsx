import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HrList = () => {
  const [hrAccounts, setHrAccounts] = useState([]);

  // useEffect(() => {
  //   const fetchHrAccounts = async () => {
  //     try {
  //       const response = await axios.get('/api/hr-accounts');
  //       setHrAccounts(response.data);
  //     } catch (error) {
  //       console.error('Error fetching HR accounts:', error);
  //     }
  //   };
  //
  //   fetchHrAccounts();
  // }, []);

  return (
    <div className="p-4  h-screen bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">HR Account List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">NO.</th>
            <th className="px-4 py-2 border">USERNAME</th>
            <th className="px-4 py-2 border">EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {hrAccounts.length > 0 ? (
            hrAccounts.map((account, index) => (
              <tr key={account.id}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{account.username}</td>
                <td className="px-4 py-2 border">{account.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 border text-center">No HR accounts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HrList;
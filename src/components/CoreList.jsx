import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoreList = () => {
  const [coreAccounts, setCoreAccounts] = useState([]);

  // useEffect(() => {
  //   const fetchCoreAccounts = async () => {
  //     try {
  //       const response = await axios.get('/api/core-accounts');
  //       setCoreAccounts(response.data);
  //     } catch (error) {
  //       console.error('Error fetching CORE accounts:', error);
  //     }
  //   };
  //
  //   fetchCore1Accounts();
  // }, []);

  return (
    <div className="p-4  h-screen bg-gray-200">
      <h2 className="text-2xl font-bold text-black mb-4">Core1 Account List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">NO.</th>
            <th className="px-4 py-2 border">USERNAME</th>
            <th className="px-4 py-2 border">EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {coreAccounts.length > 0 ? (
            coreAccounts.map((account, index) => (
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

export default CoreList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LogisticList = () => {
  const [logisticAccounts, setLogisticAccounts] = useState([]);

  // useEffect(() => {
  //   const fetchLogisticAccounts = async () => {
  //     try {
  //       const response = await axios.get('/api/logistic-accounts');
  //       setLogisticAccounts(response.data);
  //     } catch (error) {
  //       console.error('Error fetching Logistic accounts:', error);
  //     }
  //   };
  //
  //   fetchLogisticAccounts();
  // }, []);

  return (
    <div className="p-4 h-screen bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Logistic Account List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">NO.</th>
            <th className="px-4 py-2 border">USERNAME</th>
            <th className="px-4 py-2 border">EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {logisticAccounts.length > 0 ? (
            logisticAccounts.map((account, index) => (
              <tr key={account.id}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{account.username}</td>
                <td className="px-4 py-2 border">{account.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 border text-center">No Logistic accounts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogisticList;
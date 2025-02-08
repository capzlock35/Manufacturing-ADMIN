import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountList = () => {
  const navigate = useNavigate();

  return (


    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 mb-12 w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-8 mb-10">
          <button
            onClick={() => navigate('/home/AdminList')}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            Admin
          </button>
          <button
            onClick={() => navigate('/home/FinanceList')}
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400"
          >
            Finance
          </button>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <button
            onClick={() => navigate('/home/HrList1')}
            className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-red-400"
          >
            HR
          </button>
          <button
            onClick={() => navigate('/home/CoreList1')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Core
          </button>
          <button
            onClick={() => navigate('/home/LogisticList1')}
            className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-5 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
          >
            Logistic
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountList;

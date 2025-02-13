import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserShield,      // Admin
    FaMoneyBill,        // Finance
    FaUserTie,          // HR
    FaCode,             // Core
    FaTruck,            // Logistic
} from 'react-icons/fa';

const AccountList = () => {
  const navigate = useNavigate();

  const accountTypes = [
    { name: 'Admin', path: '/home/AdminList', icon: FaUserShield, color: 'bg-indigo-500' },
    { name: 'Finance', path: '/home/FinanceList', icon: FaMoneyBill, color: 'bg-green-500' },
    { name: 'HR', path: '/home/HrList1', icon: FaUserTie, color: 'bg-red-500' },
    { name: 'Core', path: '/home/CoreList1', icon: FaCode, color: 'bg-yellow-500' },
    { name: 'Logistic', path: '/home/LogisticList1', icon: FaTruck, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-900 to-black shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-5">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Account Lists</h2>
          <div className="grid grid-cols-3 gap-4">
            {accountTypes.map((button, index) => (
              <button
                key={index}
                onClick={() => navigate(button.path)}
                className={`relative flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-100 transition duration-300 ${button.color} text-white`}
              >
                <div className="flex items-center justify-center">
                  {button.icon && <button.icon className="h-6 w-6" />}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium">{button.name}</h3>  {/* Display button name again */}
                  <p className="text-sm text-gray-200">View Account List</p> {/* Constant text here */}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
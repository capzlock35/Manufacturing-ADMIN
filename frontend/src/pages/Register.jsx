import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserShield,      // Admin
    FaMoneyBill,        // Finance
    FaUserTie,          // HR
    FaCode,             // Core
    FaTruck,            // Logistic
} from 'react-icons/fa'; // or any other icon set

const Register = () => {
  const navigate = useNavigate();

  const buttonData = [
    { path: '/home/FinanceCreate', label: 'Finance', icon: FaMoneyBill, color: 'bg-green-500' },
    { path: '/home/CoreCreate', label: 'Core', icon: FaCode, color: 'bg-yellow-500' },
    { path: '/home/AdminCreate', label: 'Admin', icon: FaUserShield, color: 'bg-indigo-500' },
    { path: '/home/LogisticCreate', label: 'Logistic', icon: FaTruck, color: 'bg-purple-500' },
    { path: '/home/HrCreate', label: 'HR', icon: FaUserTie, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-5">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Account</h2>
          <div className="grid grid-cols-2 gap-4 justify-items-center"> {/* Updated grid layout */}
            {buttonData.map((button, index) => {
              let orderClass = '';
              if (button.label === 'Finance') orderClass = 'order-1';
              if (button.label === 'Core') orderClass = 'order-2';
              if (button.label === 'Admin') orderClass = 'order-3 col-span-2'; // Span both columns
              if (button.label === 'Logistic') orderClass = 'order-4';
              if (button.label === 'HR') orderClass = 'order-5';

              return (
                <button
                  key={index}
                  onClick={() => navigate(button.path)}
                  className={`relative flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-100 transition duration-300 ${button.color} text-white ${orderClass}`}
                >
                  <div className="flex items-center justify-center">
                    <button.icon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-medium">{button.label}</h3>
                    <p className="text-sm text-gray-200">Create a new {button.label.toLowerCase()} account</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
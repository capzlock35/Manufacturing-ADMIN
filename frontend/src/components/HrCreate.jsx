import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; 
import { SlActionUndo } from "react-icons/sl";

const HrCreate = () => {
  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/hrusers'
    : 'http://localhost:7690/api/hrusers';

    const navigate = useNavigate();

    const handleBack = () => {
      navigate('/home/Register'); // Navigate to the /home/Register route
    };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '', // New confirm password field
    role: 'Employee',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/create`, formData); // Use baseURL
      setMessage(response.data.message);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Employee',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <button
          onClick={handleBack}
          className="mb-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          <SlActionUndo  className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Create HR User</h2>

        {message && <div className="bg-green-200 text-green-800 p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* First Name, Last Name, Email, fields here (same as before) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* New Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Role select here (same as before) */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HrCreate;
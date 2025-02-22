import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SlActionUndo } from "react-icons/sl";

const LogisticCreate = () => {
  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/logisticusers'
    : 'http://localhost:7690/api/logisticusers';

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home/Register');
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    date: '',
    address: '',
    city: '',
    age: '',
    condition: '',
    verified: '',
    role: 'pending',
        LogisticLevel: 1, //Set the LogisticLevel at 1 here
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
      const response = await axios.post(`${baseURL}/create`, formData);
      setMessage(response.data.message);
      setFormData({ // Resetting only the necessary form fields
        name: '',
        email: '',
        userName: '',
        password: '',
        confirmPassword: '',
        phone: '',
        date: '',
        address: '',
        city: '',
        age: '',
        condition: '',
        verified: '',
        role: 'pending',
                LogisticLevel: 1, //And also here
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
          <SlActionUndo className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Logistic User</h2>

        {message && <div className="bg-green-200 text-green-800 p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
              User Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="userName"
              type="text"
              name="userName"
              placeholder="User Name"
              value={formData.userName}
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-gray-200 text-black leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              name="date"
              placeholder="Date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              City
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="city"
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="age"
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="condition">
              Condition
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="condition"
              type="text"
              name="condition"
              placeholder="Condition"
              value={formData.condition}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verified">
              Verified
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="verified"
              type="text"
              name="verified"
              placeholder="Verified"
              value={formData.verified}
              onChange={handleChange}
            />
          </div>

          {/* LogisticLevel Select Field */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="LogisticLevel">
              Logistic Level
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
              id="LogisticLevel"
              name="LogisticLevel"
              value={formData.LogisticLevel}
              onChange={handleChange}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

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
              <option value="admin">Admin</option>
              <option value="logistic">Logistic</option>
              <option value="user">User</option>
              <option value="pending">Pending</option>
              <option value="vendorAdmin">VendorAdmin</option>
              <option value="qualityControl">QualityControl</option>
              <option value="superAdmin">SuperAdmin</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default LogisticCreate;
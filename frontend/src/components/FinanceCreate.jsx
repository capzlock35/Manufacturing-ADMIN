// src/components/FinanceCreate.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SlActionUndo } from "react-icons/sl";

const FinanceCreate = () => {
    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/finance'
        : 'http://localhost:7690/api/finance';

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/home/Register'); // Adjust route as needed
    };

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: '',
        role: '',
        image: null,
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
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
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await axios.post(`${baseURL}/create`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message);
            setFormData({
                userName: '',
                password: '',
                confirmPassword: '',
                email: '',
                fullName: '',
                role: '',
                image: null,
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
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Finance User</h2>

                {message && <div className="bg-green-200 text-green-800 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                            id="userName"
                            type="text"
                            name="userName"
                            placeholder="Username"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                            id="role"
                            type="text"
                            name="role"
                            placeholder="Role"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 border-black bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
                            id="image"
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default FinanceCreate;
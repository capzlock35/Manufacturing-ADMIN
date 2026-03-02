import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import jjmLogo from '../assets/jjmlogo.jpg'; // Import JJM logo

const ProfileUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State for Change Password Modal
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [changePasswordMessage, setChangePasswordMessage] = useState("");
    const [changePasswordError, setChangePasswordError] = useState("");


    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            console.log("Token from localStorage:", token); // Check token

            if (!token) {
                console.error("No token found, redirecting to login");
                navigate("/login");
                return;
            }

            try {
                 // Get the userid from localStorage - assumes you store it upon login
                const userId = localStorage.getItem('userid');
                if (!userId) {
                console.error("No userId found in localStorage");
                navigate("/login"); // Redirect to login if no user ID
                    return;
                }

                const response = await axios.get(`${baseURL}/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Profile data:", response.data); // Check response

                setUserData(response.data.user);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

        const calculateAge = (birthday) => {
        if (!birthday) return 'N/A'; // Handle missing birthday
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl border-2 border-black"> {/* Adjust max-w as needed and added black border */}
                    {/* Skeleton Cover Photo */}
                    <div className="h-64 bg-gray-300 animate-pulse"> {/* Increased height */}
                        <Skeleton height="100%" width="100%" />
                    </div>

                    {/* Skeleton Profile Content */}
                    <div className="flex flex-col md:flex-row p-8"> {/* Flex row on medium screens and up */}
                        {/* Skeleton Profile Picture and User Info */}
                        <div className="md:w-1/3 flex flex-col items-center">
                            <div className="w-48 h-48 rounded-full border-4 border-white transform -translate-y-24 bg-gray-300 animate-pulse"> {/* Increased size and translate */}
                                <Skeleton circle height="100%" width="100%" />
                            </div>
                            <div className="text-center mt-4">
                                <Skeleton width={180} height={28} className="mb-2" />
                                <Skeleton width={120} height={20} className="mb-1" />
                                <Skeleton width={100} height={18} />
                            </div>
                        </div>

                        {/* Skeleton Stats and Details */}
                        <div className="md:w-2/3 mt-6 md:mt-0">
                            <div className="w-full mb-4">
                                <Skeleton width={150} height={24} className="mb-2" />
                                <Skeleton width="90%" height={16} className="mb-1" />
                                <Skeleton width="80%" height={16} className="mb-1" />
                                <Skeleton width="95%" height={16} />
                            </div>
                        </div>
                    </div>

                    {/* Skeleton Back to Home Button */}
                    <div className="p-8">
                        <Skeleton height={48} /> {/* Increased height for button */}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!userData) {
        return <p>No user data available.</p>;
    }

    const age = calculateAge(userData.birthday);

    const openChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true);
        setChangePasswordMessage(""); // Clear any previous messages
        setChangePasswordError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    const closeChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setChangePasswordMessage("");
        setChangePasswordError("");

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setChangePasswordError("All fields are required.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setChangePasswordError("New passwords do not match.");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(
                `${baseURL}/change-password`,
                { currentPassword, newPassword, confirmNewPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setChangePasswordMessage(response.data.message);
            setChangePasswordError("");
            // Optionally clear password fields and close modal after successful change
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            // closeChangePasswordModal(); // Decide if you want to close automatically
        } catch (err) {
            console.error("Error changing password:", err);
            setChangePasswordError(err.response?.data?.message || "Failed to change password.");
            setChangePasswordMessage("");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100"> {/* min-h-screen for full height */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl border-2 border-black"> {/* Adjust max-w as needed and added black border */}
                {/* Cover Photo */}
                <div className="h-64 relative">
                      <img
                         src={jjmLogo}
                         alt="JJM Logo"
                         className="w-full h-full object-cover"
                      />
                 </div>

                {/* Profile Content */}
                <div className="flex flex-col md:flex-row p-8">
                    {/* Profile Picture and User Info */}
                    <div className="md:w-1/3 flex flex-col items-center">
                        {/* Profile Picture */}
                        {userData.image && userData.image.secure_url && (
                            <img
                                src={userData.image.secure_url}
                                alt="Profile Picture"
                                className="w-48 h-48 rounded-full border-4 border-white transform -translate-y-24"
                            />
                        )}

                        {/* User Info */}
                        <div className="text-center mt-2 transform -translate-y-24">
                            <p className="text-sm text-gray-500">@{userData.userName}</p>
                            <h1 className="text-3xl font-semibold text-gray-800">{userData.firstName} {userData.lastName}</h1>
                            <p className="text-lg text-gray-600">{userData.role}</p>
                        </div>
                         {/* Change Password Button */}
                         <button
                            onClick={openChangePasswordModal}
                            className="mt-4 py-2 px-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                        >
                            Change Password
                        </button>
                    </div>

                    {/* Stats and Details */}
                    <div className="md:w-2/3 mt-6 md:mt-0">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Details</h2>
                        <p className="text-gray-600">Email: {userData.email}</p>
                        <p className="text-gray-600">Birthday: {userData.birthday} ({age})</p>
                        <p className="text-gray-600">Gender: {userData.gender}</p>
                        <p className="text-gray-600">First Name: {userData.firstName}</p>
                        <p className="text-gray-600">Last Name: {userData.lastName}</p>
                    </div>
                </div>

                {/* Back to Home Button */}
                <div className="p-8">
                    <button
                        onClick={() => navigate("/home")}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Change Password Modal */}
            {isChangePasswordModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                            <div className="mt-2 px-7 py-3">
                                <form onSubmit={handleChangePasswordSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            placeholder="Current Password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            placeholder="New Password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmNewPassword"
                                            placeholder="Confirm New Password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                    </div>

                                    {changePasswordError && <p className="text-red-500 text-xs italic mb-2">{changePasswordError}</p>}
                                    {changePasswordMessage && <p className="text-green-500 text-xs italic mb-2">{changePasswordMessage}</p>}

                                    <div className="flex items-center justify-between">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                            Change Password
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                            onClick={closeChangePasswordModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileUser;
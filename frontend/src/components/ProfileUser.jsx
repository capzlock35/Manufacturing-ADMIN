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
        </div>
    );
};

export default ProfileUser;
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import profilePicture from '../assets/Mole.jpg'; // Adjust the path according to your project structure

const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://backend-admin.jjm-manufacturing.com/api/user'
    : 'http://localhost:7690/api/user';

const ProfileUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false); // State for editing mode
    const [editData, setEditData] = useState({}); // State for holding the editable data

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`${baseURL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data.user);
                setEditData(response.data.user); // Initialize edit data
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const calculateAge = (birthday) => {
        const birthdayDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthdayDate.getFullYear();
        const monthDifference = today.getMonth() - birthdayDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdayDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(`${baseURL}/profile`, editData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUserData(response.data.user); // Update user data
            setIsEditing(false); // Exit editing mode
        } catch (err) {
            console.error("Error updating user data:", err);
            setError("Failed to update user data.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const age = userData.birthday ? calculateAge(userData.birthday) : "N/A";

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10">
            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Profile User</h1>
                
                {/* Profile Picture */}
                <div className="flex justify-center mb-8">
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border border-gray-300"
                    />
                </div>

                {/* User Details */}
                {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div>
                            <label className="text-lg font-semibold text-gray-700">First Name:</label>
                            <input
                                type="text"
                                name="firstname"
                                value={editData.firstname}
                                onChange={handleEditChange}
                                className="border rounded p-2 w-full bg-white text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-semibold text-gray-700">Last Name:</label>
                            <input
                                type="text"
                                name="lastname"
                                value={editData.lastname}
                                onChange={handleEditChange}
                                className="border rounded p-2 w-full bg-white text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-semibold text-gray-700">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={editData.username}
                                onChange={handleEditChange}
                                className="border rounded p-2 w-full bg-white text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-semibold text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                                className="border rounded p-2 w-full bg-white text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-lg font-semibold text-gray-700">Birthday:</label>
                            <input
                                type="date"
                                name="birthday"
                                value={editData.birthday.split("T")[0]} // Format the date input
                                onChange={handleEditChange}
                                className="border rounded p-2 w-full bg-white text-black"
                                required
                            />
                        </div>
                        
                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div>
                            <p className="text-lg font-semibold text-gray-700">First Name:</p>
                            <p className="text-gray-600">{userData.firstname}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Last Name:</p>
                            <p className="text-gray-600">{userData.lastname}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Username:</p>
                            <p className="text-gray-600">{userData.username}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Email:</p>
                            <p className="text-gray-600">{userData.email}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Birthday:</p>
                            <p className="text-gray-600">{userData.birthday}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Age:</p>
                            <p className="text-gray-600">{age}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Gender:</p>
                            <p className="text-gray-600">{userData.gender}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    {!isEditing && (
                        <button
                            className="mt-8 w-full max-w-xs py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
                            onClick={() => setIsEditing(true)} // Switch to edit mode
                        >
                            Edit Profile
                        </button>
                    )}
                    <button
                        className="mt-8 w-full max-w-xs py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition duration-300"
                        onClick={() => navigate("/home")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;

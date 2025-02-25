import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdChatboxes } from "react-icons/io";


import Pic from '../assets/Mole.jpg'; // Default Image
//import Pic from '../assets/jjmlogo.jpg';  // Another one
//import Pic from '../assets/Mole.jpg';
import axios from 'axios';

const Search = () => {
    const navigate = useNavigate();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [userProfile, setUserProfile] = useState(null); // USER DATA

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userid");

            if (!token || !userId) {
                console.error("No token or userId found in localStorage");
                return;
            }

            try {
                const response = await axios.get(`${baseURL}/profile/${userId}`, {  //Fetch the profile
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserProfile(response.data.user); // Sets user profile from Backend
            } catch (err) {
                console.error("Error fetching profile:", err);
                // Set a default image or handle the error as needed
            }
        };

        fetchUserProfile();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid'); // Remove also the user ID
        navigate('/');
        window.location.reload();
    };

    const toggleNotifications = () => {
        setIsNotificationOpen(prev => !prev);
        setHasNewNotifications(false);
    };

    // Use default image if there is something wrong
    const profileImage = userProfile?.image?.secure_url || Pic;

    return (
        <div className='w-full top-0 py-4 px-6 bg-white text-gray-800 shadow-md sticky z-20'>
            <div className='flex items-center justify-between'>
                {/* Sidebar toggle button */}
                <div className="md:hidden flex items-center">
                    <label htmlFor="my-drawer" className="drawer-button">
                        {/* <IoIosMenu size={24}/> */}
                    </label>
                </div>

                {/* Search form */}
                <form action="" className="md:flex flex-grow mx-auto max-w-xl md:max-w-lg sm:max-w-sm min-[500px]:max-w-sm">
                    <div className='relative flex items-center w-full bg-gray-100 border rounded-full shadow-md'>
                        <input
                            type="text"
                            placeholder='Search...'
                            className='w-full p-2 pl-4 pr-12 bg-transparent border-none rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-200 text-black'
                        />
                        <button
                            type='submit'
                            className='absolute right-2 p-2 text-gray-600 hover:text-blue-600 focus:outline-none'
                        >
                            <FaSearch />
                        </button>
                        <div className='absolute right-10 h-5 w-px bg-gray-300'></div>
                    </div>
                </form>

                {/* ICONS at Profile right side */}
                <div className='flex items-center gap-3 md:gap-4'>
                    {/* <Link to="MessageBoard">
                        <IoMdChatboxes className='cursor-pointer text-xl md:text-2xl hover:text-blue-600 text-black' />
                    </Link> */}

                    <MdOutlineDarkMode className='cursor-pointer text-xl md:text-2xl hover:text-blue-600 text-black' aria-label='dark mode' />
                    <div className='relative'>
                        <IoMdNotificationsOutline
                            className='cursor-pointer text-xl md:text-2xl hover:text-blue-600 text-black'
                            aria-label='Notification'
                            onClick={toggleNotifications}
                        />
                        {/* Red dot notification indicator */}
                        {hasNewNotifications && (
                            <span className="absolute right-0 top-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {/* Notification dropdown */}
                        {isNotificationOpen && (
                            <div className='absolute right-0 z-10 mt-2 bg-white rounded-lg shadow-lg w-64'>
                                <ul className='p-2'>
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <li key={notification.id} className='p-2 hover:bg-gray-100 border-b last:border-b-0'>
                                            {notification.message}
                                        </li>
                                    )) : (
                                        <li className='p-2 text-gray-500'>No notifications</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className='relative dropdown dropdown-end'>
                        <img
                            src={profileImage}
                            tabIndex={0}
                            role='button'
                            alt="User Profile"
                            className='rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer border-2 border-gray-300'
                        />
                        {/* Profile drop down */}
                        <ul
                            tabIndex={0}
                            className='dropdown-content menu bg-white rounded-box shadow-lg mt-2 w-40 md:w-48 p-2'
                            aria-label='user menu'
                        >
                            <li>
                                <Link to="/home/profile" className='hover:bg-gray-100 p-2 rounded'>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleSignOut} className='hover:bg-gray-100 p-2 rounded w-full text-left'>
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
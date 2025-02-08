import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import Pic from '../assets/Mole.jpg';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true); // State for notification indicator

  // Sample notifications for an admin dashboard
  const notifications = [
    { id: 1, message: 'New document uploaded: Project Proposal' },
    { id: 2, message: 'Account verification required for User123' },
    { id: 3, message: 'Monthly report is ready for download' },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(prev => !prev);
    setHasNewNotifications(false); // Reset notification state when opened
  };

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
              className='w-full p-2 pl-4 pr-12 text-gray-700 bg-transparent border-none rounded-full focus:outline-none'
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
              src={Pic} 
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
              <Link to="/home/settings" className='hover:bg-gray-100 p-2 rounded'>
                  Settings
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

import React from "react";
import { IoIosMenu } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

import Navbar from "./Navbar";


const Search = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full py-4 px-4 bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Sidebar toggle button */}
        <div className="lg:hidden flex items-center">
          <label htmlFor="my-drawer" className="drawer-button">
            <IoIosMenu size={24} />
          </label>
        </div>
        
        {/* Search form for medium and larger screens */}
        
        {/* Right-side icons and user profile */}
        <div className="flex items-center gap-3 md:gap-4">
          <MdOutlineDarkMode
            className="cursor-pointer text-xl md:text-2xl hover:text-gray-600"
            aria-label="Toggle dark mode"
          />
          <IoMdNotificationsOutline
            className="cursor-pointer text-xl md:text-2xl hover:text-gray-600"
            aria-label="Notifications"
          />
          <div className="relative dropdown dropdown-end">
            <img
              src="https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg"
              tabIndex={0}
              role="button"
              alt="User profile"
              className="rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer border-2 border-gray-300"
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box shadow-lg mt-2 w-40 md:w-48 p-2"
              aria-label="User menu"
            >
              <li>
                <a href="#profile" className="hover:bg-gray-100 p-2 rounded">
                  Profile
                </a>
              </li>
              <li>
                <a href="#settings" className="hover:bg-gray-100 p-2 rounded">
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#logout"
                  onClick={handleLogout}
                  className="hover:bg-gray-100 p-2 rounded"
                >
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Search Form (Hidden) */}
      <form
        method="GET"
        action=""
        className="md:hidden hidden"
      >
        <div className="relative flex items-center w-full bg-white border rounded-full shadow-lg">
          <input
            name="episodequery"
            id="title"
            className="w-full p-2 pl-4 pr-12 border-0 outline-none rounded-full text-gray-700"
            type="text"
            placeholder="Search..."
            aria-label="Search"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 flex items-center px-4 text-white bg-black hover:bg-gray-700 rounded-full"
            aria-label="Search"
          >
            <span className="text-sm font-semibold">Search</span>
          </button>
        </div>
      </form>

      {/* Sidebar */}
      <div className="drawer lg:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="drawer-button hidden">
            <IoIosMenu size={24} />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <Navbar/>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
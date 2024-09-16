import React from 'react'
import { FaSearch } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import Pic from '../assets/Mole.jpg'

const Search = () => {
  return (
    <div className='w-full top-0 py-4 px-4 bg-white text-gray-800 shadow-md sticky z-20'>
      <div className='flex items-center justify-between '>

                {/* Sidebar toggle button */}
        <div className="lg:hidden flex items-center">
          <label htmlFor="my-drawer" className="drawer-button">
              {/* <IoIosMenu size={24}/> */}
          </label>
       </div>
        
        {/* Search form */}
        <form action="" class="md:flex flex-grow mx-auto max-w-xl md:max-w-lg sm:max-w-sm min-[500px]:max-w-sm">
          <div className='relative flex items-center w-full bg-white border rounded-full shadow-lg'>

            <input type="text"
            placeholder='Search...'
            className='w-full p-2 pl-4 pr-12  text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500'/>
            <button 
            type='submit'
            className='absolute right-2 p-2 text-gray-600 hover:text-xl focus:outline-none'
            >
              <FaSearch/>

            </button>
            <div className='absolute right-10 h-5 w-px bg-gray-300'></div>
          </div>
        </form>

        {/* ICONS at Profile right side */}
              <div className='flex items-center gap-3 md:gap-4'> 
          <MdOutlineDarkMode className='cursor-pointer text-xl md:text-2xl hover:text-blue-300 text-black'
            aria-label='dark mode'
          />
          <IoMdNotificationsOutline className='cursor-pointer text-xl md:text-2xl hover:text-blue-300 text-black'
            aria-label='Notification'
          />
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
                <a href="#" className='hover:bg-gray-100 p-2 rounded'>
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className='hover:bg-gray-100 p-2 rounded'>
                  Settings
                </a>
              </li>
              <li>
                <a href="#" onClick={""} className='hover:bg-gray-100 p-2 rounded'>
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>



    </div>
  )
}

export default Search

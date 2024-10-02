import React, { useState } from 'react'
import logo from '../assets/layout.png'
import { Link } from 'react-router-dom';
import { MdOutlineScreenshotMonitor } from 'react-icons/md';
import { FaUser,FaUserFriends } from "react-icons/fa";
import { IoDocuments,IoDocument } from 'react-icons/io5';
import { GoWorkflow } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { PiUsersThreeFill } from "react-icons/pi";
import jjm from "../assets/jjmlogo.jpg"



const Sidebar = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };





















  return (
    <div 
    className={`flex flex-col overflow-y-clip bg-white text-black border-r-2 sticky top-0  transition-all duration-300 ${
      isCollapsed ? "w-20 px-4 py-4" : "w-72 lg:w-80 px-2 py-4"
    } ${isCollapsed ? "md:w-20 px-4 py-4" : "w-52 lg:w-70 px-2 py-4" }`}
    aria-label='Sidebar'
    >
      {/* Toggle Button */}
      <div className='flex justify-end'>
        <button onClick={toggleSidebar} className={`mb-4 p-1 text-base border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200 ${isCollapsed ? "w-11" : "w-11"
        }`}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "▶" : "◀"}
        </button>
      </div>


      {/* Logo */}

        <div className='flex items-center gap-2 cursor-pointer mb-8 justify-center'
        aria-label='Dashboard Logo'
        >
          <img src={jjm} alt="Dashboard logo" className='w-16 h-16' />
          {!isCollapsed && <Link to="/home" className='text-xl font-bold'><p>Dashboard</p></Link>}
        </div>

      {/* Dashboard */}
      <Link to="/home">
        <div className='flex items-center gap-2 hover:bg-gray-300 transition-all duration-300 p-2 rounded-md cursor-pointer'
        aria-label='Dashboard'
        >
          <MdOutlineScreenshotMonitor className='w-5 h-5' />
          {!isCollapsed && <p className='text-sm font-semibold'>Dashboard</p>}
        </div>
      </Link>

      {/* Modules */}
      <div className={`mb-2 space-y-2 ${!isCollapsed ? "overflow-auto" : ""}`} >
        <p className={`bg-gradient-to-r from-green-700 to-green-300 text-transparent bg-clip-text mb-2 font-semibold text-sm text-center ${isCollapsed ? "hidden " : ""
        }`}
        >
          Modules & Features
        </p>

        {/* User Management */}
        <ul className='menu rounded-box w-56'>
          {isCollapsed && <PiUsersThreeFill className='w-5 h-5' />}
          {!isCollapsed && 
            <li>
              <details open>
                <summary><PiUsersThreeFill className='w-5 h-5'/>User Management</summary>
                <ul>
                  <Link to="AdminList"><li className='hover:text-blue-500'><p><FaUserFriends/>Admin List</p></li></Link>

                  <li>
                    <details open>
                      <summary><PiUsersThreeFill className='w-5 h-5'/>HR List</summary>
                        <Link to="HrList1"><li className='hover:text-blue-500'><p><FaUser/>Hr1</p></li></Link>
                        <Link to="HrList2"><li className='hover:text-blue-500'><p><FaUser/>Hr2</p></li></Link>
                        <Link to="HrList3"><li className='hover:text-blue-500'><p><FaUser/>Hr3</p></li></Link>
                        <Link to="HrList4"><li className='hover:text-blue-500'><p><FaUser/>Hr4</p></li></Link>
                    </details>
                  </li>



                  <li>
                    <details open>
                      <summary><PiUsersThreeFill className='w-5 h-5'/>Core List</summary>
                        <Link to="CoreList1"><li className='hover:text-blue-500'><p><FaUser/>Core1</p></li></Link>
                        <Link to="CoreList2"><li className='hover:text-blue-500'><p><FaUser/>Core2</p></li></Link>
                    </details>
                  </li>

                  <li>
                    <details open>
                      <summary><PiUsersThreeFill className='w-5 h-5'/>Logistic List</summary>
                        <Link to="LogisticList1"><li className='hover:text-blue-500'><p><FaUser/>Logistic1</p></li></Link>
                        <Link to="LogisticList2"><li className='hover:text-blue-500'><p><FaUser/>Logistic2</p></li></Link>
                    </details>    
                  </li>

                  <Link to="FinanceList"><li className='hover:text-blue-500'><p><FaUser/>Finance List</p></li></Link>
                </ul>
              </details>
            </li>
          }
        </ul>


        {/* Document Management */}
        <ul className='menu rounded-box w-56'>
          {isCollapsed && <IoDocuments className='w-5 h-5' />}
          {!isCollapsed && 
            <li>
              <details open>
                <summary><IoDocuments className='w-5 h-5'/>Document Management</summary>
                <ul>
                  <Link to="DocumentStorage"><li className='hover:text-blue-500'><p><IoDocument/>DocumentStorage</p></li></Link>
                  <Link to="VersionControl"><li className='hover:text-blue-500'><p><IoDocument/>VersionControl</p></li></Link>
                  <Link to="DocumentTracking"><li className='hover:text-blue-500'><p><IoDocument/>DocumentTracking</p></li></Link>
                </ul>
              </details>
            </li>
          }

        </ul>

        {/* Legal Management */}
        <ul className='menu rounded-box w-56'>
          {isCollapsed && <IoDocumentTextOutline className='w-5 h-5' />}
          {!isCollapsed && 
            <li>
              <details open>
                <summary><IoDocumentTextOutline className='w-5 h-5'/>Legal Management</summary>
                <ul>
                  <Link to=""><li className='hover:text-blue-500'><p><TiDocumentText/>Contract Management</p></li></Link>
                  <Link to=""><li className='hover:text-blue-500'><p><TiDocumentText/>Legal Document</p></li></Link>
                  <Link to=""><li className='hover:text-blue-500'><p><TiDocumentText/>Risk Management</p></li></Link>
                  <Link to=""><li className='hover:text-blue-500'><p><TiDocumentText/>Litigation Management</p></li></Link>
                  <Link to=""><li className='hover:text-blue-500'><p><TiDocumentText/>Compliances and Regulatory</p></li></Link>
                </ul>
              </details>
            </li>
          }

        </ul>

        {/* Initiating Workflow */}
        <ul className='menu rounded-box w-56'>
          {isCollapsed && <GoWorkflow className='w-5 h-5' />}
          {!isCollapsed && 
            <li>
              <details open>
                <summary><GoWorkflow className='w-5 h-5'/>Initiating Workflow</summary>
                <ul>
                  <Link to=""><li className='hover:text-blue-500'><p><MdOutlineCheckBoxOutlineBlank/>Workflow Identification</p></li></Link>
                  <Link to=""><li className='hover:text-blue-500'><p><MdOutlineCheckBoxOutlineBlank/>Communication Plan</p></li></Link>
                  <Link to=""><li className='hover:text-blue-500'><p><MdOutlineCheckBoxOutlineBlank/>Resources Allocation</p></li></Link>
                </ul>
              </details>
            </li>
          }

        </ul>
      </div>
    </div>
  )
}

export default Sidebar
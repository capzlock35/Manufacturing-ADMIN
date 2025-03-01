import React, { useEffect, useState } from 'react';
import logo from '../assets/layout.png';
import { Link } from 'react-router-dom';
import { MdOutlineScreenshotMonitor } from 'react-icons/md';
import { FaUser, FaUserFriends } from "react-icons/fa";
import { IoDocuments, IoDocument } from 'react-icons/io5';
import { GoWorkflow } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { PiUsersThreeFill } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import { FaUserCheck } from "react-icons/fa";

import jjm from "../assets/jjmlogo.jpg";
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/resources'
    : 'http://localhost:7690/api/resources';

const documentBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/documents'
    : 'http://localhost:7690/api/documents';

const productBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/product'
    : 'http://localhost:7690/api/product'; // Added Product Base URL

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hasAnnouncement, setHasAnnouncement] = useState(true);
    const [hasDocumentStorage, setHasDocumentStorage] = useState(true);
    const [resourceCount, setResourceCount] = useState(0);
    const [loadingResourceCount, setLoadingResourceCount] = useState(true);
    const [documentCount, setDocumentCount] = useState(0);
    const [loadingDocumentCount, setLoadingDocumentCount] = useState(true);
    const [productCount, setProductCount] = useState(0); // Added product count
    const [loadingProductCount, setLoadingProductCount] = useState(true); // Added loading state

    useEffect(() => {
        setHasAnnouncement(true);
        setHasDocumentStorage(true);

        fetchResourceCount();
        const intervalId = setInterval(fetchResourceCount, 60000);

        fetchDocumentCount();
        const documentIntervalId = setInterval(fetchDocumentCount, 60000);

        fetchProductCount(); // Fetch product count on mount
        const productIntervalId = setInterval(fetchProductCount, 60000); // Set interval to refetch every minute

        return () => {
            clearInterval(intervalId);
            clearInterval(documentIntervalId);
            clearInterval(productIntervalId); // Clear product interval on unmount
        };
    }, []);

    const fetchResourceCount = async () => {
        setLoadingResourceCount(true);
        try {
            const response = await axios.get(baseURL);
            setResourceCount(response.data.length);
        } catch (error) {
            console.error("Error fetching resource count:", error);
            setResourceCount(0);
        } finally {
            setLoadingResourceCount(false);
        }
    };

    const fetchDocumentCount = async () => {
        setLoadingDocumentCount(true);
        try {
            const response = await axios.get(`${documentBaseURL}/get`);
            setDocumentCount(response.data.length);
        } catch (error) {
            console.error("Error fetching document count:", error);
            setDocumentCount(0);
        } finally {
            setLoadingDocumentCount(false);
        }
    };

    const fetchProductCount = async () => {
        setLoadingProductCount(true);
        try {
            const response = await axios.get(productBaseURL);
            setProductCount(response.data.length);
        } catch (error) {
            console.error("Error fetching product count:", error);
            setProductCount(0);
        } finally {
            setLoadingProductCount(false);
        }
    };

    const markAnnouncementAsSeen = () => {
        setHasAnnouncement(false);
    };

    const markDocumentStorageAsSeen = () => {
        setHasDocumentStorage(false);
    };

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div
            className={`flex flex-col overflow-y-auto bg-white text-black border-r-2 sticky top-0 transition-all duration-300 ${isCollapsed ? "w-20 px-4 py-4" : "w-72 lg:w-80 px-2 py-4"
                }`}
            aria-label='Sidebar'
        >
            {/* Toggle Button */}
            <div className='flex justify-end'>
                <button onClick={toggleSidebar} className={`mb-4 p-1 text-base border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200 ${isCollapsed ? "w-11" : "w-11"}`}
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? "▶" : "◀"}
                </button>
            </div>

            {/* Logo */}
            <div className='flex items-center gap-2 cursor-pointer mb-8 justify-center' aria-label='Dashboard Logo'>
                <img src={jjm} alt="Dashboard logo" className='w-16 h-16' />
                {!isCollapsed && <Link to="/home" className='text-xl font-bold'><p>Dashboard</p></Link>}
            </div>

            {/* Dashboard */}
            <Link to="/home">
                <div className='flex items-center gap-2 hover:bg-gray-300 transition-all duration-300 p-2 rounded-md cursor-pointer' aria-label='Dashboard'>
                    <MdOutlineScreenshotMonitor className='w-5 h-5' />
                    {!isCollapsed && <p className='text-sm font-semibold'>Dashboard</p>}
                </div>
            </Link>

            {/* Modules */}
            <div className={`mb-2 space-y-2 ${!isCollapsed ? "overflow-auto" : ""}`} >
                <p className={`bg-gradient-to-r from-green-700 to-green-300 text-transparent bg-clip-text mb-2 font-semibold text-sm text-center ${isCollapsed ? "hidden" : ""}`}>
                    Modules & Features
                </p>

                {/* Account Management */}
                <ul className='menu rounded-box w-56'>
                    {isCollapsed && <PiUsersThreeFill className='w-5 h-5' />}
                    {!isCollapsed &&
                        <li>
                            <details open> {/*// Remove Open to Close */}
                                <summary><PiUsersThreeFill className='w-5 h-5' />Account Management</summary>
                                <ul>
                                    <Link to="register"><li className='hover:text-blue-500'><p><GrUserAdmin />Create Account</p></li></Link>
                                    <Link to="accountlist"><li className='hover:text-blue-500'><p><FaUserFriends />Accounts</p></li></Link>
                                    <Link to="NewEmployee"><li className='hover:text-blue-500'><p><FaUserCheck />NewEmployee</p></li></Link>
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
                            <details open>  {/*// Remove Open to Close */}
                                <summary><IoDocuments className='w-5 h-5' />Document Management</summary>
                                <ul>
                                    <Link to="DocumentStorage" onClick={markDocumentStorageAsSeen}>
                                        <li className="hover:text-blue-500">
                                            <p className='flex items-center'>
                                                <IoDocument />
                                                Document Storage
                                                {!isCollapsed && (
                                                    loadingDocumentCount ? (
                                                        "..."
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-bold ml-1">
                                                            ({documentCount})
                                                        </span>
                                                    )
                                                )}
                                            </p>
                                        </li>
                                    </Link>

                                    <Link to="VersionControl" onClick={markAnnouncementAsSeen}>
                                        <li className="hover:text-blue-500 relative">
                                            <p className='flex items-center'>
                                                <IoDocument />
                                                VC (Announcement)
                                                {hasAnnouncement && (
                                                    <span className='bg-red-500 h-2 w-2 rounded-full absolute top-2 right-3 ml-2'></span>
                                                )}
                                            </p>
                                        </li>
                                    </Link>
                                    <Link to="Product">
                                        <li className='hover:text-blue-500'>
                                            <p className='flex items-center'>
                                                <IoDocument />
                                                Product
                                                {!isCollapsed && (
                                                    loadingProductCount ? (
                                                        "..."
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-bold ml-1">
                                                            ({productCount})
                                                        </span>
                                                    )
                                                )}
                                            </p>
                                        </li>
                                    </Link>


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
                                <summary><IoDocumentTextOutline className='w-5 h-5' />Legal Management</summary>
                                <ul>
                                <Link to="DocumentHr3"><li className='hover:text-blue-500'><p><TiDocumentText />Document (Hr3)</p></li></Link>
                                    <Link to="ContractManagement"><li className='hover:text-blue-500'><p><TiDocumentText />Contract Management</p></li></Link>
                                    <Link to="RiskManagement"><li className='hover:text-blue-500'><p><TiDocumentText />Risk Management</p></li></Link>

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
                                <summary><GoWorkflow className='w-5 h-5' />Initiating Workflow</summary>
                                <ul>
                                    <Link to="WorkflowIdentification"><li className='hover:text-blue-500'><p><MdOutlineCheckBoxOutlineBlank />Workflow Identification</p></li></Link>
                                    <Link to="CommunicationPlan"><li className='hover:text-blue-500'><p><MdOutlineCheckBoxOutlineBlank />Communication Plan</p></li></Link>
                                    <Link to="ResourcesAllocation">
                                        <li className='hover:text-blue-500'>
                                            <p className='flex items-center'>
                                                <MdOutlineCheckBoxOutlineBlank />
                                                Resources Allocation
                                                {!isCollapsed && (
                                                    loadingResourceCount ? (
                                                        "..."
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-bold ml-1">
                                                            ({resourceCount})
                                                        </span>
                                                    )
                                                )}
                                            </p>
                                        </li>
                                    </Link>

                                </ul>
                            </details>
                        </li>
                    }
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
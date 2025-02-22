import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";

import { CiTrash } from "react-icons/ci";
import { Bell } from 'lucide-react';
import BGAdmin from "../assets/ADMIN.jpg";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    Rectangle,
    AreaChart,
    Area,
} from "recharts";

const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
];

const announcements = [
    { id: 1, title: 'Maintenance Schedule', message: 'Planned maintenance on Production Line A this weekend.' },
    { id: 2, title: 'New Safety Protocol', message: 'Updated safety guidelines for chemical handling.' },
    { id: 3, title: 'Production Milestone', message: 'Reached 1 million units milestone!' }
];

const Dashboard = () => {
    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/product'
        : 'http://localhost:7690/api/product';

    const coreUsersURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/coreusers/get'
        : 'http://localhost:7690/api/coreusers/get';

        const financeURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/finance'
        : 'http://localhost:7690/api/finance';

        const adminURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
        : 'http://localhost:7690/api/adminusers';

        const hrURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/hrusers'
        : 'http://localhost:7690/api/hrusers';

        const logisticURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/logisticusers'
        : 'http://localhost:7690/api/logisticusers';
        

    const authURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
        : 'http://localhost:7690/api/auth/get-token';
        
    const [products, setProducts] = useState([]);
    const [coreUsers, setCoreUsers] = useState([]);
    const [financeUsers, setFinanceUsers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [hrUsers, setHrUsers] = useState([]);
    const [logisticUsers, setLogisticUsers] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(baseURL);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCoreUsers = async () => {
            try {
                const tokenResponse = await axios.get(authURL);
                const token = tokenResponse.data.token;

                if (!token) {
                    console.error("🚨 No token received from backend!");
                    return;
                }

                const response = await axios.get(coreUsersURL, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setCoreUsers(response.data); // Store core users
            } catch (err) {
                console.error("❌ Error fetching core users:", err.response ? err.response.data : err.message);
            }
        };

        
        const fetchFinanceUsers = async () => {
            try {
                // Get token using dynamic authURL
                const tokenResponse = await axios.get(authURL);
                const token = tokenResponse.data.token;
            
                if (!token) {
                  console.error("🚨 No token received from backend!");
                  return;
                }
            
                // Fetch users with authentication
                const response = await axios.get(`${financeURL}/get`, {
                  headers: {
                    Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
                  },
                });
            
                console.log("✅ Backend Response:", response.data);
                setFinanceUsers(response.data);
              } catch (err) {
                console.error("❌ Error fetching users:", err.response ? err.response.data : err.message);
              }
            };

            const fetchAdminUsers = async () => {
                try {
                
                    // Fetch authentication token
                    const tokenResponse = await axios.get(authURL);
                    const token = tokenResponse.data.token;
                
                    if (!token) {
                      console.error("🚨 No token received from backend!");
                      return;
                    }
                
                    // Fetch users with authentication & pagination
                    const response = await axios.get(`${adminURL}/get`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                
                    setAdminUsers(response.data);
                    console.log("✅ Users Fetched:", response.data);
                  } catch (err) {
                    console.error("❌ Error fetching users:", err.response ? err.response.data : err.message);
                  } 
                };

                const fetchHrUsers = async () => {
                    try {
                        // Get token using dynamic authURL
                        const tokenResponse = await axios.get(authURL);
                        const token = tokenResponse.data.token;
                    
                        if (!token) {
                          console.error("🚨 No token received from backend!");
                          return;
                        }
                    
                        // Fetch users with authentication
                        const response = await axios.get(`${hrURL}/get`, {
                          headers: {
                            Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
                          },
                        });
                    
                        console.log("✅ Backend Response:", response.data);
                        setHrUsers(response.data);
                      } catch (err) {
                        console.error("❌ Error fetching users:", err.response ? err.response.data : err.message);
                      }
                    };

                    const fetchLogisticUsers = async () => {
                        try {
                            // Get token using dynamic authURL
                            const tokenResponse = await axios.get(authURL);
                            const token = tokenResponse.data.token;
                        
                            if (!token) {
                              console.error("🚨 No token received from backend!");
                              return;
                            }
                        
                            // Fetch users with authentication
                            const response = await axios.get(`${logisticURL}/get`, {
                              headers: {
                                Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
                              },
                            });
                        
                            console.log("✅ Backend Response:", response.data);
                            setLogisticUsers(response.data);
                          } catch (err) {
                            console.error("❌ Error fetching users:", err.response ? err.response.data : err.message);
                          }
                        };

        fetchProducts();
        fetchCoreUsers();
        fetchFinanceUsers();
        fetchAdminUsers();
        fetchHrUsers();
        fetchLogisticUsers();
    }, []);

    const All =  coreUsers.length + financeUsers.length + hrUsers.length + logisticUsers.length + adminUsers.length;

    const how = adminUsers.length;
    console.log (how);

    return (

        <div className="bg-gray-200 text-black h-auto p-5 bg-cover bg-center" style={{ backgroundImage: `url(${BGAdmin})` }}>
            {/* Overview Section */}
          <div className="p-4 bg-gray-100">
            <p className="font-semibold">Overview</p>

            {/* Cards */}
            <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
                <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 font-semibold text-sm">Revenue</p>
                        <HiOutlineCurrencyDollar className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex gap-3 my-3">
                        <p className="text-3xl font-bold">₱4,560.75</p>
                        <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                            <IoIosArrowUp className="text-green-700" /> 8.2%
                        </p>
                    </div>
                    <div className="my-3">
                        <p className="text-green-700 font-semibold">
                            +₱450.00 <span className="text-gray-500">than last week</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 font-semibold text-sm">Sales</p>
                        <GrMoney className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex gap-3 my-3">
                        <p className="text-3xl font-bold">₱13,890.50</p>
                        <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                            <IoIosArrowUp className="text-green-700" /> 15.5%
                        </p>
                    </div>
                    <div className="my-3">
                        <p className="text-green-700 font-semibold">
                            +32 <span className="text-gray-500">than last week</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 font-semibold text-sm">Customer</p>
                        <MdOutlinePeopleAlt className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex gap-3 my-3">
                        <p className="text-3xl font-bold">1,850</p>
                        <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
                            <IoIosArrowDown className="text-red-700" /> 10.5%
                        </p>
                    </div>
                    <div className="my-3">
                        <p className="text-red-700 font-semibold">
                            -120 <span className="text-gray-500">than last week</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 font-semibold text-sm">Spending</p>
                        <RiPassPendingLine className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex gap-3 my-3">
                        <p className="text-3xl font-bold">₱247.30</p>
                        <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                            <IoIosArrowUp className="text-green-700" /> 7.0%
                        </p>
                    </div>
                    <div className="my-3">
                        <p className="text-green-700 font-semibold">
                            +₱36.50 <span className="text-gray-500">than last week</span>
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 font-semibold text-sm">ACCOUNTS</p>
                        <FaUsers  className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex gap-3 my-3">
                            <p className="text-3xl font-bold">{All}</p> {/* Display Core Users Count */}
                        </div>
                        <div className="my-3">
                             <span className="text-black">IN ALL DEPARTMENTS</span>
                    </div>

                </div>
            </div>

            

            

            {/* Announcements */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
                    <Bell className="h-5 w-5 text-gray-500" />
                </div>
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{announcement.message}</p>
                        </div>
                    ))}
                </div>
            </div>

                        {/* Products Table */}
                        <div className="mt-5 rounded-lg bg-white p-4">
        <h2 className="font-semibold text-black/90 text-xl mb-4 text-center">Products</h2>

        {/* Scrollable container for the table */}
                <div className="overflow-y-auto" style={{ maxHeight: '400px' }}> {/* Adjust maxHeight as needed */}
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Post Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{product.productName}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{product.description}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">₱{product.price}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {product.image && product.image.secure_url && (
                                            <img
                                                src={product.image.secure_url}
                                                alt={product.productName}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {new Date(product.postDate).toLocaleDateString()}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts */}
            <div className="flex gap-4 p-4 overflow-x-auto justify-between">
                <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0 md:flex-1 bg-opacity-50">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </div>

                <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0  md:flex-1 bg-opacity-100">
                    <BarChart
                        width={430}
                        height={300}
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                        <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                    </BarChart>
                </div>
            </div>

            
            <div className="mt-5 bg-white rounded-xl max-md:hidden">
                <AreaChart
                    width={430}
                    height={300}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
            </div>



          </div> 
      </div>
        
        
    );
};

export default Dashboard;
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
    PieChart,
    Pie,      // <--- Ensure Pie is here and spelled correctly
    Cell,
    ResponsiveContainer, // <--- Ensure ResponsiveContainer is here and spelled correctly
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

    const announcementsBaseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/announcements'
        : 'http://localhost:7690/api/announcements';

        const qcMetricsURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/qc/metrics'
        : 'http://localhost:7690/api/qc/metrics';

    const [products, setProducts] = useState([]);
    const [coreUsers, setCoreUsers] = useState([]);
    const [financeUsers, setFinanceUsers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [hrUsers, setHrUsers] = useState([]);
    const [logisticUsers, setLogisticUsers] = useState([]);
    const [adminAnnouncements, setAdminAnnouncements] = useState([]);
    const [qcMetrics, setQcMetrics] = useState({ goodBatches: 0, acceptableBatches: 0, badBatches: 0 });
    const COLORS = ['#00FF00', '#FFEA00', '#ff0000']; // Green, Yellow, Red for Good, Acceptable, Bad

    // REMOVE THESE LINES - No more localStorage for deployed announcements in Dashboard
    // const [displayedAnnouncements, setDisplayedAnnouncements] = useState(() => {
    //     const storedAnnouncements = localStorage.getItem('deployedAnnouncements');
    //     return storedAnnouncements ? JSON.parse(storedAnnouncements) : [];
    // });

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

                        const fetchAdminAnnouncements = async () => {  // Function to fetch admin announcements from database
                            try {
                                const response = await axios.get(announcementsBaseURL); // Use the announcementsBaseURL variable
                                setAdminAnnouncements(response.data);
                            } catch (error) {
                                console.error('Error fetching announcements:', error);
                            }
                        };

                        const fetchQCMetrics = async () => { // Function to fetch QC Metrics
                            try {
                                const response = await axios.get(qcMetricsURL);
                                setQcMetrics(response.data.metrics);
                            } catch (error) {
                                console.error('Error fetching QC Metrics:', error);
                            }
                        };

        fetchProducts();
        fetchCoreUsers();
        fetchFinanceUsers();
        fetchAdminUsers();
        fetchHrUsers();
        fetchLogisticUsers();
        fetchAdminAnnouncements();
        fetchQCMetrics();
    }, []);

    // MODIFIED - Filter deployed announcements directly from adminAnnouncements
    const deployedAnnouncementsData = adminAnnouncements.filter(announcement => announcement.deployed === true);

    const All =  coreUsers.length + financeUsers.length + hrUsers.length + logisticUsers.length + adminUsers.length;

    const how = adminUsers.length;
    console.log (how);

    const pieChartData = [ // Prepare Pie Chart Data
        { name: 'Good', value: qcMetrics.goodBatches },
        { name: 'Acceptable', value: qcMetrics.acceptableBatches },
        { name: 'Bad', value: qcMetrics.badBatches },
    ];

    const barChartData = [ // Bar Chart Data for Quality Status Breakdown
        { name: 'Status', Good: qcMetrics.goodBatches, Acceptable: qcMetrics.acceptableBatches, Bad: qcMetrics.badBatches },
    ];

    return (

        <div className="bg-gray-200 text-black min-h-screen p-5 bg-cover bg-center" style={{ backgroundImage: `url(${BGAdmin})` }}>
            {/* Overview Section */}
          <div className="p-4 bg-gray-100">
            <p className="font-semibold">Overview</p>

            {/* Cards */}
            <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
                {/* <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
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
                </div> */}
                <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 font-semibold text-sm">ACCOUNTS</p>
                        <FaUsers  className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex gap-3 my-3">
                            <p className="text-3xl font-bold">{All}</p>
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
                        {/* Display deployed announcements */}
                        {deployedAnnouncementsData.map((announcement) => ( // NOW using deployedAnnouncementsData correctly
                            <div key={announcement._id} className="border-l-4 border-blue-500 pl-4 py-2">
                                <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{announcement.description}</p>
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
            {/* Charts */}
            <div className="flex gap-4 p-4 overflow-x-auto justify-between mt-4 flex-wrap"> {/* New row for Pie and Area charts */}
                    {/* Pie Chart */}
                    <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0 md:flex-1 bg-opacity-100 w-full md:w-auto">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart> 
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-2">Quality Status Distribution</div>
                    </div>

                    {/* Stacked Area Chart */}
                    <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0 md:flex-1 bg-opacity-100 w-full md:w-auto max-md:hidden"> {/* Adjusted width */}
                        <BarChart
                            width={430}
                            height={300}
                            data={barChartData}  // Changed data to barChartData
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Good" stackId="1" fill={COLORS[0]} />   {/* Changed Area to Bar */}
                            <Bar dataKey="Acceptable" stackId="1" fill={COLORS[1]} /> {/* Changed Area to Bar */}
                            <Bar dataKey="Bad" stackId="1" fill={COLORS[2]} />      {/* Changed Area to Bar */}
                        </BarChart>
                        <div className="text-center mt-2">Quality Status Breakdown (Bar Chart)</div> {/* Updated title */}
                    </div>
                </div>


          </div> 
      </div>
        
        
    );
};

export default Dashboard;
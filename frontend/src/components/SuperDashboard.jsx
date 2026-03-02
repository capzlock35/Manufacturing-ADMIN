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
import { Bell } from 'lucide-react'; // Still imported, but not used in Header anymore
import Logs from '../components/Logs';
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
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
];

const Dashboard = () => {


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


    const qcMetricsURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/qc/metrics'
        : 'http://localhost:7690/api/qc/metrics';


    const [coreUsers, setCoreUsers] = useState([]);
    const [financeUsers, setFinanceUsers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [hrUsers, setHrUsers] = useState([]);
    const [logisticUsers, setLogisticUsers] = useState([]);
    const [qcMetrics, setQcMetrics] = useState({ goodBatches: 0, acceptableBatches: 0, badBatches: 0 });
    const COLORS = ['#22C55E', '#FACC15', '#EF4444'];


    useEffect(() => {


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

                setCoreUsers(response.data);
            } catch (err) {
                console.error("❌ Error fetching core users:", err.response ? err.response.data : err.message);
            }
        };


        const fetchFinanceUsers = async () => {
            try {
                const tokenResponse = await axios.get(authURL);
                const token = tokenResponse.data.token;

                if (!token) {
                    console.error("🚨 No token received from backend!");
                    return;
                }

                const response = await axios.get(`${financeURL}/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

                const tokenResponse = await axios.get(authURL);
                const token = tokenResponse.data.token;

                if (!token) {
                    console.error("🚨 No token received from backend!");
                    return;
                }

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
                const tokenResponse = await axios.get(authURL);
                const token = tokenResponse.data.token;

                if (!token) {
                    console.error("🚨 No token received from backend!");
                    return;
                }

                const response = await axios.get(`${hrURL}/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                const tokenResponse = await axios.get(authURL);
                const token = tokenResponse.data.token;

                if (!token) {
                    console.error("🚨 No token received from backend!");
                    return;
                }

                const response = await axios.get(`${logisticURL}/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("✅ Backend Response:", response.data);
                setLogisticUsers(response.data);
            } catch (err) {
                console.error("❌ Error fetching users:", err.response ? err.response.data : err.message);
            }
        };

        const fetchQCMetrics = async () => {
            try {
                const response = await axios.get(qcMetricsURL);
                setQcMetrics(response.data.metrics);
            } catch (error) {
                console.error('Error fetching QC Metrics:', error);
            }
        };


        fetchCoreUsers();
        fetchFinanceUsers();
        fetchAdminUsers();
        fetchHrUsers();
        fetchLogisticUsers();
        fetchQCMetrics();
    }, []);


    const All = coreUsers.length + financeUsers.length + hrUsers.length + adminUsers.length + logisticUsers.length;


    const pieChartData = [
        { name: 'Good', value: qcMetrics.goodBatches },
        { name: 'Acceptable', value: qcMetrics.acceptableBatches },
        { name: 'Bad', value: qcMetrics.badBatches },
    ];

    const barChartData = [
        { name: 'Status', Good: qcMetrics.goodBatches, Acceptable: qcMetrics.acceptableBatches, Bad: qcMetrics.badBatches },
    ];


    return (

        <div className="bg-gray-50 text-gray-900 min-h-screen p-6 flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">SuperAdmin Dashboard</h2>
                </div>
                {/* Header Right Side - REMOVED Notification and Profile */}
                <div>
                    {/*  No content here now */}
                </div>
            </header>

            {/* Overview Section */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Overview</h3>

                {/* Cards - Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    <div className="bg-indigo-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-600 font-medium text-sm uppercase">Total Accounts</p>
                            <FaUsers className="text-indigo-700 text-xl" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-indigo-900">{All}</p>
                            <span className="text-sm text-gray-500">Accounts</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Across all departments</p>
                    </div>

                    {/* New Card for Core Users */}
                    <div className="bg-purple-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-600 font-medium text-sm uppercase">Core Users</p>
                            <FaUsers className="text-purple-700 text-xl" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-purple-900">{coreUsers.length}</p>
                            <span className="text-sm text-gray-500">Users</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Core department</p>
                    </div>


                    <div className="bg-green-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-600 font-medium text-sm uppercase">Admin Users</p>
                            <MdOutlinePeopleAlt className="text-green-700 text-xl" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-green-900">{adminUsers.length}</p>
                            <span className="text-sm text-gray-500">Users</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Admin department</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-600 font-medium text-sm uppercase">Finance Users</p>
                            <HiOutlineCurrencyDollar className="text-blue-700 text-xl" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-blue-900">{financeUsers.length}</p>
                            <span className="text-sm text-gray-500">Users</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Finance department</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-600 font-medium text-sm uppercase">HR Users</p>
                            <FaUsers className="text-yellow-700 text-xl" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-yellow-900">{hrUsers.length}</p>
                            <span className="text-sm text-gray-500">Users</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">HR department</p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-600 font-medium text-sm uppercase">Logistic Users</p>
                            <FaUsers className="text-red-700 text-xl" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-red-900">{logisticUsers.length}</p>
                            <span className="text-sm text-gray-500">Users</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Logistic department</p>
                    </div>


                </div>


                {/* Quality Chart Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Quality Metrics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="text-center mt-2 text-sm text-gray-700">Quality Status Distribution</div>
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={barChartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Good" stackId="a" fill={COLORS[0]} />
                                    <Bar dataKey="Acceptable" stackId="a" fill={COLORS[1]} />
                                    <Bar dataKey="Bad" stackId="a" fill={COLORS[2]} />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="text-center mt-2 text-sm text-gray-700">Quality Status Breakdown</div>
                        </div>
                    </div>
                </div>


                {/* Login Logs Table */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Login Logs</h3>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <Logs />
                    </div>
                </div>

            </section>
        </div>


    );
};

export default Dashboard;
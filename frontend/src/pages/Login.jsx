import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import {toast} from "react-hot-toast"
import BGAdmin from "../assets/ADMIN.jpg"
import JJM from "../assets/jjmlogo.jpg"

const Login = () => {

    // HOOKS
    const [user, setUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    

    const navigate = useNavigate();

    // Determine base URL dynamically based on the environment
const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://backend-admin.jjm-manufacturing.com/api/user'
    : 'http://localhost:7690/api/user';

useEffect(() => {
    fetchUsers();
}, []);

useEffect(() => {
}, [user]);

const fetchUsers = () => {
    axios
        .get(`${baseURL}/get`) // Corrected: Use /get directly
        .then((res) => {
            setUsers(res.data); // Update user data if needed
        })
        .catch((error) => console.error("Error fetching users:", error));
};

// Handle form submission
const handleLogin = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post(`${baseURL}/login`, { email, password }); 
        console.log("Login response:", response.data);

        const { token, role } = response.data; // Destructure token and role
        toast.success('Login successful'); // Show toast for successful login

        setEmail('');  // Reset email field
        setPassword('');  // Reset password field

        // Save token and role to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Check for valid role (either 'admin' or 'staff')
        if (role === 'staff' || role === 'admin') {
            window.location.href = '/home';  // Redirect to home for staff or admin
        } else {
            // Unauthorized role
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            toast.error('Unauthorized role');  // Show toast for unauthorized role
        }
    } catch (error) {
        console.error('Login failed:', error.response?.data?.error || error.message);
        toast.error('Login failed');  // Show toast for failed login
    }
};


    return (
        <div className="bg-white h-screen w-full">
            <div className='flex justify-center items-center min-h-screen hero bg-cover bg-center' 
              style={{
                backgroundImage: `url(${BGAdmin})`
              }}
            >
                <div className='flex w-full hero-content bg-gray-100 bg-opacity-80'>
                    <div className='card w-[600px] border border-zinc-600 shadow-2xl rounded-lg p-3'>
                        <form onSubmit={handleLogin} className='card-body'>
                            <h1 className='flex items-center justify-center text-8xl font-extrabold text-black leading-none md:hidden sd:hidden'>
                            <img src={JJM} alt="JJM Logo" className="w-20 h-20" />
                                <MdAdminPanelSettings />
                                <span className='bg-gradient-to-l from-gray-400 to-gray-800 text-transparent bg-clip-text'>ADMIN</span>
                            </h1>
                            <h1 className='text-lg text-center font-bold text-black mb-4 leading-none'>LOGIN</h1>
                            <div className='flex flex-col'>
                                {/* Display error message */}
                                {error && <p className='text-red-500'>{error}</p>}
                                
                                {/* Email */}
                                <label className='label'>
                                    <span className='label-text font-semibold text-lg text-gray-500'>Email</span>
                                </label>
                                <div className='relative mb-2'>
                                    <input
                                        className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-200 text-black'
                                        type='text'
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                </div>

                                {/* Password */}
                                <div className='relative'>
                                    <div className='form-control mb-6'>
                                        <label className='label'>
                                            <span className='label-text font-semibold text-lg text-gray-500'>Password</span>
                                        </label>
                                        <input
                                            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-200 text-black'
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                        />
                                        <FaLock className='absolute left-3 top-14 transform translate-y-1 text-gray-500' />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute inset-y-0 right-0 flex items-center px-3 top-6 text-xl'
                                        >
                                            {showPassword ? <FaEyeSlash className='text-red-500' /> : <FaEye className='text-blue-500' />}
                                        </button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <div className='form-control'>
                                    <button className='btn btn-primary w-full py-2 text-lg font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded-lg' type="submit">
                                        LOGIN
                                    </button>
                                </div>
                                {/* <span className='text-center mt-4'>
                                    <Link to="/register" className='text-blue-500 hover:underline'>
                                        Create Account
                                    </Link>
                                </span> */}
                            </div>
                        </form>
                    </div>

                    {/* Right side text */}
                    <div className='text-center lg:text-lg w-full hidden lg:flex flex-col md:flex md:flex-col'>
                        <h1 className='flex items-center justify-center text-8xl font-extrabold text-black leading-none'>
                        <img src={JJM} alt="JJM Logo" className="w-20 h-20" />
                            <MdAdminPanelSettings />
                            <span className='bg-gradient-to-l from-gray-400 to-gray-800 text-transparent bg-clip-text'>ADMIN</span>
                        </h1>
                        <p className='py-6 text-2xl text-gray-900 font-bold'>
                            JJM SOAP AND DETERGENTS MANUFACTURING.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

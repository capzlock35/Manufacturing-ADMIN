import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";











const Login = () => {

    // HOOKS
    const [username, setUsername] = useState("");
    const [passowrd, setPassword] = useState("");
    // const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
      }, [])
    
      const fetchUsers = () => {
        axios
        .get('http://localhost:8000/register')
        .then((res) => {
          
        })
      }

    // Handle subm.
    const handleLogin = (e) => {
        e.prevetDefault();



        // ....
    }










  return (
    <>

            {/* 1st Div Website  */}   {/*2nd Div Container */} {/*3rd Div Login Container*/}
        <div className='flex justify-center items-center min-h-screen hero bg-white'>
            <div className='flex w-full hero-content bg-gray-100'>
                <div className='card w-[600px] border border-red-600 shadow-2xl rounded-lg p-3'>
                    <form onSubmit={handleLogin} className='card-body'>
                        <h1 className='text-lg text-center font-bold text-black mb-4 leading-none'>LOGIN</h1>
                        <div className='flex flex-col'>

                            {/* Display error message */}
                            {error && <p className='text-red-500'>{error}</p>}

                                                    {/* Username */}
                            <label className='label'>
                                <span className='label-text font-semibold text-lg text-gray-500'>Username</span>
                            </label>
                            <div className='relative mb-2'>
                            <input type="text"
                            placeholder='Enter Your Username'
                            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border-red-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-200' 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                            <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'/>
                            </div>
                            
                                                    {/* Password */}
                                <div className='relative'>
                                    <div className='form-control mb-6'>
                                        <label className='label mb-2'>
                                            <span className='label-text font-semibold text-lg text-gray-500'>Password</span>
                                        </label>
                                        <input type="passowrd"
                                        placeholder='Enter Your Password'
                                        className='input input-bordered w-full py-3 pl-10 pr-4 text-lg
                                        border-red-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-200'
                                        value={passowrd}
                                        onChange={(e) => setPassword(e.target.value)} />
                                        <FaLock className='absolute left-3 top-1/2 transform translate-y-1/2 text-gray-500' />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 top-7 text-xl"
                                        >
                                            {showPassword ? <FaEyeSlash className='text-red-500'/> : <FaEye className='text-blue-500'/>}
                                        </button>
                                    </div>
                                </div>

                                
                                                    {/* BTN */}
                                                    <div className='form-control'>
                                        <button className='btn btn-primary w-full py-2 text-lg font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded-lg' type="submit" > LOGIN
                                        </button>
                                    </div>
                                    <span className='text-center mt-4'>
                                       <Link to="/register" className='text-blue-500 hover:underline'>
                                        Create Account </Link>
                                    </span>
                        </div>
                    </form>
                </div>

                                                    {/* TEXT RIGHT SIDE */}

                        <div className='text-center lg:text-lg w-full '>
                            
                            <h1 
                            className=' flex items-center justify-center text-8xl font-extrabold text-black leading-none'> 
                            <MdAdminPanelSettings /> 
                            <span 
                            className='bg-gradient-to-l from-gray-400 to-gray-800 text-transparent bg-clip-text'>
                                ADMIN</span>
                            </h1>
                            <p className='py-6 text-2xl text-gray-900 font-bold'>
                                Login to access you account.
                            </p>
                        </div>
                        
            </div>
        </div>
    </>
  )
}

export default Login

import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";


const Register = () => {


  //Hooks
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");





















  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p7'>
      <div className='w-[600px] p-6 bg-white rounded-lg shadow-lg border border-zinc-500'>
        <h2 className='text-2xl font-bold text-center mb-6 text-black'>Create Account</h2>
        <form onSubmit={""} className='space-y-4'>

                  {/* E-mail */}
          <div className='space-y-1 relative'>
            <label htmlFor="email" className='block text-md font-medium pl-2 text-gray-700'>
              E-mail
            </label>
            <input type='email' id='email'
            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border border-zinc-500 bg-white focus:border-blue-500 text-black'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
            <MdEmail size={24} className='absolute left-3 top-6 transform translate-y-1/2 text-gray-500 '/>
          </div>

                  {/* Username */}
          <div className='space-y-1 relative'>
            <label htmlFor="username" className='block text-md font-medium pl-2 text-gray-700'>
              Username
            </label>
            <input type='text' id='username'
            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required/>
            <FaUser size={20} className='absolute left-3 top-7 transform translate-y-1/2 text-gray-500'/>
          </div>

                  {/* Password */}
          <div className='space-y-1 relative'>
            <label htmlFor="password" className='block text-md font-medium pl-2 text-gray-700'>
              Password
            </label>
            <input type={showPassword ? "text" : "password"} 
            id='password'
            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
            <FaLock size={20} className='absolute left-3 top-7 transform translate-y-1/2 text-gray-500'
            />
            <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 flex items-center px-3 top-6 text-xl'>
              {showPassword ? <FaEyeSlash className='text-red-500'/> : 
              <FaEye className='text-blue-500' />}
            </button>
            
          </div>


                    {/* Confirm Password */}
          <div className='space-y-1 relative'>
            <label htmlFor="confirmpassword" className='block text-md font-medium pl-2 text-gray-700'>
              Confirm Password
            </label>
            <input type={showConfirmPassword ? "text" : "password"} 
            id='confirmpassword'
            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required/>
            <FaLock size={20} className='absolute left-3 top-7 transform translate-y-1/2 text-gray-500'
            />
            <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute inset-y-0 flex items-center right-0 px-3 top-6 text-xl'
            >
              {showConfirmPassword ? <FaEyeSlash className='text-red-500'/> : 
              <FaEye className='text-blue-500'/>}

            </button>

          </div>






          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>

          <span className=' flex justify-center mt-4'>
            <Link to="/login" className='text-blue-500 hover:underline'>
            Back to Login</Link>
          </span>



        </form>
        
      </div>

    </div>
  )
}

export default Register

import React, { useState, useEffect } from 'react'
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdOutlinePermIdentity } from "react-icons/md";
import { MdOutlineCake } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { MdWork } from "react-icons/md";
import { useNavigate } from "react-router-dom"
import {toast} from "react-hot-toast"
import axios from 'axios'
import { SlActionUndo } from "react-icons/sl";


const AdminCreate = () => {


  const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://backend-admin.jjm-manufacturing.com/api/user'
  : 'http://localhost:7690/api/user';

  //Hooks
  const [user, setUsers] = useState([])
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate()

  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");


const handleBack = () => {
   navigate('/home/Register'); // Navigate to the /home/Register route
};


  const departments = [
    "admin",
    "finance",
    "core 1",
    "core 2",
    "logistic 1",
    "logistic 2",
    "hr 1",
    "hr 2",
    "hr 3",
    "hr 4"
  ];
  
  // Get role options based on selected department
  const getRoleOptions = (dept) => {
    if (dept === "admin") {
      return ["admin", "staff"];
    }
    return ["employee", "manager"];
  };

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = () => {
    axios
      .get(`${baseURL}/get`)
      .then((res) => {
        setUsers(res.data); // Assuming res.data contains the list of users
      })
      .catch((error) => {
        toast.error("Failed to fetch users");
      });
  };


  // const fetchUsers = () => {
  //   axios
  //   .get('http://localhost:7690/api/user/get')
  //   .then((res) => {
      
  //   })
  // }

const handlecreateUser = (event) => {
  event.preventDefault();

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    toast.error('Password and Confirm Password do not match');
    return; // Stop the function if passwords do not match
  }

  axios
    .post(`${baseURL}/create`, { firstname, lastname, birthday, gender, email, username, password, role, department })
    .then(() => {
      toast.success('Registration is Complete');
      setFirstName('');
      setLastName('');
      setBirthday('');
      setGender('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setDepartment('');
      setRole('');
      fetchUsers();
      navigate('/home/register');
    })
    .catch((error) => {
      toast.error('Unable to register user');
    });
};

  









  return (
 
      <div className='flex items-center justify-center min-h-screen bg-gray-100 p-7 '>
        <div className='w-full lg:w-[600px] md:w-[600px] p-6 bg-white rounded-lg shadow-lg border border-zinc-500'>
            <button
              onClick={handleBack}
              className="mb-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
             >
              <SlActionUndo  className="mr-2" />
              Back
            </button>
          <h2 className='text-2xl font-bold text-center mb-6 text-black'>Create Account</h2>
          <form onSubmit={handlecreateUser} className='space-y-4'>

                    {/* FirstName and Lastname */}
              <div className='space-y-1 relative flex flex-col'>
                <div className='flex space-x-4'>
                  <div className='relative flex flex-col w-1/2'>
                    <label htmlFor="firstname" className='font-medium pl-2 text-gray-700'>
                      First Name
                    </label>
                    <input 
                      type="text" 
                      className='input input-bordered py-3 pl-10 pr-4 text-lg border border-zinc-500 bg-white focus:border-blue-500 text-black'
                      value={firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <MdOutlinePermIdentity size={24} className='absolute left-3 top-6 transform translate-y-1/2 text-gray-500' />
                  </div>
                  
                  <div className='relative flex flex-col w-1/2'>
                    <label htmlFor="lastname" className='font-medium pl-2 text-gray-700'>
                      Last Name
                    </label>
                    <input 
                      type="text"  
                      className='input input-bordered py-3 pl-10 pr-4 text-lg border border-zinc-500 bg-white focus:border-blue-500 text-black'
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <MdOutlinePermIdentity size={24} className='absolute left-3 top-6 transform translate-y-1/2 text-gray-500' />
                  </div>
                </div>
              </div>


              

                    {/* Birthday Input */}
              <div className='relative flex flex-col'>
                <label htmlFor="birthday" className='font-medium pl-2 text-gray-700'>
                  Birthday
                </label>
                <input 
                  type="date"  
                  className='input input-bordered py-3 pl-10 pr-4 text-lg border border-zinc-500 bg-white focus:border-blue-500 text-black'
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  required
                />
                <MdOutlineCake size={24} className='absolute left-3 top-6 transform translate-y-1/2 text-gray-500'/>
              </div>



              {/* Gender Selection */}
              <div className='relative flex flex-col'>
                <label className='font-medium pl-2 text-gray-700 text-center'>
                  Gender
                </label>
                <div className='flex space-x-4 justify-evenly'>
                  <div className='flex items-center'>
                    <input type="radio"
                    name='gender'
                    value="male"
                    className='mr-2'
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)} 
                    />
                    <label htmlFor="male" className='text-gray-700'>Male</label>
                  </div>
                  <div className='flex items-center'>
                    <input type="radio"
                    name='gender'
                    value="female"
                    className='mr-2'
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="female" className='text--700'>Female</label>
                  </div>
                  <div className='flex items-center'>
                    <input type="radio"
                    name='gender'
                    value="others"
                    className='mr-2'
                    checked={gender === "others"}
                    onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="others" className='text--700'>others</label>
                  </div>
                </div>
              </div>
              

              


                    {/* E-mail */}
            <div className='space-y-1 relative'>
              <label htmlFor="email" className='block text-md font-medium pl-2 text-gray-700'>
                E-mail
              </label>
              <input className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
                            type='text' 
                            placeholder="Email" 
                            value={email} onChange={(e) => setEmail(e.target.value)} />
              <MdEmail size={24} className='absolute left-3 top-6 transform translate-y-1/2 text-gray-500 '/>
            </div>

                    {/* Username */}
            <div className='space-y-1 relative'>
              <label htmlFor="username" className='block text-md font-medium pl-2 text-gray-700'>
                Username
              </label>
              <input className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
                            type='text' 
                            placeholder="Username" 
                            value={username} onChange={(e) => setUsername(e.target.value)} />
              <FaUser size={20} className='absolute left-3 top-7 transform translate-y-1/2 text-gray-500'/>
            </div>

                    {/* Password */}
            <div className='space-y-1 relative'>
              <label htmlFor="password" className='block text-md font-medium pl-2 text-gray-700'>
                Password
              </label>
              <input className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} onChange={(e) => setPassword(e.target.value)} />
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
              <input className='input input-bordered w-full py-3 pl-10 pr-4 text-lg text-black border border-zinc-500 bg-white focus:border-blue-500'
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirmpassword" 
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

          {/* Department Selection */}
          <div className='relative flex flex-col'>
            <label htmlFor="department" className='font-medium pl-2 text-gray-700'>
              Department
            </label>
            <div className='relative'>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setRole(''); // Reset role when department changes
                }}
                className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border border-zinc-500 bg-white focus:border-blue-500 text-black'
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </option>
                ))}
              </select>
              <MdBusinessCenter size={24} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'/>
            </div>
          </div>

                    {/* Role Selection */}
                    <div className='relative flex flex-col'>
            <label htmlFor="role" className='font-medium pl-2 text-gray-700'>
              Role
            </label>
            <div className='relative'>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border border-zinc-500 bg-white focus:border-blue-500 text-black'
                required
                disabled={!department} // Disable until department is selected
              >
                <option value="">Select Role</option>
                {department && getRoleOptions(department).map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </option>
              ))}
            </select>
            <MdWork size={24} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'/>
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-center'>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default AdminCreate;
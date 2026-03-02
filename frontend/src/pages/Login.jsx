import React, { useState, useRef } from "react"; // Import useRef
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { toast } from "react-hot-toast";
import BGAdmin from "../assets/ADMIN.jpg";
import JJM from "../assets/jjmlogo.jpg";
import ReCAPTCHA from 'react-google-recaptcha'; // <-- Import ReCAPTCHA

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // For displaying general form errors
    const [showPassword, setShowPassword] = useState(false);
    const [gRecaptchaResponse, setGRecaptchaResponse] = useState(null); // <-- State for reCAPTCHA token
    const recaptchaRef = useRef(null); // <-- Ref for reCAPTCHA instance
    const navigate = useNavigate();

    // --- Hardcoded Site Key (Temporary Solution for Testing) ---
    // Replace this with reading from import.meta.env.VITE_RECAPTCHA_SITE_KEY later

    // Double-check this line *very* carefully after pasting
const recaptchaSiteKey = '6LdZnPwqAAAAAHYqb8aeMWacv80db2Qll9nG_rAZ';
    // --- End Hardcoded Site Key ---

    // --- Use Vite's way to check environment mode ---
    const baseURL = import.meta.env.MODE === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers' // Your production backend URL
        : 'http://localhost:7690/api/adminusers'; // Your development backend URL
    // --- End Environment Check ---




    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous errors display

        // --- Check if reCAPTCHA is solved ---
        if (!gRecaptchaResponse) {
             toast.error('Please complete the reCAPTCHA challenge.');
             setError('Please complete the reCAPTCHA challenge.'); // Also set form error if desired
             return; // Prevent submission
        }

        try {
            console.log("Attempting login with email:", email); // Log attempt start
            const response = await axios.post(`${baseURL}/login`, {
                email,
                password,
                recaptchaToken: gRecaptchaResponse, // <-- Send the token
            });
            console.log("Login response:", response.data); // Log success response

            const { token, role, userid, userName } = response.data;
            toast.success('Login successful'); // Toast on success

            // Clear form and state
            setEmail('');
            setPassword('');
            setError("");
            setGRecaptchaResponse(null); // Clear token state
            recaptchaRef.current?.reset(); // Reset reCAPTCHA widget visually

            // Store credentials
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userid', userid);
            localStorage.setItem('userName', userName);

            // Redirect based on role
            if (role === 'staff' || role === 'admin' || role === 'superadmin') {
                 window.location.href = '/home'; // Consider using navigate('/home') for SPA behavior
            } else {
                // This case should ideally be caught by backend role check, but good failsafe
                localStorage.clear(); // Clear all local storage on unexpected authorized role
                toast.error('Login succeeded but role is unauthorized.');
                setError('Unauthorized role.');
            }

        } catch (error) {
            // --- Handle Errors ---
            let errorMessage = 'Login failed. Please check credentials or reCAPTCHA.'; // Default
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Login failed - Server Response:', error.response.data);
                console.error('Login failed - Status Code:', error.response.status);
                errorMessage = error.response.data?.error || errorMessage; // Use backend error message if available

                // Specific handling for inactive account based on backend message
                if (errorMessage.includes("Account is Inactive")) {
                   toast.error(errorMessage); // Show specific inactive toast
                } else if (errorMessage.includes("reCAPTCHA")) {
                    toast.error(errorMessage); // Show specific reCAPTCHA error toast
                } else {
                    toast.error("Invalid credentials or other error."); // Generic toast for other failures (e.g., 401)
                }
                setError(errorMessage); // Set form error display

            } else if (error.request) {
                // The request was made but no response was received
                console.error('Login failed - No Response:', error.request);
                errorMessage = 'Network error. Could not reach server.';
                toast.error(errorMessage);
                setError(errorMessage);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Login failed - Request Setup Error:', error.message);
                errorMessage = 'An error occurred during the login request.';
                toast.error(errorMessage);
                setError(errorMessage);
            }

            // Reset reCAPTCHA on *any* failed login attempt
            setGRecaptchaResponse(null);
            if (recaptchaRef.current) {
                 recaptchaRef.current.reset();
            }
        }
    };

    // --- reCAPTCHA Handlers ---
    const onChangeRecaptcha = (token) => {
        console.log("reCAPTCHA Token obtained.");
        setGRecaptchaResponse(token);
        setError(""); // Clear potential "please complete recaptcha" error
    };

    const onExpiredRecaptcha = () => {
        console.log("reCAPTCHA token expired");
        setGRecaptchaResponse(null);
        toast.error('reCAPTCHA expired. Please solve it again.');
        setError('reCAPTCHA expired. Please solve it again.');
    };

     const onErrorRecaptcha = () => {
         console.error("reCAPTCHA loading error");
         setGRecaptchaResponse(null); // Ensure response is null on error
         toast.error('Error loading reCAPTCHA. Please refresh the page.');
         setError('Error loading reCAPTCHA. Check your connection or refresh.');
     };
    // --- End reCAPTCHA Handlers ---


    return (
        <div className="bg-white h-screen w-full">
            <div className='flex justify-center items-center min-h-screen hero bg-cover bg-center'
                style={{ backgroundImage: `url(${BGAdmin})` }}
            >
                <div className='flex w-full hero-content bg-gray-100 bg-opacity-80'>

                    {/* Login Form */}
                    <div className='card w-[600px] border border-zinc-600 shadow-2xl rounded-lg p-3'>
                        <form onSubmit={handleLogin} className='card-body'>
                            {/* ... (Heading remains the same) ... */}
                            <h1 className='flex items-center justify-center text-8xl font-extrabold text-black leading-none md:hidden sd:hidden'>
                                <img src={JJM} alt="JJM Logo" className="w-20 h-20" />
                                <MdAdminPanelSettings />
                                <span className='bg-gradient-to-l from-gray-400 to-gray-800 text-transparent bg-clip-text'>ADMIN</span>
                            </h1>
                            <h1 className='text-lg text-center font-bold text-black mb-4 leading-none'>LOGIN</h1>
                            <div className='flex flex-col'>
                                {error && <p className='text-red-500 text-center mb-2 text-sm'>{error}</p>} {/* Display form error */}

                                {/* Email Input (remains the same) */}
                                <label className='label'>
                                    <span className='label-text font-semibold text-lg text-gray-500'>Email</span>
                                </label>
                                <div className='relative mb-2'>
                                    <input
                                        className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border-zinc-500 rounded-lg bg-gray-200 text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                        type='text' // Consider type='email' for basic validation
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                    <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                </div>

                                {/* Password Input (remains the same) */}
                                <div className='relative'>
                                    <div className='form-control mb-6'>
                                        <label className='label'>
                                            <span className='label-text font-semibold text-lg text-gray-500'>Password</span>
                                        </label>
                                        <input
                                            className='input input-bordered w-full py-3 pl-10 pr-4 text-lg border-zinc-500 rounded-lg bg-gray-200 text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                            autoComplete="current-password"
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

                                {/* --- Google reCAPTCHA v2 Component --- */}
                                <div className="flex justify-center mb-4">
                                    {recaptchaSiteKey ? ( // This check should always be true now
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={recaptchaSiteKey} // Use the hardcoded key
                                            onChange={onChangeRecaptcha}
                                            onExpired={onExpiredRecaptcha}
                                            onError={onErrorRecaptcha}
                                            theme="light" // Optional: 'light' or 'dark'
                                        />
                                    ) : (
                                        // This should technically not be reachable if key is hardcoded
                                        <p className="text-red-500 text-sm">reCAPTCHA Site Key is missing.</p>
                                    )}
                                </div>
                                {/* --- End Google reCAPTCHA --- */}


                                {/* Login Button */}
                                <div className='form-control mt-4'>
                                    <button
                                        className={`btn btn-primary w-full py-2 text-lg font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-opacity duration-200 ${!gRecaptchaResponse || !recaptchaSiteKey ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                                        type="submit"
                                        disabled={!gRecaptchaResponse || !recaptchaSiteKey} // <-- Disable if no token or no site key
                                    >
                                        LOGIN
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right side text (keep as is) */}
                    <div className='text-center lg:text-lg w-full hidden lg:flex flex-col md:flex md:flex-col'>
                        <h1 className='flex items-center justify-center text-8xl font-extrabold text-black leading-none'>
                            <img src={JJM} alt="JJM Logo" className="w-20 h-20" />
                            <MdAdminPanelSettings />
                            <span className='bg-gradient-to-l from-gray-400 to-gray-800 text-transparent bg-clip-text'>ADMIN</span>
                        </h1>
                        <p className='py-6 text-2xl text-gray-900 font-bold'>
                            JJM SOAP AND DETERGENTS MANUFACTURING.
                        </p>
                        <p className=' text-2xl text-gray-900 font-bold'>
                            Basta Best Quality and Best Brand JJM na Yan!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
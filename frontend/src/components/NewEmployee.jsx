import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoMdArrowRoundBack } from "react-icons/io"; // Added for Cancel button
import { FiEyeOff, FiEye, FiLock, FiUnlock } from "react-icons/fi"; // Icons for blur and PIN

// --- Define the required PIN ---
const REQUIRED_PIN = "#JJM2025";

const NewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(true); // <-- State for blur on modal content
  const [showPinPrompt, setShowPinPrompt] = useState(false); // <-- State for PIN prompt
  const [pinInput, setPinInput] = useState('');             // <-- State for PIN input
  const [pinError, setPinError] = useState(null);           // <-- State for PIN error
  const [targetEmployee, setTargetEmployee] = useState(null); // <-- Temp store employee before PIN

  const pinInputRef = useRef(null); // Ref for focusing PIN input
  const modalContentRef = useRef(null); // Ref for blurred content

  const API_BASE_URL = process.env.NODE_ENV === 'production'
      ? 'https://backend-admin.jjm-manufacturing.com/api'
      : 'http://localhost:7690/api';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/hr2-employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees from backend:", error);
      alert("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Focus PIN input when prompt appears
  useEffect(() => {
    if (showPinPrompt && pinInputRef.current) {
        pinInputRef.current.focus();
    }
  }, [showPinPrompt]);

  // Triggered when user clicks 'View' in the list
  const handleViewClick = (employee) => {
    setTargetEmployee(employee); // Store intended employee
    setPinInput('');             // Clear previous PIN input
    setPinError(null);           // Clear previous PIN error
    setShowPinPrompt(true);      // Show the PIN prompt
    setIsBlurred(true);          // Ensure modal starts blurred AFTER PIN
    console.log("Requesting view for employee:", employee.fullname);
  };

  // Handles closing the modal/detailed view AND the PIN prompt
  const handleClose = () => {
    setSelectedEmployee(null);
    setTargetEmployee(null);   // Clear target employee
    setShowPinPrompt(false);   // Hide PIN prompt
    setPinInput('');           // Clear PIN input
    setPinError(null);         // Clear PIN error
    setIsBlurred(true);        // Reset blur for next time
  };

  // Verify the entered PIN
  const handlePinSubmit = (event) => {
    event.preventDefault();
    if (pinInput === REQUIRED_PIN) {
      setSelectedEmployee(targetEmployee); // Set the actual employee to view
      setShowPinPrompt(false);             // Hide prompt
      setPinError(null);                   // Clear error
      // isBlurred is already true, modal will render blurred
      console.log("PIN Verified for:", targetEmployee?.fullname);
    } else {
      setPinError("Incorrect PIN. Please try again.");
      setPinInput('');
      if (pinInputRef.current) pinInputRef.current.focus();
    }
  };

  // Toggle blur state for the modal content
  const handleToggleBlur = () => {
    setIsBlurred(prev => !prev);
  };

  const formatDate = (dateString) => {
    // ... (formatDate function remains the same)
    if (!dateString) {
      return 'Not Available';
    }
    try {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Not Available';
    }
  };


  return (
    <div className="p-4 min-h-screen bg-white">
      <div className="p-4 bg-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-black">New Employee List</h2>

        {/* --- Table to display basic employee info --- */}
        <div className="overflow-x-auto"> {/* Added for responsiveness */}
            <table className="min-w-full bg-white border border-gray-300 mb-4">
            {/* ... thead remains the same ... */}
             <thead>
                <tr>
                <th className="px-4 py-2 border text-black">Full Name</th>
                <th className="px-4 py-2 border text-black">Gender</th>
                <th className="px-4 py-2 border text-black">Nationality</th>
                <th className="px-4 py-2 border text-black">Civil Status</th>
                <th className="px-4 py-2 border text-black">Email</th>
                <th className="px-4 py-2 border text-black">Role</th>
                <th className="px-4 py-2 border text-black">Department</th>
                <th className="px-4 py-2 border text-black">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton /></td>
                    <td className="px-4 py-2 border text-black"><Skeleton width={80} /></td>
                    </tr>
                ))
                ) : employees.length > 0 ? (
                employees.map((employee, index) => (
                    <tr key={index}>
                    <td className="px-4 py-2 border text-black">{employee.fullname}</td>
                    <td className="px-4 py-2 border text-black">{employee.gender}</td>
                    <td className="px-4 py-2 border text-black">{employee.nationality}</td>
                    <td className="px-4 py-2 border text-black">{employee.civilStatus}</td>
                    <td className="px-4 py-2 border text-black">{employee.email}</td>
                    <td className="px-4 py-2 border text-black">{employee.role}</td>
                    <td className="px-4 py-2 border text-black">{employee.department}</td>
                    <td className="px-4 py-2 border text-center"> {/* Centered button */}
                        <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded" // Adjusted padding
                        onClick={() => handleViewClick(employee)} // Use the new handler
                        >
                        View
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" className="px-4 py-2 text-center text-black">No employees available</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* --- PIN Prompt Modal --- */}
        {showPinPrompt && (
            <div className="z-50 fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Enter PIN</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        To view details for: <strong>{targetEmployee?.fullname}</strong>
                    </p>
                    <form onSubmit={handlePinSubmit}>
                        <div className="mb-4 relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                ref={pinInputRef}
                                type="password"
                                value={pinInput}
                                onChange={(e) => setPinInput(e.target.value)}
                                className={`w-full px-10 py-2 border rounded-md ${pinError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="PIN"
                                required
                                autoComplete="off"
                            />
                        </div>
                        {pinError && (
                            <p className="text-red-500 text-sm mb-4 text-center">{pinError}</p>
                        )}
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleClose} // Use the general close handler
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center"
                            >
                                <IoMdArrowRoundBack className="mr-1"/> Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
                            >
                                <FiUnlock className="mr-1" /> Verify
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}


        {/* --- Modal to display detailed employee info (blurred initially) --- */}
        {selectedEmployee && !showPinPrompt && ( // Render only if employee selected AND PIN prompt is hidden
          <div className="z-40 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"> {/* Lower z-index than PIN prompt */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"> {/* Adjusted width, max-w, flex */}
              <h3 className="text-xl font-bold mb-4 text-black flex-shrink-0">Employee Details</h3>

              {/* --- Content Area (Conditionally Blurred) --- */}
              <div
                ref={modalContentRef}
                className={`flex-grow overflow-y-auto pr-2 space-y-2 transition-filter duration-300 ease-in-out mb-4 ${ // Added padding-right, space-y
                  isBlurred ? 'filter blur-sm pointer-events-none select-none' : 'filter-none'
                }`}
              >
                  <p className="text-black"><strong>Full Name:</strong> {selectedEmployee.fullname}</p>
                  <p className="text-black"><strong>Address:</strong> {selectedEmployee.address || 'Not Available'}</p>
                  <p className="text-black"><strong>Birthdate:</strong> {formatDate(selectedEmployee.birthdate)}</p>
                  <p className="text-black"><strong>Gender:</strong> {selectedEmployee.gender || 'Not Available'}</p>
                  <p className="text-black"><strong>Nationality:</strong> {selectedEmployee.nationality || 'Not Available'}</p>
                  <p className="text-black"><strong>Civil Status:</strong> {selectedEmployee.civilStatus || 'Not Available'}</p>
                  <p className="text-black"><strong>Email:</strong> {selectedEmployee.email || 'Not Available'}</p>
                  <p className="text-black"><strong>Department:</strong> {selectedEmployee.department || 'Not Available'}</p>
                  <p className="text-black"><strong>Role:</strong> {selectedEmployee.role || 'Not Available'}</p>
                  <p className="text-black"><strong>Education:</strong> {selectedEmployee.education || 'Not Available'}</p>
                  <p className="text-black"><strong>Experience:</strong> {selectedEmployee.experience || 'Not Available'}</p>
                  <p className="text-black"><strong>Skills:</strong> {selectedEmployee.skills ? selectedEmployee.skills.join(', ') : 'Not Available'}</p>
                  <p className="text-black"><strong>Resume:</strong> {selectedEmployee.resume || 'Not Available'}</p>
                  <p className="text-black"><strong>LinkedIn:</strong> {selectedEmployee.linkedin || 'Not Available'}</p>
              </div>

              {/* --- Modal Footer with Buttons --- */}
              <div className="flex justify-between items-center border-t pt-4 flex-shrink-0"> {/* Added border-t, pt */}
                 {/* Toggle Blur Button */}
                 <button
                    onClick={handleToggleBlur}
                    className={`py-1 px-3 rounded flex items-center transition-colors duration-200 ${
                        isBlurred ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                    title={isBlurred ? "Reveal Details" : "Hide Details"}
                >
                    {isBlurred ? <FiEyeOff className="mr-1" /> : <FiEye className="mr-1" />}
                    {isBlurred ? 'Reveal' : 'Hide'}
                </button>

                {/* Close Button */}
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleClose}
                >
                    Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewEmployee;
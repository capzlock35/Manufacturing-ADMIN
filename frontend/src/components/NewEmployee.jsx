import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Uncomment this once HR1 data is available

const NewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch data from HR1 (commented out for now)
  const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://backend-admin.jjm-manufacturing.com/api/hrusers'
  : 'http://localhost:7690/api/hrusers';

  const authURL = process.env.NODE_ENV === 'production'
  ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
  : 'http://localhost:7690/api/auth/get-token';

  const fetchUsers = async () => {
      try {
          // Get token using dynamic authURL
          const tokenResponse = await axios.get(authURL);
          const token = tokenResponse.data.token;

          if (!token) {
              console.error("🚨 No token received from backend!");
              return;
          }

          // Fetch HR users with authentication
          const response = await axios.get(`${baseURL}/get`, {
              headers: {
                  Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
              },
          });

          console.log("✅ HR Users Response:", response.data);
          setEmployees(response.data);
      } catch (err) {
          console.error("❌ Error fetching HR users:", err.response ? err.response.data : err.message);
      }
  };

  useEffect(() => {
      fetchUsers();
  }, []);


  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-4 h-screen bg-white">
      <div className="p-4 bg-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-black">New Employee List</h2>

        {/* Table to display basic employee info */}
        <table className="min-w-full bg-white border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-black">First Name</th>
              <th className="px-4 py-2 border text-black">Last Name</th>
              <th className="px-4 py-2 border text-black">Email</th>
              <th className="px-4 py-2 border text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-black">{employee.firstName}</td>
                  <td className="px-4 py-2 border text-black">{employee.lastName}</td>
                  <td className="px-4 py-2 border text-black">{employee.email}</td>
                  <td className="px-4 py-2 border ">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleViewClick(employee)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-black">No employees available</td>
              </tr>
            )}
          </tbody>
        </table>

        

        {/* Modal or section to display detailed employee info */}
        {selectedEmployee && (
          <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h3 className="text-xl font-bold mb-4 text-black">Employee Details</h3>
              <p className="text-black"><strong>First Name:</strong> {selectedEmployee.firstName}</p>
              <p className="text-black"><strong>Last Name:</strong> {selectedEmployee.lastName}</p>
              <p className="text-black"><strong>Middle Name:</strong> {selectedEmployee.middleName || 'Not Available'}</p>
              <p className="text-black"><strong>Email:</strong> {selectedEmployee.email}</p>
              <p className="text-black"><strong>Age:</strong> {selectedEmployee.age || 'Not Available'}</p>
              <p className="text-black"><strong>Birthday:</strong> {selectedEmployee.birthday || 'Not Available'}</p>
              <p className="text-black"><strong>Gender:</strong> {selectedEmployee.gender || 'Not Available'}</p>
              <p className="text-black"><strong>Address:</strong> {selectedEmployee.address || 'Not Available'}</p>
              <p className="text-black"><strong>Department:</strong> {selectedEmployee.department || 'Not Available'}</p>
              <p className="text-black"><strong>Role:</strong> {selectedEmployee.role || 'Not Available'}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4  text-center text-black">Displaying HrAccounts for now</h2>
    </div>
  );
};

export default NewEmployee;

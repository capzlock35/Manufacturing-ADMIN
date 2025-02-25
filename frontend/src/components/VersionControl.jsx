// VersionControl.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // If you have react-router-dom installed

const VersionControl = () => {
  const [hr4Announcements, setHr4Announcements] = useState([]);

  // useEffect(() => {
  //   // --- Fetch HR4 Announcements (Commented out for now) ---
  //   // Replace 'YOUR_API_ENDPOINT_FOR_HR4_ANNOUNCEMENTS' with your actual API endpoint
  //   const fetchHr4Announcements = async () => {
  //     try {
  //       // const response = await axios.get('YOUR_API_ENDPOINT_FOR_HR4_ANNOUNCEMENTS');
  //       // setHr4Announcements(response.data); // Assuming API returns an array of announcements
  //       // --- Placeholder Data for UI Development ---
  //       setHr4Announcements([
  //         { id: 1, title: 'HR4 System Maintenance', description: 'Scheduled maintenance on July 20th, 2024.', date: '2024-07-20' },
  //         { id: 2, title: 'New HR Policy Update', description: 'Please review the updated HR policy document.', date: '2024-07-15' },
  //       ]);
  //       console.log("Fetching HR4 announcements (commented out in code)"); // Indicate fetch attempt
  //     } catch (error) {
  //       console.error('Error fetching HR4 announcements:', error);
  //       // Handle error appropriately (e.g., display error message to user)
  //     }
  //   };

  //   fetchHr4Announcements();
  // }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">HR4 Announcements</h1>
          {/* Button to go to Announcement.jsx */}
          <Link to="/home/Announcement" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go To Admin Announcement
          </Link>
          {/* If not using react-router-dom, use this instead: */}
          {/* <button onClick={() => window.location.href = '/announcements'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Create Admin Announcement
          </button> */}
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">HR4 Announcements</h2>
          </div>
          <div className="p-4">
            {hr4Announcements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hr4Announcements.map((announcement) => (
                      <tr key={announcement.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.title}</td>
                        <td className="px-4 py-2">{announcement.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No HR4 announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
// VersionControl.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If you have react-router-dom installed
// import axios from 'axios'; // Removed axios import

const VersionControl = () => {
  const [hr4Announcements, setHr4Announcements] = useState([ // Keeping placeholder data for UI
    { id: 1, title: 'HR4 System Maintenance', description: 'Scheduled maintenance on July 20th, 2024.', date: '2024-07-20' },
    { id: 2, title: 'New HR Policy Update', description: 'Please review the updated HR policy document.', date: '2024-07-15' },
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState({ // State for the new announcement form
    title: '',
    description: '',
    date: '',
  });

  // const baseURL = process.env.NODE_ENV === 'production'
  //   ? 'YOUR_PRODUCTION_API_ENDPOINT_FOR_HR4_ANNOUNCEMENTS' // Replace with your production API endpoint
  //   : 'http://localhost:7690/api/announcements'; // Or your local API endpoint if different - Removed baseURL and related logic

  // useEffect(() => { // Removed useEffect and fetchHr4Announcements
  //   // --- Fetch HR4 Announcements ---
  //   const fetchHr4Announcements = async () => {
  //     try {
  //       const response = await axios.get(baseURL); // Use baseURL for API calls
  //       setHr4Announcements(response.data); // Assuming API returns an array of announcements
  //     } catch (error) {
  //       console.error('Error fetching HR4 announcements:', error);
  //       // Handle error appropriately (e.g., display error message to user)
  //     }
  //   };

  //   fetchHr4Announcements();
  // }, []); // Empty dependency array means this effect runs once after the initial render

  const handleInputChange = (e) => { // Function to handle input changes in the form - Keep this
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleCreateAnnouncement = async (e) => { // Function to handle announcement creation - Modified to be a placeholder
    e.preventDefault();
    // --- Implement your API call to create HR4 announcement here ---
    // --- Use axios.post or fetch to send data to your HR4 API endpoint ---
    // --- Example (you need to replace 'YOUR_HR4_API_ENDPOINT' and adjust data/headers as needed): ---
    // try {
    //   const response = await axios.post('YOUR_HR4_API_ENDPOINT', newAnnouncement, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   console.log("HR4 Announcement created:", response.data);
    //   setNewAnnouncement({ title: '', description: '', date: '' }); // Clear form
    //   // --- After successful creation, you might want to: ---
    //   // 1. Fetch and update hr4Announcements again (if you want to display live updates)
    //   // 2. Or, manually add the new announcement to the hr4Announcements state for immediate display
    // } catch (error) {
    //   console.error('Error creating HR4 announcement:', error);
    //   // Handle error (e.g., display an error message to the user)
    // }
    console.log("Create HR4 Announcement form submitted with data:", newAnnouncement); // Placeholder log
    alert("Create HR4 Announcement functionality needs to be implemented in handleCreateAnnouncement function. Check console for form data."); // Placeholder alert
    setNewAnnouncement({ title: '', description: '', date: '' }); // Clear form for now
  };


  return (
    <div className="min-h-screen bg-white py-6">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">HR4 Announcements</h1>
          {/* Button to go to Announcement.jsx (Admin Page - can keep for separate admin functions) */}
          <Link to="/home/Announcement" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go To Admin Announcement
          </Link>
        </div>

        {/* Create Announcement Form - Added Here */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New HR4 Announcement</h2>
          <form onSubmit={handleCreateAnnouncement}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAnnouncement.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Announcement Title"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newAnnouncement.description}
                onChange={handleInputChange}
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Announcement Description"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newAnnouncement.date}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Announcement Date"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create HR4 Announcement
            </button>
          </form>
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
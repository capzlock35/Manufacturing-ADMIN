// VersionControl.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

const VersionControl = () => {
  const [hr4Announcements, setHr4Announcements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Environment-aware URLs for Announcements and Auth ---
  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/vs'  // Production URL for announcements
    : 'http://localhost:7690/api/vs'; // Local URL for announcements

  const authURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token' // Production URL for auth
    : 'http://localhost:7690/api/auth/get-token'; // Local URL for auth


  // --- Define fetchHr4Announcements OUTSIDE of useEffect ---
  const fetchHr4Announcements = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get token using dynamic authURL (similar to logistic table)
      const tokenResponse = await axios.get(authURL);
      const token = tokenResponse.data.token;

      if (!token) {
        console.error("🚨 No token received from backend!");
        setError("Could not retrieve authentication token.");
        setLoading(false);
        return;
      }

      // Fetch HR4 announcements with authentication
      const response = await axios.get(`${baseURL}/get`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
        },
      });

      console.log("✅ HR4 Announcements Response:", response.data);
      setHr4Announcements(response.data);
    } catch (err) {
      console.error("❌ Error fetching HR4 announcements:", err.response ? err.response.data : err.message);
      setError(`Error fetching announcements: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // --- Call fetchHr4Announcements here for initial load ---
    fetchHr4Announcements();
  }, []); // Empty dependency array means this runs once after initial render


  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Get token before creating announcement
      const tokenResponse = await axios.get(authURL);
      const token = tokenResponse.data.token;

      if (!token) {
        console.error("🚨 No token received for creating announcement!");
        setError("Could not retrieve authentication token for creating announcement.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${baseURL}/vscreate`,
        {
          title: newAnnouncement.title,
          content: newAnnouncement.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ HR4 Announcement created:", response.data);
      setNewAnnouncement({ title: '', description: '' }); // Clear form

      // Refresh announcements list after creating a new one
      fetchHr4Announcements(); // <--- Call fetchHr4Announcements here to refresh!


    } catch (err) {
      console.error("❌ Error creating HR4 announcement:", err.response ? err.response.data : err.message);
      setError(`Error creating announcement: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div>Loading announcements...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="min-h-screen bg-white py-6">
      {/* ... rest of your component JSX (similar to previous versions) ... */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">HR4 Announcements</h1>
          <Link to="/home/Announcement" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Go To Admin Announcement
          </Link>
        </div>

        {/* Create Announcement Form */}
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
            {/* Removed Date Input from Create Form as Backend Model does not use it for creation */}
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
                      <tr key={announcement._id}>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.title}</td>
                        <td className="px-4 py-2">{announcement.content}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(announcement.date).toLocaleDateString()}</td>
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
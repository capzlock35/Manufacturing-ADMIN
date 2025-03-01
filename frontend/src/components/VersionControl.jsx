// VersionControl.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VersionControl = () => {
  const [hr4Announcements, setHr4Announcements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
  });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null); // State to track which announcement is being edited
  const [editFormData, setEditFormData] = useState({ // State for edit form data
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Environment-aware URLs for Announcements and Auth ---
  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/vs'
    : 'http://localhost:7690/api/vs';

  const authURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-token'
    : 'http://localhost:7690/api/auth/get-token';


  const fetchHr4Announcements = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenResponse = await axios.get(authURL);
      const token = tokenResponse.data.token;

      if (!token) {
        console.error("🚨 No token received from backend!");
        setError("Could not retrieve authentication token.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${baseURL}/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    fetchHr4Announcements();
  }, []);


  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
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
      setNewAnnouncement({ title: '', description: '' });
      fetchHr4Announcements();

    } catch (err) {
      console.error("❌ Error creating HR4 announcement:", err.response ? err.response.data : err.message);
      setError(`Error creating announcement: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (announcement) => {
    setEditingAnnouncementId(announcement._id);
    setEditFormData({ title: announcement.title, description: announcement.content });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tokenResponse = await axios.get(authURL);
      const token = tokenResponse.data.token;

      if (!token) {
        console.error("🚨 No token received for updating announcement!");
        setError("Could not retrieve authentication token for updating announcement.");
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `${baseURL}/update/${editingAnnouncementId}`, // Use path parameter `:id`
        {
          title: editFormData.title,
          content: editFormData.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ HR4 Announcement updated:", response.data);
      setEditingAnnouncementId(null); // Clear editing state
      setEditFormData({ title: '', description: '' }); // Clear edit form
      fetchHr4Announcements(); // Refresh announcements

    } catch (err) {
      console.error("❌ Error updating HR4 announcement:", err.response ? err.response.data : err.message);
      setError(`Error updating announcement: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return; // Stop if user cancels
    }
    setLoading(true);
    setError(null);
    try {
      const tokenResponse = await axios.get(authURL);
      const token = tokenResponse.data.token;

      if (!token) {
        console.error("🚨 No token received for deleting announcement!");
        setError("Could not retrieve authentication token for deleting announcement.");
        setLoading(false);
        return;
      }

      await axios.delete(`${baseURL}/delete/${id}`, { // Use path parameter `:id`
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ HR4 Announcement deleted:", id);
      fetchHr4Announcements(); // Refresh announcements

    } catch (err) {
      console.error("❌ Error deleting HR4 announcement:", err.response ? err.response.data : err.message);
      setError(`Error deleting announcement: ${err.response ? err.response.data.message : err.message}`);
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
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create HR4 Announcement
            </button>
          </form>
        </div>

        {/* Edit Announcement Form (Conditional rendering) */}
        {editingAnnouncementId && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit HR4 Announcement</h2>
            <form onSubmit={handleUpdateAnnouncement}>
              <div className="mb-4">
                <label htmlFor="editTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Announcement Title"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3  text-black bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Announcement Description"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingAnnouncementId(null)} // Cancel edit mode
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update HR4 Announcement
                </button>
              </div>
            </form>
          </div>
        )}


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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> {/* Action Column */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hr4Announcements.map((announcement) => (
                      <tr key={announcement._id}>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.title}</td>
                        <td className="px-4 py-2">{announcement.content}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(announcement.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => handleEditClick(announcement)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2 focus:outline-none focus:shadow-outline text-xs"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                          >
                            Delete
                          </button>
                        </td>
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
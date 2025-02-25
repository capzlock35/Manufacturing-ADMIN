import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

const Announcement = () => {
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [announcementToDeleteId, setAnnouncementToDeleteId] = useState(null);


  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/announcements'
    : 'http://localhost:7690/api/announcements';

  const adminUsersBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
    : 'http://localhost:7690/api/adminusers';


    useEffect(() => {
        const initialize = async () => {
          await fetchuserName();
          await fetchAnnouncements();
        };
        initialize();
      }, []);

      // REMOVE useEffect for localStorage
      // useEffect(() => {
      //   localStorage.setItem('deployedAnnouncements', JSON.stringify(deployedAnnouncements));
      // }, [deployedAnnouncements]);

      const fetchAnnouncements = async () => {
        try {
          const response = await axios.get(baseURL);
          setAdminAnnouncements(response.data);
        } catch (error) {
          console.error('Error fetching announcements:', error);
        }
      };

      const fetchuserName = async () => {
        const userid = localStorage.getItem('userid');
        const token = localStorage.getItem('token');

        if (!userid || !token) {
          console.error("userid or token not found in local storage.");
          setLoggedInUsername("Unknown User - No UserID or Token");
          return;
        }

        try {
          const response = await axios.get(`${adminUsersBaseURL}/username/${userid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Announcement.jsx - fetchuserName - response.data:", response.data);
          if (response.data && response.data.username) {
              setLoggedInUsername(response.data.username);
          } else {
              setLoggedInUsername("Unknown User - No userName in Response");
          }
        } catch (error) {
          console.error('Error fetching userName:', error);
          setLoggedInUsername('Unknown User - Fetch Error');
        }
      };


  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const loggedInUsernameValue = getLoggedInUsername();
      if (!loggedInUsernameValue) {
        console.error("Admin Username not available.");
        alert("Could not determine admin username.");
        return;
      }

      const announcementData = {
        ...newAnnouncement,
        createdBy: loggedInUsernameValue,
      };
      await axios.post(`${baseURL}/create`, announcementData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setNewAnnouncement({ title: '', description: '', date: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const getLoggedInUsername = () => {
    return loggedInUsername;
  };

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedAnnouncement(null);
    setShowDeleteConfirmation(false);
    setAnnouncementToDeleteId(null);
  };

  const handleUpdateAnnouncement = (id) => {
    alert(`Update functionality for announcement ID: ${id} - To be implemented`);
    setEditingAnnouncementId(id);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncementToDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDeleteId) {
      console.warn("No announcement ID to delete.");
      return;
    }
    try {
      await axios.delete(`${baseURL}/${announcementToDeleteId}`);
      fetchAnnouncements();
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  // NEW handleDeployAnnouncement FUNCTION
  const handleDeployAnnouncement = async (announcementId, currentDeployedStatus) => {
    try {
        const newDeployedStatus = !currentDeployedStatus; // Toggle status
        await axios.put(`${baseURL}/${announcementId}`, { deployed: newDeployedStatus }); // Update backend
        fetchAnnouncements(); // Re-fetch announcements to update the UI
    } catch (error) {
        console.error('Error toggling deploy status:', error);
        alert('Failed to toggle deploy status. See console for details.');
    }
  };


  return (
    <div className="min-h-screen bg-white py-6">
        <div className="container mx-auto px-4 py-8">
        <Link to="/home/VersionControl" className="mb-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none">
                  <IoMdArrowRoundBack /> Back
                </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 py-6">Admin Announcements</h1>


        {/* Create Announcement Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Announcement</h2>
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
                Create Announcement
            </button>
            </form>
        </div>

        {/* Display Admin Announcements */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Created Announcements</h2>
            </div>
            <div className="p-4">
            {adminAnnouncements.length > 0 ? (
                <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {adminAnnouncements.map((announcement) => (
                        <tr key={announcement._id}>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.title}</td>
                        <td className="px-4 py-2">{announcement.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.date ? announcement.date.substring(0, 10) : ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.createdBy}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <button onClick={() => handleViewAnnouncement(announcement)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm mr-2 focus:outline-none focus:shadow-outline text-xs">
                            View
                            </button>
                            <button onClick={() => handleUpdateAnnouncement(announcement._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded-sm mr-2 focus:outline-none focus:shadow-outline text-xs">
                            Update
                            </button>
                            <button onClick={() => handleDeleteAnnouncement(announcement._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm mr-2 focus:outline-none focus:shadow-outline text-xs">
                            Delete
                            </button>
                            {/* MODIFIED Deploy/Undeploy Button */}
                            <button
                                onClick={() => handleDeployAnnouncement(announcement._id, announcement.deployed)}
                                className={`bg-${announcement.deployed ? 'red' : 'green'}-500 hover:bg-${announcement.deployed ? 'red' : 'green'}-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-xs`}
                            >
                                {announcement.deployed ? 'Undeploy' : 'Deploy'}
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <p className="text-gray-600">No admin announcements created yet.</p>
            )}
            </div>
        </div>
        {/* Modal - Conditionally Rendered (View Details) */}
        {showViewModal && selectedAnnouncement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-2">View Announcement</h3>
                <p className="mb-2"><span className="font-bold">Title:</span> {selectedAnnouncement.title}</p>
                <p className="mb-2"><span className="font-bold">Description:</span> {selectedAnnouncement.description}</p>
                <p className="mb-2"><span className="font-bold">Date:</span> {selectedAnnouncement.date}</p>
                <p className="mb-4"><span className="font-bold">Created By:</span> {selectedAnnouncement.createdBy}</p>
                <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Close
                </button>
            </div>
            </div>
        )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this announcement?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAnnouncement}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Announcement;
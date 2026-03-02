import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import Skeleton from 'react-loading-skeleton'; // Import Skeleton for loading state if needed
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS


// --- Added: Helper array for month dropdown ---
const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
];


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
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state

  // --- Added: State for Filtering ---
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  // --- End Added ---


  const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/announcements'
    : 'http://localhost:7690/api/announcements';

  const adminUsersBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/adminusers'
    : 'http://localhost:7690/api/adminusers';


    useEffect(() => {
        const initialize = async () => {
          setLoading(true); // Start loading before async calls
          setError(null);
          await fetchuserName();
          await fetchAnnouncements(); // Fetch announcements after username (or concurrently if independent)
          setLoading(false); // Stop loading after all initial fetches
        };
        initialize();
      }, []);


      // REMOVE useEffect for localStorage
      // useEffect(() => {
      //   localStorage.setItem('deployedAnnouncements', JSON.stringify(deployedAnnouncements));
      // }, [deployedAnnouncements]);

      const fetchAnnouncements = async () => {
        // setLoading(true); // Moved loading control to initialize
        // setError(null);
        try {
          const response = await axios.get(baseURL);
          // --- Modified: Sort and set filtered data ---
          const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first
          setAdminAnnouncements(sortedData);
          setFilteredAnnouncements(sortedData); // Initialize filtered list

          // Extract unique years
          const years = [...new Set(sortedData.map(ann => {
              if (!ann.date) return null; // Handle cases where date might be missing
              return new Date(ann.date).getFullYear();
          }).filter(year => year !== null))] // Filter out nulls if date was missing
          .sort((a, b) => b - a); // Sort descending
          setAvailableYears(years);
          // --- End Modification ---

        } catch (error) {
          console.error('Error fetching announcements:', error);
          setError('Failed to fetch announcements.'); // Set error state
          // --- Added: Clear state on error ---
          setAdminAnnouncements([]);
          setFilteredAnnouncements([]);
          setAvailableYears([]);
          // --- End Added ---
        }
        // Removed finally block setLoading(false) as it's handled in initialize
      };

      // --- Added: useEffect for Filtering Logic ---
      useEffect(() => {
        let result = adminAnnouncements; // Start with the full list

        if (filterYear) {
          result = result.filter(ann => {
              if (!ann.date) return false; // Skip announcements without a date
              return new Date(ann.date).getFullYear() === parseInt(filterYear)
          });
        }

        if (filterMonth) {
          result = result.filter(ann => {
              if (!ann.date) return false; // Skip announcements without a date
              return (new Date(ann.date).getMonth() + 1) === parseInt(filterMonth)
          });
        }

        setFilteredAnnouncements(result); // Update the list displayed in the table
      }, [filterMonth, filterYear, adminAnnouncements]); // Re-run filter when criteria or original data changes
      // --- End Added ---

      const fetchuserName = async () => {
        const userid = localStorage.getItem('userid');
        const token = localStorage.getItem('token');

        if (!userid || !token) {
          console.error("userid or token not found in local storage.");
          setLoggedInUsername("Unknown User - No UserID or Token");
          // setError("User details not found. Please log in again."); // Optionally set error
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
          // setError('Failed to fetch user details.'); // Optionally set error
        }
      };


  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true); // Indicate loading
    setError(null);
    try {
      const loggedInUsernameValue = getLoggedInUsername();
      if (!loggedInUsernameValue || loggedInUsernameValue.startsWith('Unknown User')) { // Improved check
        console.error("Admin Username not available or invalid.");
        setError("Could not determine admin username. Please ensure you are logged in.");
        setLoading(false);
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
      await fetchAnnouncements(); // Refresh data
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError(`Failed to create announcement: ${error.response?.data?.message || error.message}`);
    } finally {
        setLoading(false); // Stop loading
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
    // Keep the existing implementation or replace with actual update logic
    // setEditingAnnouncementId(id); // Example: Set state if you build an edit form
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
    setLoading(true); // Indicate loading
    setError(null);
    try {
      await axios.delete(`${baseURL}/${announcementToDeleteId}`);
      await fetchAnnouncements(); // Refresh data
      handleCloseModal(); // Close confirmation modal
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError(`Failed to delete announcement: ${error.response?.data?.message || error.message}`);
      // Keep modal open on error? Optional. Currently it closes via handleCloseModal called in finally
    } finally {
        setLoading(false); // Stop loading
        // handleCloseModal(); // Moved closing logic inside try block for success case only, or keep here to always close
    }
  };

  // NEW handleDeployAnnouncement FUNCTION
  const handleDeployAnnouncement = async (announcementId, currentDeployedStatus) => {
    setLoading(true); // Indicate loading
    setError(null);
    try {
        const newDeployedStatus = !currentDeployedStatus; // Toggle status
        await axios.put(`${baseURL}/${announcementId}`, { deployed: newDeployedStatus }); // Update backend
        await fetchAnnouncements(); // Re-fetch announcements to update the UI
    } catch (error) {
        console.error('Error toggling deploy status:', error);
        setError(`Failed to toggle deploy status: ${error.response?.data?.message || error.message}`);
        // alert('Failed to toggle deploy status. See console for details.'); // Replaced alert with setError
    } finally {
        setLoading(false); // Stop loading
    }
  };

  // --- Added: Filter Handlers ---
  const handleFilterMonthChange = (e) => {
    setFilterMonth(e.target.value);
  };

  const handleFilterYearChange = (e) => {
    setFilterYear(e.target.value);
  };

  const clearFilters = () => {
    setFilterMonth('');
    setFilterYear('');
  };
  // --- End Added ---


  // --- Added: Conditional rendering for loading state ---
  if (loading && adminAnnouncements.length === 0) { // Show skeleton only on initial load
      return (
          <div className="min-h-screen bg-white py-6">
              <div className="container mx-auto px-4 py-8">
                  <Link to="/home/VersionControl" className="mb-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none">
                      <IoMdArrowRoundBack /> Back
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6 py-6">Admin Announcements</h1>
                  {/* Skeleton for Create Form */}
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8"><Skeleton height={150} /></div>
                  {/* Skeleton for Filter */}
                  <div className="bg-gray-50 shadow-md rounded-lg p-4 mb-6 flex items-center space-x-4">
                      <Skeleton width={100} height={38} />
                      <Skeleton width={100} height={38} />
                      <Skeleton width={100} height={38} />
                   </div>
                  {/* Skeleton for Table */}
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                          <h2 className="text-lg font-semibold text-gray-700">Created Announcements</h2>
                      </div>
                      <div className="p-4">
                          <Skeleton count={5} height={40} />
                      </div>
                  </div>
              </div>
          </div>
      );
  }
  // --- End Added ---

  // --- Added: Conditional rendering for error state ---
  if (error) {
      return (
          <div className="min-h-screen bg-white py-6">
              <div className="container mx-auto px-4 py-8 text-center">
                  <p className="text-red-500 text-lg">Error: {error}</p>
                  <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Try Again
                  </button>
              </div>
          </div>
      );
  }
  // --- End Added ---

  return (
    <div className="min-h-screen bg-white py-6">
        <div className="container mx-auto px-4 py-8">
        <Link to="/home/VersionControl" className="mb-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none">
                  <IoMdArrowRoundBack /> Back
                </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 py-6">Admin Announcements</h1>


        {/* Create Announcement Form (Unchanged structure, added disabled state) */}
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={loading} // Disable button while loading
            >
                {loading ? 'Creating...' : 'Create Announcement'}
            </button>
            </form>
        </div>

        {/* --- Added: Filter Section --- */}
        <div className="bg-gray-50 shadow-md rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <h3 className="text-md font-semibold text-gray-700 mr-2">Filter by Date:</h3>
          {/* Month Dropdown */}
          <div>
            <label htmlFor="filterMonth" className="sr-only">Month</label>
            <select
              id="filterMonth"
              name="filterMonth"
              value={filterMonth}
              onChange={handleFilterMonthChange}
              className="shadow-sm border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Month --</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          {/* Year Dropdown */}
          <div>
            <label htmlFor="filterYear" className="sr-only">Year</label>
            <select
              id="filterYear"
              name="filterYear"
              value={filterYear}
              onChange={handleFilterYearChange}
              disabled={availableYears.length === 0} // Disable if no years found
              className="shadow-sm border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Year --</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {/* Clear Button */}
          {(filterMonth || filterYear) && ( // Show clear button only if a filter is active
            <button
              onClick={clearFilters}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm focus:outline-none focus:shadow-outline"
              disabled={loading} // Disable while loading
            >
              Clear Filter
            </button>
          )}
        </div>
        {/* --- End Added --- */}

        {/* --- Modified: Display Admin Announcements Table --- */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            {/* --- Modified: Table Title --- */}
            <h2 className="text-lg font-semibold text-gray-700">
                Created Announcements {filterMonth && filterYear ? `(${months.find(m => m.value === filterMonth)?.label} ${filterYear})` : filterYear ? `(${filterYear})` : filterMonth ? `(${months.find(m => m.value === filterMonth)?.label})` : ''}
                {loading && adminAnnouncements.length > 0 && <span className="ml-2 text-sm text-gray-500">(Updating...)</span>}
            </h2>
            {/* --- End Modified --- */}
            </div>
            <div className="p-4">
            {/* --- Modified: Check filteredAnnouncements.length --- */}
            {filteredAnnouncements.length > 0 ? (
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
                    {/* --- Modified: Map over filteredAnnouncements --- */}
                    {filteredAnnouncements.map((announcement) => (
                        <tr key={announcement._id}>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.title}</td>
                        <td className="px-4 py-2 max-w-xs truncate" title={announcement.description}>{announcement.description}</td> {/* Added truncate */}
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.date ? announcement.date.substring(0, 10) : ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.createdBy}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <button
                                onClick={() => handleViewAnnouncement(announcement)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm mr-2 focus:outline-none focus:shadow-outline text-xs disabled:opacity-50"
                                disabled={loading} // Disable while loading
                                >
                            View
                            </button>
                            <button
                                onClick={() => handleUpdateAnnouncement(announcement._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded-sm mr-2 focus:outline-none focus:shadow-outline text-xs disabled:opacity-50"
                                disabled={loading} // Disable while loading (update not implemented yet)
                                >
                            Update
                            </button>
                            <button
                                onClick={() => handleDeleteAnnouncement(announcement._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm mr-2 focus:outline-none focus:shadow-outline text-xs disabled:opacity-50"
                                disabled={loading} // Disable while loading
                                >
                            Delete
                            </button>
                            {/* MODIFIED Deploy/Undeploy Button (added disabled state) */}
                            <button
                                onClick={() => handleDeployAnnouncement(announcement._id, announcement.deployed)}
                                className={`bg-${announcement.deployed ? 'red' : 'green'}-500 hover:bg-${announcement.deployed ? 'red' : 'green'}-700 text-white font-bold py-1 px-2 rounded-sm focus:outline-none focus:shadow-outline text-xs disabled:opacity-50`}
                                disabled={loading} // Disable while loading
                            >
                                {loading ? (announcement.deployed ? 'Undeploying...' : 'Deploying...') : (announcement.deployed ? 'Undeploy' : 'Deploy')}
                            </button>
                        </td>
                        </tr>
                    ))}
                    {/* --- End Modified --- */}
                    </tbody>
                </table>
                </div>
            ) : (
                // --- Modified: Filter-aware "no data" message ---
                 <p className="text-center text-gray-600 py-4">
                  {adminAnnouncements.length > 0 ? 'No announcements match the selected filter.' : 'No admin announcements created yet.'}
                 </p>
                // --- End Modified ---
            )}
             {/* --- End Modified --- */}
            </div>
        </div>
        {/* --- End Modified --- */}


        {/* Modal - Conditionally Rendered (View Details - Unchanged) */}
        {showViewModal && selectedAnnouncement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-2">View Announcement</h3>
                <p className="mb-2"><span className="font-bold">Title:</span> {selectedAnnouncement.title}</p>
                <p className="mb-2"><span className="font-bold">Description:</span> {selectedAnnouncement.description}</p>
                <p className="mb-2"><span className="font-bold">Date:</span> {selectedAnnouncement.date ? selectedAnnouncement.date.substring(0, 10) : 'N/A'}</p> {/* Added date formatting */}
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

            {/* Delete Confirmation Modal (Added disabled state) */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this announcement?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline disabled:opacity-50"
                                disabled={loading} // Disable cancel while deleting
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAnnouncement}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                disabled={loading} // Disable delete while deleting
                            >
                                {loading ? 'Deleting...' : 'Delete'}
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
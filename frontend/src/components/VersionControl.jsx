import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Added: Helper array for month dropdown ---
const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
];


const VersionControl = () => {
  const [hr4Announcements, setHr4Announcements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
  });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportsPerPage] = useState(5); // Example: Number of skeleton rows to show during loading

  // --- Added: State for Filtering ---
  const [filterMonth, setFilterMonth] = useState(''); // e.g., '1' for January
  const [filterYear, setFilterYear] = useState('');   // e.g., '2024'
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);


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
        // Removed setLoading(false) here because it's in finally block
        return;
      }

      const response = await axios.get(`${baseURL}/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ HR4 Announcements Response:", response.data);
      // --- Modified: Sort data and set initial filtered list and years ---
      const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first
      setHr4Announcements(sortedData);
      setFilteredAnnouncements(sortedData); // Initialize filtered list

      // Extract unique years for the filter dropdown
      const years = [...new Set(sortedData.map(ann => new Date(ann.date).getFullYear()))].sort((a, b) => b - a); // Sort descending
      setAvailableYears(years);
      // --- End Modification ---

    } catch (err) {
      console.error("❌ Error fetching HR4 announcements:", err.response ? err.response.data : err.message);
      setError(`Error fetching announcements: ${err.response ? err.response.data.message : err.message}`);
      // --- Added: Clear state on error ---
      setHr4Announcements([]);
      setFilteredAnnouncements([]);
      setAvailableYears([]);
      // --- End Added ---
    } finally {
      setLoading(false); // Ensure loading is set to false in all cases
    }
  };


  useEffect(() => {
    fetchHr4Announcements();
  }, []); // Fetch on initial mount


  // --- Added: useEffect for Filtering Logic ---
  useEffect(() => {
    let result = hr4Announcements; // Start with the full list

    // Filter by year if selected
    if (filterYear) {
      result = result.filter(ann => new Date(ann.date).getFullYear() === parseInt(filterYear));
    }

    // Filter by month if selected
    if (filterMonth) {
       // Remember getMonth() is 0-indexed, filterMonth is 1-indexed
      result = result.filter(ann => (new Date(ann.date).getMonth() + 1) === parseInt(filterMonth));
    }

    setFilteredAnnouncements(result); // Update the list displayed in the table
  }, [filterMonth, filterYear, hr4Announcements]); // Re-run filter when criteria or original data changes
  // --- End Added ---


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
      fetchHr4Announcements(); // Refetch data to include the new one

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
      setEditingAnnouncementId(null);
      setEditFormData({ title: '', description: '' });
      fetchHr4Announcements(); // Refetch data to reflect the update

    } catch (err) {
      console.error("❌ Error updating HR4 announcement:", err.response ? err.response.data : err.message);
      setError(`Error updating announcement: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
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

      await axios.delete(`${baseURL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ HR4 Announcement deleted:", id);
      fetchHr4Announcements(); // Refetch data after deletion

    } catch (err) {
      console.error("❌ Error deleting HR4 announcement:", err.response ? err.response.data : err.message);
      setError(`Error deleting announcement: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
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
    // The useEffect dependency on filterMonth/Year will trigger recalculation automatically
  };
  // --- End Added ---


  if (loading && hr4Announcements.length === 0) { // Modified: Show skeleton only on initial load
    return (
      <div className="min-h-screen bg-white py-6">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">HR4 Announcements</h1>
            <Link to="/home/Announcement" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Go To Admin Announcement
            </Link>
          </div>
          {/* --- Added: Skeleton for Filter section --- */}
           <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center space-x-4">
              <Skeleton width={100} height={38} />
              <Skeleton width={100} height={38} />
              <Skeleton width={100} height={38} />
           </div>
          {/* --- End Added --- */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">HR4 Announcements</h2>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(reportsPerPage)].map((_, index) => ( // Skeleton rows
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap"><Skeleton height={20} /></td>
                        <td className="px-4 py-2"><Skeleton height={20} width={150} /></td>
                        <td className="px-4 py-2 whitespace-nowrap"><Skeleton height={20} width={80} /></td>
                        <td className="px-4 py-2 whitespace-nowrap"><Skeleton height={20} width={100} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Made error message slightly more generic
    return <div className="min-h-screen py-6"><div className="text-center py-8 text-red-500">Error: {error}</div></div>;
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

        {/* Create Announcement Form (Unchanged) */}
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
              disabled={loading} // Added: Disable button while loading
            >
              {loading ? 'Creating...' : 'Create HR4 Announcement'}
            </button>
          </form>
        </div>

        {/* Edit Announcement Form (Conditional rendering - Unchanged) */}
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
                  onClick={() => setEditingAnnouncementId(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading} // Added: Disable button while loading
                >
                   {loading ? 'Updating...' : 'Update HR4 Announcement'}
                </button>
              </div>
            </form>
          </div>
        )}


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
            >
              Clear Filter
            </button>
          )}
        </div>
        {/* --- End Added --- */}


        {/* --- Modified: Announcements Table --- */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            {/* --- Modified: Table Title --- */}
            <h2 className="text-lg font-semibold text-gray-700">
                HR4 Announcements {filterMonth && filterYear ? `(${months.find(m => m.value === filterMonth)?.label} ${filterYear})` : filterYear ? `(${filterYear})` : filterMonth ? `(${months.find(m => m.value === filterMonth)?.label})` : ''}
                {loading && hr4Announcements.length > 0 && <span className="ml-2 text-sm text-gray-500">(Updating...)</span>} {/* Optional: Indicate loading during CRUD when data exists */}
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> {/* Action Column */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {/* --- Modified: Map over filteredAnnouncements --- */}
                    {filteredAnnouncements.map((announcement) => (
                      <tr key={announcement._id}>
                        <td className="px-4 py-2 whitespace-nowrap">{announcement.title}</td>
                        <td className="px-4 py-2">{announcement.content}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(announcement.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => handleEditClick(announcement)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline text-xs" // Reduced padding
                            disabled={loading} // Added: Disable button while loading
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs" // Reduced padding
                            disabled={loading} // Added: Disable button while loading
                          >
                            Delete
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
                  {hr4Announcements.length > 0 ? 'No HR4 announcements match the selected filter.' : 'No HR4 announcements available.'}
              </p>
              // --- End Modified ---
            )}
             {/* --- End Modified --- */}
          </div>
        </div>
         {/* --- End Modified --- */}
      </div>
    </div>
  );
};

export default VersionControl;
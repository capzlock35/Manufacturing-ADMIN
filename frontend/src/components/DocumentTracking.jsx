import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentTracking = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        // Replace with your actual API endpoint when backend is ready
        // const response = await axios.get('/api/document-tracking');
        // setTrackingData(response.data);
        
        // Mock data for now
        setTrackingData([
          { id: 1, documentName: 'Report Q1', action: 'Viewed', user: 'Alice', timestamp: '2024-03-15 14:30' },
          { id: 2, documentName: 'Contract XYZ', action: 'Edited', user: 'Bob', timestamp: '2024-03-10 11:20' },
          { id: 3, documentName: 'Budget 2024', action: 'Commented', user: 'Charlie', timestamp: '2024-03-05 09:45' },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Failed to fetch tracking data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className=' p-4 bg-gray-200 h-screen'>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Document Tracking</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trackingData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.documentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default DocumentTracking;
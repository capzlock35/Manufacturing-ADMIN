import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VersionControl = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        // Replace with your actual API endpoint when backend is ready
        // const response = await axios.get('/api/versions');
        // setVersions(response.data);
        
        // Mock data for now
        setVersions([
          { id: 1, documentName: 'Report Q1', version: 'v1.2', lastModified: '2024-03-15', modifiedBy: 'Alice' },
          { id: 2, documentName: 'Contract XYZ', version: 'v2.0', lastModified: '2024-03-10', modifiedBy: 'Bob' },
          { id: 3, documentName: 'Budget 2024', version: 'v1.5', lastModified: '2024-03-05', modifiedBy: 'Charlie' },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching versions:', error);
        setError('Failed to fetch version data. Please try again later.');
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className='p-4 bg-gray-200 h-screen'>
      <div className="container mx-auto ">
        <h1 className="text-2xl font-bold mb-4">Version Control</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {versions.map((version) => (
                <tr key={version.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{version.documentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{version.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{version.lastModified}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{version.modifiedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
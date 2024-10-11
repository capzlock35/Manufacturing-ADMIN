import React, { useState, useEffect } from 'react';
import ModalTracking from '../Modal/ModalTracking';

const dummyTrackings = [
  { id: 1, documentId: 1, documentName: 'Project Proposal', action: 'Viewed', user: 'John Doe', date: '2023-05-16' },
  { id: 2, documentId: 2, documentName: 'Financial Report', action: 'Downloaded', user: 'Jane Smith', date: '2023-05-21' },
  { id: 3, documentId: 3, documentName: 'User Manual', action: 'Edited', user: 'Mike Johnson', date: '2023-05-26' },
];

const DocumentTracking = () => {
  const [trackings, setTrackings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);

  useEffect(() => {
    setTrackings(dummyTrackings);
  }, []);

  const handleView = (tracking) => {
    setSelectedTracking(tracking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTracking(null);
  };

  return (
    <div className="p-2 sm:p-4 min-h-screen bg-gray-100">
      <div className="container mx-auto p-2 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Document Tracking</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Document</th>
                <th className="py-3 px-6 text-left hidden sm:table-cell">Action</th>
                <th className="py-3 px-6 text-left hidden md:table-cell">User</th>
                <th className="py-3 px-6 text-left hidden lg:table-cell">Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {trackings.map((tracking) => (
                <tr key={tracking.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{tracking.documentName}</td>
                  <td className="py-3 px-6 text-left hidden sm:table-cell">{tracking.action}</td>
                  <td className="py-3 px-6 text-left hidden md:table-cell">{tracking.user}</td>
                  <td className="py-3 px-6 text-left hidden lg:table-cell">{tracking.date}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleView(tracking)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <ModalTracking
            tracking={selectedTracking}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentTracking;
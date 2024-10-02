import React from 'react';

const ModalTracking = ({ tracking, onClose }) => {
  if (!tracking) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
            Tracking Details
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            <p className="mb-1"><strong>Document:</strong> {tracking.documentName}</p>
            <p className="mb-1"><strong>Action:</strong> {tracking.action}</p>
            <p className="mb-1"><strong>User:</strong> {tracking.user}</p>
            <p className="mb-1"><strong>Date:</strong> {tracking.date}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTracking;
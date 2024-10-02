import React, { useState, useEffect } from 'react';

const ModalStorage = ({ type, document, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    size: '',
    uploadDate: ''
  });

  useEffect(() => {
    if (document) {
      setFormData(document);
    }
  }, [document]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {type === 'upload' ? 'Upload Document' : type === 'view' ? 'View Document' : 'Delete Document'}
          </h3>
          <div className="mt-2 px-7 py-3">
            {type === 'delete' ? (
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this document?
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Document Name"
                  className="mt-2 p-2 w-full border rounded"
                  readOnly={type === 'view'}
                />
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Document Type"
                  className="mt-2 p-2 w-full border rounded"
                  readOnly={type === 'view'}
                />
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Document Size"
                  className="mt-2 p-2 w-full border rounded"
                  readOnly={type === 'view'}
                />
                <input
                  type="date"
                  name="uploadDate"
                  value={formData.uploadDate}
                  onChange={handleChange}
                  className="mt-2 p-2 w-full border rounded"
                  readOnly={type === 'view'}
                />
              </form>
            )}
          </div>
          <div className="items-center px-4 py-3">
            {type !== 'view' && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {type === 'upload' ? 'Upload' : 'Confirm Delete'}
              </button>
            )}
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalStorage;

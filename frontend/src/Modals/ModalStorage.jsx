import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalStorage = ({ isOpen, onClose, onSubmit, document, viewOnly }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'Invoice',
    status: 'Pending',
    description: '',
    attachmentName: ''
  });

  useEffect(() => {
    // Check local storage for existing attachment name
    const storedAttachmentName = localStorage.getItem('attachmentName');
    if (storedAttachmentName) {
      setFormData(prev => ({ ...prev, attachmentName: storedAttachmentName }));
    }
    
    if (document) {
      setFormData(document);
    }
  }, [document]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save attachment name to local storage
    localStorage.setItem('attachmentName', formData.attachmentName);
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewOnly ? 'View Document' : document ? 'Edit Document' : 'Add New Document'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={viewOnly}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={viewOnly}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={viewOnly}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              >
                <option value="Invoice">Invoice</option>
                <option value="Receipt">Receipt</option>
                <option value="Purchase Order">Purchase Order</option>
                {/* Add more categories as needed */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={viewOnly}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                {/* Add more statuses as needed */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={viewOnly}
                required
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment
              </label>
              <input
                type="file"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                disabled={viewOnly}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData(prev => ({
                      ...prev,
                      attachmentName: file.name
                    }));
                  }
                }}
              />
              {formData.attachmentName && (
                <p className="text-sm text-gray-600 mt-1">Selected file: {formData.attachmentName}</p>
              )}
            </div>

            {!viewOnly && (
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {document ? 'Update Document' : 'Add Document'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalStorage;
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalLegal = ({ isOpen, onClose, onSubmit, mode, document }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'contract',
    status: 'draft',
    attachments: [],
    description: '', // Add description field
  });

  useEffect(() => {
    if (document && mode === 'edit') {
      setFormData(document);
    } else {
      setFormData({
        title: '',
        type: 'contract',
        status: 'draft',
        attachments: [],
        description: '', // Initialize description for new document
      });
    }
  }, [document, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(f => f.name)]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'Create New Document' : 'Edit Document'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700"
            >
              Document Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Document Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="contract">Contract</option>
              <option value="compliance">Compliance</option>
              <option value="ip">Intellectual Property</option>
            </select>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Context/Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="attachments"
              className="block text-sm font-medium text-gray-700"
            >
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
            {formData.attachments.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Attachments:
                </label>
                <ul className="list-disc pl-5 mt-1">
                  {formData.attachments.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {mode === 'create' ? 'Create Document' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalLegal;

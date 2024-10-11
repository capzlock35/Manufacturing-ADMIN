import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';


const ModalLegal = ({ isOpen, onClose, document, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        content: document.content,
        status: document.status
      });
    }
  }, [document]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {document ? 'Edit Document' : 'Create New Document'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            {document && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Version History</h3>
                <div className="space-y-2">
                  {document.versions.map((version) => (
                    <div key={version.version} className="flex justify-between text-sm text-gray-600">
                      <span>Version {version.version}</span>
                      <span>{version.date}</span>
                      <span>{version.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {document ? 'Save Changes' : 'Create Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalLegal;
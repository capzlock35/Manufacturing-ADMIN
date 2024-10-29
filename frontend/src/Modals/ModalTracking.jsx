import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const ModalTracking = ({
  isOpen,
  onClose,
  onSubmit,
  document,
  viewOnly,
  statusOptions,
  processStages,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    currentStatus: 'Draft',
    currentStage: 'Review',
    priority: 'Medium',
    assignedTo: '',
    createdDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    lastModified: new Date().toISOString().split('T')[0],
    description: '',
    attachment: null,  // To store the file
    attachmentName: ''
  });
  

  const [activeTab, setActiveTab] = useState('details');

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
              {viewOnly ? 'View Document' : document ? 'Edit Document' : 'New Document'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            {document && (
              <button
                className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            )}
          </div>

          {activeTab === 'details' && (
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  required
                  disabled={viewOnly}
                />
              </div>

              {/* New Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  rows="4"
                  required
                  disabled={viewOnly}
                />
              </div>

                            {/* File Attachment Field */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    required
                    disabled={viewOnly}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    disabled={viewOnly}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    disabled={viewOnly}
                  >
                    {Object.values(statusOptions).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stage
                  </label>
                  <select
                    name="currentStage"
                    value={formData.currentStage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    disabled={viewOnly}
                  >
                    {Object.values(processStages).map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    required
                    disabled={viewOnly}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-black"
                    required
                    disabled={viewOnly}
                  />
                </div>
              </div>

              {!viewOnly && (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {document ? 'Update' : 'Save'}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'history' && document?.history && (
            <div className="space-y-4">
              {document.history.map((entry, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <Clock size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Moved to <span className="font-medium">{entry.stage}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      By {entry.user} on {entry.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTracking;

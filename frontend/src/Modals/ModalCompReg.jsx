import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, FileText } from 'lucide-react';

const ModalCompReg = ({ isOpen, onClose, regulationData, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'Under Review',
    priority: 'Medium',
    nextReview: '',
    description: '',
    requirements: [],
    updates: [],
    assignedTeam: '',
    documents: []
  });

  useEffect(() => {
    if (regulationData) {
      setFormData(regulationData);
    } else {
      const nextReview = new Date();
      nextReview.setMonth(nextReview.getMonth() + 3);
      setFormData(prev => ({
        ...prev,
        nextReview: nextReview.toISOString().split('T')[0]
      }));
    }
  }, [regulationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleRequirementChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addUpdate = () => {
    setFormData(prev => ({
      ...prev,
      updates: [
        ...prev.updates,
        { date: new Date().toISOString().split('T')[0], type: '', description: '' }
      ]
    }));
  };

  const removeUpdate = (index) => {
    setFormData(prev => ({
      ...prev,
      updates: prev.updates.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      updates: prev.updates.map((update, i) =>
        i === index ? { ...update, [field]: value } : update
      )
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0]
    }));
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {regulationData ? 'Edit Regulation' : 'Add New Regulation'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black"
                  required
                />
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border bg-gray-300 text-black border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending">Pending</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium  text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border bg-gray-300 text-black border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Review Date
                </label>
                <input
                  type="date"
                  name="nextReview"
                  value={formData.nextReview}
                  onChange={handleChange}
                  className="w-full border bg-gray-300 text-black border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Requirement
                </button>
              </div>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white"
                      placeholder="Enter requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Updates */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Updates
                </label>
                <button
                  type="button"
                  onClick={addUpdate}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Update
                </button>
              </div>
              <div className="space-y-4">
                {formData.updates.map((update, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="date"
                      value={update.date}
                      onChange={(e) => handleUpdateChange(index, 'date', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-40 bg-gray-300 text-black"
                    />
                    <select
                      value={update.type}
                      onChange={(e) => handleUpdateChange(index, 'type', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 bg-gray-300 text-black"
                    >
                      <option value="">Select Type</option>
                      <option value="Revision">Revision</option>
                      <option value="Amendment">Amendment</option>
                      <option value="Review">Review</option>
                    </select>
                    <input
                      type="text"
                      value={update.description}
                      onChange={(e) => handleUpdateChange(index, 'description', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white text-black"
                      placeholder="Update description"
                    />
                    <button
                      type="button"
                      onClick={() => removeUpdate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Documents
                </label>
                <label className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload Document
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{doc.uploadDate}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Regulation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCompReg;
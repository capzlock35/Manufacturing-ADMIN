import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, FileText } from 'lucide-react';

const ModalLitigation = ({ isOpen, onClose, caseData, onSave }) => {
    const [formData, setFormData] = useState({
        caseNumber: '',
        title: '',
        status: 'Active',
        legalCounsel: '',
        description: '',
        documents: [],
        communications: []
    });

    useEffect(() => {
        if (caseData) {
            setFormData(caseData);
        }
    }, [caseData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        onSave(submissionData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addCommunication = () => {
        setFormData(prev => ({
            ...prev,
            communications: [
                ...prev.communications,
                { date: new Date().toISOString().split('T')[0], type: '', description: '' }
            ]
        }));
    };

    const removeCommunication = (index) => {
        setFormData(prev => ({
            ...prev,
            communications: prev.communications.filter((_, i) => i !== index)
        }));
    };

    const handleCommunicationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            communications: prev.communications.map((comm, i) => 
                i === index ? { ...comm, [field]: value } : comm
            )
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newDocuments = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
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
                        <h2 className="text-xl font-bold text-gray-800">
                            {caseData ? 'Edit Case' : 'Add New Case'}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Case Number
                                </label>
                                <input
                                    type="text"
                                    name="caseNumber"
                                    value={formData.caseNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Legal Counsel
                            </label>
                            <input
                                type="text"
                                name="legalCounsel"
                                value={formData.legalCounsel}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Document Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documents
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <div className="flex items-center justify-center">
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-500">
                                            Click to upload documents
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>
                            </div>
                            {/* Document List */}
                            <div className="mt-4 space-y-2">
                                {formData.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <div className="flex items-center space-x-2">
                                            <FileText size={20} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{doc.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Communications Section */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Communications
                                </label>
                                <button
                                    type="button"
                                    onClick={addCommunication}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                >
                                    <Plus size={16} />
                                    Add Communication
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.communications.map((comm, index) => (
                                    <div key={index} className="flex items-start space-x-4 bg-gray-50 p-3 rounded">
                                        <div className="flex-grow grid grid-cols-3 gap-4">
                                            <input
                                                type="date"
                                                value={comm.date}
                                                onChange={(e) => handleCommunicationChange(index, 'date', e.target.value)}
                                                className="p-2 border border-gray-300 rounded"
                                            />
                                            <select
                                                value={comm.type}
                                                onChange={(e) => handleCommunicationChange(index, 'type', e.target.value)}
                                                className="p-2 border border-gray-300 rounded"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Email">Email</option>
                                                <option value="Phone">Phone</option>
                                                <option value="Meeting">Meeting</option>
                                                <option value="Court">Court</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={comm.description}
                                                onChange={(e) => handleCommunicationChange(index, 'description', e.target.value)}
                                                className="p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCommunication(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {caseData ? 'Update Case' : 'Create Case'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalLitigation
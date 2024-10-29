import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalResources = ({ isOpen, onClose, onSave, resource }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Equipment');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Available');

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setType(resource.type);
      setQuantity(resource.quantity);
      setStatus(resource.status);
    } else {
      setName('');
      setType('Equipment');
      setQuantity('');
      setStatus('Available');
    }
  }, [resource]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResource = {
      id: resource ? resource.id : null,
      name,
      type,
      quantity: Number(quantity),
      status
    };
    onSave(newResource);
    onClose();
  };

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{resource ? 'Edit Resource' : 'Add New Resource'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
            </button>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Resource Name</label>
                <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                <option value="Equipment">Equipment</option>
                <option value="Facility">Facility</option>
                <option value="Digital">Digital</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
                min="0"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
                </select>
            </div>
            <div className="flex justify-end">
                <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                {resource ? 'Update' : 'Add'} Resource
                </button>
            </div>
            </form>
        </div>
        </div>   
  );
};

export default ModalResources;
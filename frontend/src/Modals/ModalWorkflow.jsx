import React, { useState } from 'react';
import { X } from 'lucide-react';

const ModalWorkflow = ({ isOpen, onClose, onAddWorkflow }) => {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [stakeholders, setStakeholders] = useState(['']);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorkflow = {
      id: Date.now(), // This is a temporary ID. In a real app, the backend would provide this.
      name,
      trigger,
      stakeholders: stakeholders.filter(s => s.trim() !== ''),
    };
    onAddWorkflow(newWorkflow);
    onClose();
    // Reset form
    setName('');
    setTrigger('');
    setStakeholders(['']);
  };

  const addStakeholder = () => {
    setStakeholders([...stakeholders, '']);
  };

  const updateStakeholder = (index, value) => {
    const updatedStakeholders = [...stakeholders];
    updatedStakeholders[index] = value;
    setStakeholders(updatedStakeholders);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Workflow</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Workflow Name</label>
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
            <label htmlFor="trigger" className="block text-sm font-medium text-gray-700">Trigger Event</label>
            <input
              type="text"
              id="trigger"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stakeholders</label>
            {stakeholders.map((stakeholder, index) => (
              <input
                key={index}
                type="text"
                value={stakeholder}
                onChange={(e) => updateStakeholder(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder={`Stakeholder ${index + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={addStakeholder}
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Stakeholder
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalWorkflow
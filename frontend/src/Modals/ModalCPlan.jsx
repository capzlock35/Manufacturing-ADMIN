import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';

const ModalCPlan = ({ isOpen, onClose, onAddPlan }) => {
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState([{ type: '', frequency: '' }]);
  const [updates, setUpdates] = useState({ frequency: 'Weekly', day: 'Monday', time: '09:00 AM' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlan = {
      name,
      notifications,
      updates,
    };
    onAddPlan(newPlan);
    onClose();
    // Reset form
    setName('');
    setNotifications([{ type: '', frequency: '' }]);
    setUpdates({ frequency: 'Weekly', day: 'Monday', time: '09:00 AM' });
  };

  const addNotification = () => {
    setNotifications([...notifications, { type: '', frequency: '' }]);
  };

  const updateNotification = (index, field, value) => {
    const updatedNotifications = notifications.map((notification, i) => 
      i === index ? { ...notification, [field]: value } : notification
    );
    setNotifications(updatedNotifications);
  };

  const removeNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Communication Plan</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
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
            <label className="block text-sm font-medium text-gray-700">Notifications</label>
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  value={notification.type}
                  onChange={(e) => updateNotification(index, 'type', e.target.value)}
                  placeholder="Notification Type"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                  required
                />
                <input
                  type="text"
                  value={notification.frequency}
                  onChange={(e) => updateNotification(index, 'frequency', e.target.value)}
                  placeholder="Frequency"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeNotification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNotification}
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Notification
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Updates</label>
            <select
              value={updates.frequency}
              onChange={(e) => setUpdates({ ...updates, frequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            {updates.frequency === 'Weekly' && (
              <select
                value={updates.day}
                onChange={(e) => setUpdates({ ...updates, day: e.target.value })}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            )}
            <input
              type="time"
              value={updates.time}
              onChange={(e) => setUpdates({ ...updates, time: e.target.value })}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCPlan;
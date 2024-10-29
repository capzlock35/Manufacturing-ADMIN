import React, { useState, useEffect } from 'react';
import { Plus, Bell, RefreshCw } from 'lucide-react';
import ModalCPlan from '../Modals/ModalCPlan';

const initialPlans = [
  {
    id: 1,
    name: "Project Kickoff",
    notifications: [
      { type: "Task Assignment", frequency: "Immediate" },
      { type: "Deadline Reminder", frequency: "24 hours before" }
    ],
    updates: { frequency: "Weekly", day: "Monday", time: "09:00 AM" }
  },
  {
    id: 2,
    name: "Sprint Review",
    notifications: [
      { type: "Meeting Reminder", frequency: "1 hour before" }
    ],
    updates: { frequency: "Daily", time: "04:00 PM" }
  }
];

const CommunicationPlan = () => {
  const [plans, setPlans] = useState(() => {
    const savedPlans = localStorage.getItem('communicationPlans');
    return savedPlans ? JSON.parse(savedPlans) : initialPlans;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('communicationPlans', JSON.stringify(plans));
  }, [plans]);

  const handleAddPlan = (newPlan) => {
    const updatedPlans = [...plans, { ...newPlan, id: Date.now() }];
    setPlans(updatedPlans);
  };

  return (
    <div className='bg-gray-200 min-h-screen px-4'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Communication Plan</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4"
        >
          <Plus className="mr-2" size={20} />
          Add Communication Plan
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <div className="mb-4">
                <h3 className="font-semibold flex items-center">
                  <Bell className="mr-2" size={16} /> Notifications:
                </h3>
                <ul className="list-disc list-inside pl-4">
                  {plan.notifications.map((notification, index) => (
                    <li key={index}>
                      {notification.type}: {notification.frequency}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold flex items-center">
                  <RefreshCw className="mr-2" size={16} /> Updates:
                </h3>
                <p className="pl-4">
                  {plan.updates.frequency}
                  {plan.updates.day && ` on ${plan.updates.day}`}
                  {plan.updates.time && ` at ${plan.updates.time}`}
                </p>
              </div>
            </div>
          ))}
        </div>
        <ModalCPlan
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddPlan={handleAddPlan}
        />
      </div>
    </div>   
  );
};

export default CommunicationPlan;
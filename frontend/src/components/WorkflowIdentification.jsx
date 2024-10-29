import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ModalWorkflow from '../Modals/ModalWorkflow';

// Dummy data
const initialWorkflows = [
  {
    id: 1,
    name: "New Project Initiation",
    trigger: "Client signs contract",
    stakeholders: ["Project Manager", "Account Executive", "Design Lead"]
  },
  {
    id: 2,
    name: "Employee Onboarding",
    trigger: "New hire acceptance",
    stakeholders: ["HR Manager", "IT Support", "Department Head"]
  },
  {
    id: 3,
    name: "Quarterly Financial Review",
    trigger: "End of financial quarter",
    stakeholders: ["CFO", "Financial Analyst", "Department Heads"]
  }
];

const WorkflowIdentification = () => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddWorkflow = (newWorkflow) => {
    setWorkflows([...workflows, { ...newWorkflow, id: workflows.length + 1 }]);
  };

  return (
    <div className='px-4 bg-gray-200 min-h-screen'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Workflow Identification</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4"
        >
          <Plus className="mr-2" size={20} />
          Add Workflow
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{workflow.name}</h2>
              <p className="text-gray-600 mb-2">Trigger: {workflow.trigger}</p>
              <h3 className="font-semibold mt-4 mb-2">Stakeholders:</h3>
              <ul className="list-disc list-inside">
                {workflow.stakeholders.map((stakeholder, index) => (
                  <li key={index}>{stakeholder}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ModalWorkflow
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddWorkflow={handleAddWorkflow}
        />
      </div>
    </div>  
  );
};

export default WorkflowIdentification;
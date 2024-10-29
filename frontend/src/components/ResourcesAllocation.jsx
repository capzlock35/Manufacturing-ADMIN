import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import ModalResources from '../Modals/ModalResources';

const initialResources = [
  { id: 1, name: "Laptop", type: "Equipment", quantity: 10, status: "Available" },
  { id: 2, name: "Projector", type: "Equipment", quantity: 2, status: "In Use" },
  { id: 3, name: "Conference Room", type: "Facility", quantity: 1, status: "Available" },
  { id: 4, name: "Software License", type: "Digital", quantity: 50, status: "Available" }
];

const ResourcesAllocation = () => {
  const [resources, setResources] = useState(() => {
    const savedResources = localStorage.getItem('resources');
    return savedResources ? JSON.parse(savedResources) : initialResources;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  const handleAddResource = (newResource) => {
    setResources([...resources, { ...newResource, id: Date.now() }]);
  };

  const handleEditResource = (updatedResource) => {
    setResources(resources.map(resource => 
      resource.id === updatedResource.id ? updatedResource : resource
    ));
    setEditingResource(null);
  };

  const handleDeleteResource = (id) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  return (
    <div className='px-4 bg-gray-200 min-h-screen'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Resources Allocation</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4"
        >
          <Plus className="mr-2" size={20} />
          Add Resource
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="py-2 px-4 border-b">{resource.name}</td>
                  <td className="py-2 px-4 border-b">{resource.type}</td>
                  <td className="py-2 px-4 border-b">{resource.quantity}</td>
                  <td className="py-2 px-4 border-b">{resource.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(resource)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalResources
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingResource(null);
          }}
          onSave={editingResource ? handleEditResource : handleAddResource}
          resource={editingResource}
        />
      </div>
    </div>  
  );
};

export default ResourcesAllocation;
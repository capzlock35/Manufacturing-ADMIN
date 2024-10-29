import React, { useState, useEffect } from 'react';
import ModalAnnouncement from '../Modals/ModalAnnouncement';


const dummyAnnouncements = [
  { id: 1, title: 'New Feature Release', content: 'We are excited to announce the release of our latest feature...', date: new Date().toISOString() },
  { id: 2, title: 'System Maintenance', content: 'There will be a scheduled maintenance on Saturday...', date: new Date().toISOString() },
  { id: 3, title: 'Important Update', content: 'Please update your application to the latest version...', date: new Date().toISOString() },
];

const VersionControl = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const storedAnnouncements = localStorage.getItem('announcements');
    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    } else {
      setAnnouncements(dummyAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(dummyAnnouncements));
    }
  }, []);

  const updateLocalStorage = (newAnnouncements) => {
    localStorage.setItem('announcements', JSON.stringify(newAnnouncements));
    setAnnouncements(newAnnouncements);
  };

  const handleCreate = () => {
    setModalType('create');
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleView = (announcement) => {
    setModalType('view');
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement) => {
    setModalType('edit');
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = (announcement) => {
    setModalType('delete');
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDeploy = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeployModalOpen(true);
  };

  const confirmDeploy = () => {
    // Simulate sending the announcement to HR
    console.log('Deploying announcement:', selectedAnnouncement);
    
    // Show an alert with the deployment message
    alert(`Announcement "${selectedAnnouncement.title}" has been successfully deployed to HR!`);

    // Close the deployment modal
    setIsDeployModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
    setModalType(null);
  };

  const closeDeployModal = () => {
    setIsDeployModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleSubmit = (data) => {
    let newAnnouncements;
    if (modalType === 'create') {
      newAnnouncements = [...announcements, { ...data, id: Date.now() }];
    } else if (modalType === 'edit') {
      newAnnouncements = announcements.map(a => a.id === selectedAnnouncement.id ? { ...a, ...data } : a);
    } else if (modalType === 'delete') {
      newAnnouncements = announcements.filter(a => a.id !== selectedAnnouncement.id);
    }
    updateLocalStorage(newAnnouncements);
    closeModal();
  };

  return (
    <div className="p-2 sm:p-4 min-h-screen bg-gray-200">
      <div className="container mx-auto p-2 sm:p-4">
        <div className="bg-white p-2 mb-6 rounded-lg shadow-md">
         <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">Version Control (Announcement)</h1>
       </div>
        <button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create Announcement
        </button>
        <div className="mt-4 border ">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-4 mb-2 rounded shadow-md ">
              <h2 className="text-lg font-bold text-black">{announcement.title}</h2>
              <p className="text-gray-700">{announcement.content}</p>
              <p className="text-sm text-gray-500">Published on: {new Date(announcement.date).toLocaleDateString()}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => handleView(announcement)} className="bg-green-500 text-white px-2 py-1 rounded">View</button>
                <button onClick={() => handleEdit(announcement)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(announcement)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                <button onClick={() => handleDeploy(announcement)} className="bg-blue-600 text-white px-2 py-1 rounded">Deploy</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <ModalAnnouncement
          type={modalType}
          announcement={selectedAnnouncement}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {isDeployModalOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">Confirm Deployment</h2>
            <p className='text-black'>Are you sure you want to deploy this announcement to HR?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={confirmDeploy} className="bg-blue-500 text-white px-4 py-2 rounded">
                Yes, Deploy
              </button>
              <button onClick={closeDeployModal} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionControl;

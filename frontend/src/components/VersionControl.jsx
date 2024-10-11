import React, { useState, useEffect } from 'react';
import ModalAnnouncement from '../Modal/ModalAnnouncement';

const dummyAnnouncements = [
  { id: 1, title: 'New Feature Release', content: 'We are excited to announce the release of our latest feature...' },
  { id: 2, title: 'System Maintenance', content: 'There will be a scheduled maintenance on Saturday...' },
  { id: 3, title: 'Important Update', content: 'Please update your application to the latest version...' },
];

const VersionControl = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
    setModalType(null);
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
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Version Control</h1>
        <button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Announcement
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">{announcement.title}</h2>
              <p className="mb-4 text-sm sm:text-base">{announcement.content.substring(0, 100)}...</p>
              <div className="flex flex-wrap justify-end space-x-2 space-y-2">
                <button
                  onClick={() => handleView(announcement)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(announcement)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(announcement)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <ModalAnnouncement
            type={modalType}
            announcement={selectedAnnouncement}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default VersionControl;
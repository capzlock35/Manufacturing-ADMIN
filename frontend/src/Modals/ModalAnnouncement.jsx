import React, { useState, useEffect } from 'react';

const ModalAnnouncement = ({ type, announcement, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || '');
      setContent(announcement.content || '');
      setDate(announcement.date || ''); // Initialize date from announcement
    }
  }, [announcement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, date }); // Include date in submission
  };

  const renderContent = () => {
    switch (type) {
      case 'create':
        return (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">Create Announcement</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded bg-white text-black border-blue-400"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="w-full p-2 mb-4 border rounded bg-white text-black border-blue-400"
              rows="4"
              required
            ></textarea>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-gray-200 text-black border-blue-400"
              required
            />
            <div className="flex justify-end space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Publish
              </button>
              <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        );
      case 'view':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">{announcement.title}</h2>
            <p className="mb-4 text-black">{announcement.content}</p>
            <p className="text-sm text-gray-500">Published: {new Date(announcement.date).toLocaleDateString()}</p> {/* Display the date */}
            <p className="text-sm text-gray-500">Published by: {announcement.publishedBy}</p>
            {announcement.editedAt && (
              <p className="text-sm text-gray-500">Last edited: {announcement.editedAt}</p>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        );
      case 'edit':
        return (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-black to-blue-400 text-transparent bg-clip-text">Edit Announcement</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded bg-white text-black border-blue-400"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="w-full p-2 mb-4 border rounded bg-white text-black border-blue-400"
              rows="4"
              required
            ></textarea>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-gray-200text-black border-blue-400 bg-gray-200 text-black"
              required
            />
            <div className="flex justify-end space-x-2">
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
                Update
              </button>
              <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        );
      case 'delete':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-500 to-red-500 text-transparent bg-clip-text">Confirm Delete</h2>
            <p className='text-black'>Are you sure you want to delete this announcement?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2 rounded">
                Yes, Delete
              </button>
              <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className=" z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default ModalAnnouncement;

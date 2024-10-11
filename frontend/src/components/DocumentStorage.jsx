import React, { useState, useEffect } from 'react';
import ModalStorage from '../Modal/ModalStorage';

const dummyDocuments = [
  { id: 1, name: 'Project Proposal', type: 'pdf', size: '2.5 MB', uploadDate: '2023-05-15' },
  { id: 2, name: 'Financial Report', type: 'xlsx', size: '1.8 MB', uploadDate: '2023-05-20' },
  { id: 3, name: 'User Manual', type: 'docx', size: '3.2 MB', uploadDate: '2023-05-25' },
];

const DocumentStorage = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    setDocuments(dummyDocuments);
  }, []);

  const handleUpload = () => {
    setModalType('upload');
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleView = (document) => {
    setModalType('view');
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleDelete = (document) => {
    setModalType('delete');
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
    setModalType(null);
  };

  const handleSubmit = (data) => {
    if (modalType === 'upload') {
      setDocuments([...documents, { ...data, id: Date.now() }]);
    } else if (modalType === 'delete') {
      setDocuments(documents.filter(d => d.id !== selectedDocument.id));
    }
    closeModal();
  };

  return (
    <div className="p-2 sm:p-4 min-h-screen bg-gray-100">
      <div className="container mx-auto p-2 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Document Storage</h1>
        <button
          onClick={handleUpload}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Upload Document
        </button>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left hidden sm:table-cell">Type</th>
                <th className="py-3 px-6 text-left hidden md:table-cell">Size</th>
                <th className="py-3 px-6 text-left hidden lg:table-cell">Upload Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {documents.map((document) => (
                <tr key={document.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{document.name}</td>
                  <td className="py-3 px-6 text-left hidden sm:table-cell">{document.type}</td>
                  <td className="py-3 px-6 text-left hidden md:table-cell">{document.size}</td>
                  <td className="py-3 px-6 text-left hidden lg:table-cell">{document.uploadDate}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleView(document)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-1 sm:mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(document)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <ModalStorage
            type={modalType}
            document={selectedDocument}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentStorage;
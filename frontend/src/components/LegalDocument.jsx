import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, Edit2, Trash2, Eye } from 'lucide-react';
import ModalLegal from '../Modals/ModalLegal';

const LegalDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  // Dummy data
  const dummyDocs = [
    {
      id: 1,
      title: 'Employee Contract Template',
      type: 'contract',
      version: '1.2',
      lastModified: '2024-10-15',
      createdBy: 'John Doe',
      status: 'active',
      attachments: ['contract.pdf'],
      description: 'This is a sample description for the Employee Contract Template.',
    },
    {
      id: 2,
      title: 'Privacy Policy',
      type: 'compliance',
      version: '2.0',
      lastModified: '2024-10-20',
      createdBy: 'Jane Smith',
      status: 'review',
      attachments: ['privacy.pdf', 'appendix.docx'],
      description: 'This document provides an outline of privacy policies.',
    },
    {
      id: 3,
      title: 'Patent Application',
      type: 'ip',
      version: '1.0',
      lastModified: '2024-10-22',
      createdBy: 'Mike Johnson',
      status: 'draft',
      attachments: ['patent.pdf'],
      description: 'Description of the patent application process.',
    },
  ];

  useEffect(() => {
    setDocuments(dummyDocs);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  const filteredDocuments = documents
    .filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(doc => filterType === 'all' ? true : doc.type === filterType);

  const handleCreate = () => {
    setModalMode('create');
    setSelectedDoc(null);
    setIsModalOpen(true);
  };

  const handleEdit = (doc) => {
    setModalMode('edit');
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.title}`);
  };

  // Opens modal in view-only mode for reading the document
  const handleView = (doc) => {
    setModalMode('view');
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const onModalSubmit = (formData) => {
    if (modalMode === 'create') {
      setDocuments(docs => [...docs, {
        ...formData,
        id: docs.length + 1,
        version: '1.0',
        lastModified: new Date().toISOString().split('T')[0],
      }]);
    } else if (modalMode === 'edit') {
      setDocuments(docs => docs.map(doc => 
        doc.id === selectedDoc.id ? { ...doc, ...formData } : doc
      ));
    }
    setIsModalOpen(false);
  };

  return (
    <div className='px-4 bg-gray-200 min-h-screen'>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Legal Documents</h1>
          <button 
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={16} /> New Document
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              />
            </div>
            <select
              value={filterType}
              onChange={handleFilter}
              className="w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="all">All Types</option>
              <option value="contract">Contracts</option>
              <option value="compliance">Compliance</option>
              <option value="ip">Intellectual Property</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredDocuments.map(doc => (
              <div 
                key={doc.id} 
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{doc.title}</h3>
                    <div className="text-sm text-gray-500">
                      Version: {doc.version} | Last Modified: {doc.lastModified}
                    </div>
                    <div className="text-sm text-gray-500">
                      Type: {doc.type} | Status: {doc.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(doc)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> 

        <ModalLegal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          document={selectedDoc}
        />
      </div>
    </div>
  );
};

export default LegalDocument;

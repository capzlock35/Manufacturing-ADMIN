import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Download } from 'lucide-react';
import ModalStorage from '../Modals/ModalStorage';
import jjm from "../assets/jjmlogo.jpg"

// Initial dummy data
const DUMMY_DATA = [
  {
    id: 1,
    title: 'Invoice #2024001',
    date: '2024-03-15',
    category: 'Invoice',
    status: 'Approved',
    description: 'Manufacturing equipment purchase',
    attachmentName: 'invoice2024001.pdf'
  },
  {
    id: 2,
    title: 'Receipt #2024002',
    date: '2024-03-16',
    category: 'Receipt',
    status: 'Pending',
    description: 'Office supplies',
    attachmentName: 'receipt2024002.pdf'
  },
  {
    id: 3,
    title: 'Purchase Order #2024003',
    date: '2024-03-17',
    category: 'Purchase Order',
    status: 'Approved',
    description: 'Raw materials for production',
    attachmentName: 'po2024003.pdf'
  }
];

const DocumentStorage = () => {
  const [documents, setDocuments] = useState(() => {
    const storedDocs = localStorage.getItem('financialDocuments');
    return storedDocs ? JSON.parse(storedDocs) : DUMMY_DATA;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);

  useEffect(() => {
    localStorage.setItem('financialDocuments', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (newDocument) => {
    const documentWithId = {
      ...newDocument,
      id: Date.now(),
    };
    setDocuments(prev => [...prev, documentWithId]);
  };

  const updateDocument = (updatedDocument) => {
    const documentToUpdate = {
      ...updatedDocument,
    };
    setDocuments(prev =>
      prev.map(doc => doc.id === documentToUpdate.id ? documentToUpdate : doc)
    );
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='px-4 bg-gray-200 min-h-screen'>
      
      
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md"> {/* Container for the title */}
            <h1 className="text-4xl font-extrabold drop-shadow-lg text-center bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">Document Tracking</h1>
          </div>
        </div>  
        

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditingDocument(null);
              setViewDocument(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Document</span>
          </button>
        </div>

        {/* Container for the document table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No documents found. Try adjusting your search or add a new document.
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{doc.title}</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">Date: {doc.date}</p>
                        <p className="text-sm text-gray-600">Category: {doc.category}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          doc.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setViewDocument(doc);
                          setEditingDocument(null);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingDocument(doc);
                          setViewDocument(null);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this document?')) {
                            deleteDocument(doc.id);
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                      {/* Download Button */}
                      <a
                        href={`/path-to-your-documents/${doc.attachmentName}`}
                        download={doc.attachmentName}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Download"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {isModalOpen && (
          <ModalStorage
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingDocument(null);
              setViewDocument(null);
            }}
            onSubmit={editingDocument ? updateDocument : addDocument}
            document={editingDocument || viewDocument}
            viewOnly={!!viewDocument}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentStorage;

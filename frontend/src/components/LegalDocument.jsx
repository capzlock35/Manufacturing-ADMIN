import React, { useState } from 'react';
import { Clock, FileText, History, Plus, Search, Upload } from 'lucide-react';
import ModalLegal from '../Modal/ModalLegal';

// Dummy data for documents
const dummyDocuments = [
  {
    id: 1,
    title: 'Employment Contract',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
    version: 2.0,
    status: 'active',
    content: 'This employment agreement is made between...',
    versions: [
      { version: 2.0, date: '2024-03-20', author: 'Jane Smith' },
      { version: 1.0, date: '2024-03-15', author: 'John Doe' }
    ]
  },
  {
    id: 2,
    title: 'NDA Agreement',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
    version: 1.0,
    status: 'draft',
    content: 'This Non-Disclosure Agreement (NDA) is entered into...',
    versions: [
      { version: 1.0, date: '2024-03-10', author: 'John Doe' }
    ]
  }
];


const LegalDocument = () => {
  const [documents, setDocuments] = useState(dummyDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDocument = (newDoc) => {
    setDocuments([...documents, {
      ...newDoc,
      id: documents.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      version: 1.0,
      versions: [{
        version: 1.0,
        date: new Date().toISOString().split('T')[0],
        author: 'Current User'
      }]
    }]);
  };

  const openModalLegal = (doc = null) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  return (
    <div className='p-4 min-h-screen bg-gray-100'>
        <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-black">Legal Document Management</h1>
            <div className="flex justify-between items-center">
            <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button
                onClick={() => openModalLegal()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus className="h-5 w-5" />
                New Document
            </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-zinc-100">
            {filteredDocuments.map((doc) => (
            <div
                key={doc.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-black"
                onClick={() => openModalLegal(doc)}
            >
                <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                    doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {doc.status}
                </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Updated: {doc.updatedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Version: {doc.version}</span>
                </div>
                </div>
            </div>
            ))}
        </div>

        {isModalOpen && (
            <ModalLegal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            document={selectedDoc}
            onSave={handleCreateDocument}
            />
        )}
        </div>
    </div>    
  );
}

export default LegalDocument;
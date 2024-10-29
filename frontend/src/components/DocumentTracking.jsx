import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Clock, AlertCircle, Download } from 'lucide-react';
import ModalTracking from '../Modals/ModalTracking';

// Document status options
const DocumentTracking = () => {
  const STATUS_OPTIONS = {
    DRAFT: 'Draft',
    REVIEW: 'Under Review',
    APPROVED: 'Approved',
    ARCHIVED: 'Archived'
  };

  const PROCESS_STAGES = {
    REVIEW: 'Review',
    APPROVAL: 'Approval',
    FINALIZATION: 'Finalization'
  };

  const DUMMY_DATA = [
    {
      id: 1,
      title: 'Q1 Financial Report',
      type: 'Financial',
      currentStatus: STATUS_OPTIONS.REVIEW,
      currentStage: PROCESS_STAGES.REVIEW,
      priority: 'High',
      assignedTo: 'John Doe',
      createdDate: '2024-03-15',
      dueDate: '2024-03-30',
      lastModified: '2024-03-20',
      fileUrl: '/path/to/financial-report-q1.pdf',
      history: [{ stage: PROCESS_STAGES.REVIEW, date: '2024-03-20', user: 'Mike Johnson' }],
    },
    {
      id: 2,
      title: 'Manufacturing SOP Update',
      type: 'Procedure',
      currentStatus: STATUS_OPTIONS.DRAFT,
      currentStage: PROCESS_STAGES.FINALIZATION,
      priority: 'Medium',
      assignedTo: 'Jane Smith',
      createdDate: '2024-03-16',
      dueDate: '2024-04-15',
      lastModified: '2024-03-19',
      fileUrl: '/path/to/manufacturing-sop-update.pdf',
      history: [{ stage: PROCESS_STAGES.FINALIZATION, date: '2024-03-19', user: 'Jane Smith' }],
    }
  ];

  const [documents, setDocuments] = useState(() => {
    const storedDocs = localStorage.getItem('trackedDocuments');
    return storedDocs ? JSON.parse(storedDocs) : DUMMY_DATA;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    localStorage.setItem('trackedDocuments', JSON.stringify(documents));
  }, [documents]);

  
  const addDocument = (newDocument) => {
    const documentWithId = {
      ...newDocument,
      id: Date.now(),
      history: [{
        stage: PROCESS_STAGES.REVIEW,
        date: new Date().toISOString().split('T')[0],
        user: newDocument.assignedTo
      }],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev, documentWithId]);
  };

  const updateDocument = (updatedDocument) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === updatedDocument.id) {
        const newHistory = [...doc.history];
        if (doc.currentStage !== updatedDocument.currentStage) {
          newHistory.push({
            stage: updatedDocument.currentStage,
            date: new Date().toISOString().split('T')[0],
            user: updatedDocument.assignedTo
          });
        }
        return {
          ...updatedDocument,
          history: newHistory,
          lastModified: new Date().toISOString().split('T')[0]
        };
      }
      return doc;
    }));
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Dont Remove For Status Color Purposes
  const getStatusColor = (status) => {
    switch (status) {
      case STATUS_OPTIONS.DRAFT: return 'bg-gray-100 text-gray-800';
      case STATUS_OPTIONS.REVIEW: return 'bg-yellow-100 text-yellow-800';
      case STATUS_OPTIONS.APPROVED: return 'bg-green-100 text-green-800';
      case STATUS_OPTIONS.ARCHIVED: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

    // Dont Remove for Filter Search Purposes
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || doc.currentStatus.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='px4 bg-gray-200 min-h-screen'>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md"> {/* Container for the title */}
            <h1 className="text-4xl font-extrabold drop-shadow-lg text-center bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">Document Tracking</h1>
          </div>
        </div>
        {/* Filters and Actions */}
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
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {Object.values(STATUS_OPTIONS).map(status => (
              <option key={status} value={status.toLowerCase()}>{status}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingDocument(null);
              setViewDocument(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Document</span>
          </button>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents found. Try adjusting your search or create a new document.
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-800">{doc.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.currentStatus)}`}>
                        {doc.currentStatus}
                      </span>
                      <span className={`text-sm ${getPriorityColor(doc.priority)}`}>
                        {doc.priority} Priority
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">Type: {doc.type}</p>
                      <p className="text-sm text-gray-600">Current Stage: {doc.currentStage}</p>
                      <p className="text-sm text-gray-600">Assigned to: {doc.assignedTo}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>Due: {doc.dueDate}</span>
                      </div>
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
                      title="View Details"
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

                {/* Progress Timeline */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    {Object.values(PROCESS_STAGES).map((stage, index) => (
                      <div
                        key={stage}
                        className={`flex flex-col items-center flex-1 ${
                          index < Object.values(PROCESS_STAGES).indexOf(doc.currentStage)
                            ? 'text-green-600'
                            : index === Object.values(PROCESS_STAGES).indexOf(doc.currentStage)
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full mb-1 border-2 border-current"></div>
                        <span className="text-xs text-center hidden md:block">{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <ModalTracking
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingDocument(null);
              setViewDocument(null);
            }}
            onSubmit={editingDocument ? updateDocument : addDocument}
            document={editingDocument || viewDocument}
            viewOnly={!!viewDocument}
            statusOptions={STATUS_OPTIONS}
            processStages={PROCESS_STAGES}

          />
        )}
      </div>
    </div>   
  );
};

export default DocumentTracking;
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';

  const baseURL = process.env.NODE_ENV === 'production'
      ? 'https://backend-admin.jjm-manufacturing.com/api/documents'
      : 'http://localhost:7690/api/documents';

  const DocumentStorage = () => {
      const [documents, setDocuments] = useState([]);
      const [newDocument, setNewDocument] = useState({
          title: '',
          date: '',
          category: 'invoice',
          status: 'Pending',
          description: '',
          file: null,
          attachmentName: null // Add this
      });
      const [editingDocumentId, setEditingDocumentId] = useState(null);
      const [viewingDocumentId, setViewingDocumentId] = useState(null);
      const [isEditing, setIsEditing] = useState(false);

      useEffect(() => {
          fetchDocuments();
      }, []);

      useEffect(() => {
          if (editingDocumentId) {
              setIsEditing(true);
              const documentToEdit = documents.find((doc) => doc._id === editingDocumentId);
              setNewDocument({ ...documentToEdit });
          } else {
              setIsEditing(false);
              setNewDocument({
                  title: '',
                  date: '',
                  category: 'invoice',
                  status: 'Pending',
                  description: '',
                  file: null,
                  attachmentName: null
              });
          }
      }, [editingDocumentId, documents]);

      const fetchDocuments = async () => {
          try {
              const response = await axios.get(`${baseURL}/get`);
              setDocuments(response.data);
          } catch (error) {
              console.error("Error fetching documents:", error);
          }
      };

      const handleInputChange = (e) => {
          const { name, value } = e.target;
          setNewDocument({ ...newDocument, [name]: value });
      };

      const handleFileChange = (e) => {
          setNewDocument({ ...newDocument, file: e.target.files[0] });
      };

      const handleSubmit = async (e) => {
          e.preventDefault();

          if (!newDocument.title || !newDocument.date) {
              alert('Title and Date are required.');
              return;
          }

          try {
              const formData = new FormData();
              formData.append('title', newDocument.title);
              formData.append('date', newDocument.date);
              formData.append('category', newDocument.category);
              formData.append('status', newDocument.status);
              formData.append('description', newDocument.description);
              if (newDocument.file) {
                  formData.append('file', newDocument.file); // Append the file
              }

              if (isEditing) {
                  await handleUpdateDocument(formData);
              } else {
                  await axios.post(`${baseURL}/create`, formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data', // Important for files
                      },
                  });

                  fetchDocuments()
              }

              // Reset the form
              setNewDocument({
                  title: '',
                  date: '',
                  category: 'invoice',
                  status: 'Pending',
                  description: '',
                  file: null,
                  attachmentName: null
              });
          } catch (error) {
              console.error("Error submitting document:", error);
              alert("Error submitting document");
          }
      };

      const handleDelete = async (id) => {
          try {
              await axios.delete(`${baseURL}/delete/${id}`);
              fetchDocuments()
          } catch (error) {
              console.error("Error deleting document:", error);
              alert("Error deleting document");
          }
      };

      const handleStatusChange = async (id, newStatus) => {
          try {
              await axios.put(`${baseURL}/update/${id}`, { status: newStatus });
              fetchDocuments()
          } catch (error) {
              console.error("Error updating status:", error);
              alert("Error updating status");
          }
      };

      const handleEdit = (id) => {
          setEditingDocumentId(id);
      };

      const handleCancelEdit = () => {
          setEditingDocumentId(null);
      };

      const handleView = (id) => {
          setViewingDocumentId(id);
      };

      const handleUpdateDocument = async (formData) => {
          try {
              await axios.put(`${baseURL}/update/${editingDocumentId}`, formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data', // Important for files
                  },
              });
              fetchDocuments()
              setEditingDocumentId(null);

              setNewDocument({
                  title: '',
                  date: '',
                  category: 'invoice',
                  status: 'Pending',
                  description: '',
                  file: null,
                  attachmentName: null
              });
          } catch (error) {
              console.error("Error updating document:", error);
              alert("Error updating document");
          }
      };

      return (
          <div className='flex items-center justify-center min-h-screen bg-white p-7 '>
              <div className=" container mx-auto p-4 bg-gray-200">
                  <h1 className="text-2xl font-bold mb-4 text-black">Document Storage</h1>

                  {/* Add/Edit Document Form */}
                  <form onSubmit={handleSubmit} className="mb-4 bg-white shadow-md rounded px-8 pt-6 pb-8">
                      <h2 className="text-xl font-semibold mb-2 text-black">{isEditing ? 'Edit Document' : 'Add Document'}</h2>

                      <div className="mb-4">
                          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                              Title:
                          </label>
                          <input
                              type="text"
                              id="title"
                              name="title"
                              value={newDocument.title}
                              onChange={handleInputChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Document Title"
                              required
                          />
                      </div>

                      <div className="mb-4">
                          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                              Date:
                          </label>
                          <input
                              type="date"
                              id="date"
                              name="date"
                              value={newDocument.date}
                              onChange={handleInputChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-300 border-black leading-tight focus:outline-none focus:shadow-outline"
                              required
                          />
                      </div>

                      <div className="mb-4">
                          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                              Category:
                          </label>
                          <select
                              id="category"
                              name="category"
                              value={newDocument.category}
                              onChange={handleInputChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                          >
                              <option value="invoice">Invoice</option>
                              <option value="receipt">Receipt</option>
                              <option value="purchase order">Purchase Order</option>
                              <option value="other">Other</option>
                          </select>
                      </div>

                      <div className="mb-4">
                          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                              Description:
                          </label>
                          <textarea
                              id="description"
                              name="description"
                              value={newDocument.description}
                              onChange={handleInputChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Document Description"
                              rows="3"
                          />
                      </div>

                      <div className="mb-4">
                          <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">
                              File Attachment:
                          </label>
                          <input
                              type="file"
                              id="file"
                              name="file"
                              onChange={handleFileChange}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                      </div>

                      <div className="flex justify-between">
                          <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                              {isEditing ? 'Update Document' : 'Add Document'}
                          </button>
                          {isEditing && (
                              <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              >
                                  Cancel Edit
                              </button>
                          )}
                      </div>
                  </form>

                  {/* Document Table */}
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Title
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Date
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Category
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Status
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Description
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      File
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                  </th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {documents.map((document) => (
                                  <tr key={document._id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.title}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.date}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.category}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          <select
                                              value={document.status}
                                              onChange={(e) => handleStatusChange(document._id, e.target.value)}
                                              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 bg-white border-black leading-tight focus:outline-none focus:shadow-outline"
                                          >
                                              <option value="pending">Pending</option>
                                              <option value="approved">Approved</option>
                                              <option value="rejected">Rejected</option>
                                          </select>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-500">{document.description}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {document.attachmentName && ( // Check for attachmentName, not file.
                                              <a
                                                  href={`${baseURL}/${document._id}`}  // Replace with your actual download URL
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-500 hover:text-blue-700"
                                              >
                                                  View File
                                              </a>
                                          )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <button
                                              onClick={() => handleView(document._id)}
                                              className="text-blue-600 hover:text-blue-900 mr-2"
                                          >
                                              View
                                          </button>
                                          <button
                                              onClick={() => handleEdit(document._id)}
                                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                                          >
                                              Edit
                                          </button>
                                          <button
                                              onClick={() => handleDelete(document._id)}
                                              className="text-red-600 hover:text-red-900"
                                          >
                                              Delete
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>

                  {/* Document View Modal */}
                  {viewingDocumentId && (
                      <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                          Document Details
                                      </h3>
                                      {(() => {
                                          const viewingDocument = documents.find((doc) => doc._id === viewingDocumentId);
                                          return viewingDocument ? (
                                              <div className="mt-2">
                                                  <p>
                                                      <strong>Title:</strong> {viewingDocument.title}
                                                  </p>
                                                  <p>
                                                      <strong>Date:</strong> {viewingDocument.date}
                                                  </p>
                                                  <p>
                                                      <strong>Category:</strong> {viewingDocument.category}
                                                  </p>
                                                  <p>
                                                      <strong>Status:</strong> {viewingDocument.status}
                                                  </p>
                                                  <p>
                                                      <strong>Description:</strong> {viewingDocument.description}
                                                  </p>
                                                  {viewingDocument.attachmentName && ( // Check for attachmentName
                                                      <p>
                                                          <strong>File:</strong>
                                                          <a
                                                              href={`${baseURL}/download/${viewingDocument._id}`} // Replace with your actual download URL
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              className="text-blue-500 hover:text-blue-700"
                                                          >
                                                              View File
                                                          </a>
                                                      </p>
                                                  )}
                                                  {/* Tracking Events */}
                                                  <div className="mt-4">
                                                      <h4 className="text-md font-bold mb-2">Tracking Events</h4>
                                                      <ul>
                                                          {viewingDocument.tracking.map((event) => (  // Access tracking events from the document
                                                              <li key={event._id}>
                                                                  {new Date(event.timestamp).toLocaleString()} - {event.message}
                                                              </li>
                                                          ))}
                                                      </ul>
                                                  </div>
                                              </div>
                                          ) : (
                                              <p>Document not found.</p>
                                          );
                                      })()}
                                  </div>
                                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                      <button
                                          type="button"
                                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                          onClick={() => setViewingDocumentId(null)}
                                      >
                                          Close
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  export default DocumentStorage;
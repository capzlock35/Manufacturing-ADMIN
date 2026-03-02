import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Hr3Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic API URL for local and production

  const API_BASE_URL = process.env.NODE_ENV === 'production'
      ? 'https://backend-admin.jjm-manufacturing.com/api' // Base URL of your backend in production
      : 'http://localhost:7690/api'; // Base URL of your backend in development


  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        // **CHANGED LINE:** Frontend now calls your backend endpoint `/hr3-documents`
           const response = await axios.get(`${API_BASE_URL}/hr3-documents`); // CORRECTED LINE in Hr3Documents.js
        // No need to fetch token in frontend anymore

        console.log("response.data:", response.data); // Debug log (backend response)
        console.log("response.data.documents:", response.data.documents); // Log documents array (backend response)

        // Extract the documents array from backend response
        const documentsArray = response.data.documents;

        // Ensure it's an array (backend should handle this, but good to check)
        if (!Array.isArray(documentsArray)) {
          console.error("❌ Expected an array from backend but got:", documentsArray);
          setError("Unexpected data format received from server."); // More informative error
          return;
        }

        // Transform API response (still needed as backend just proxies data)
        const formattedDocuments = documentsArray.map(doc => ({
          name: doc.description,
          pdfUrl: doc.documentFile
        }));

        setDocuments(formattedDocuments);
      } catch (error) {
        console.error("Error fetching HR3 documents from backend:", error);
        if (error.response) {
          setError(`Failed to load HR3 documents. Status: ${error.response.status}. ${error.response.data.error || ''} ${error.response.data.error || ''} ${error.response.data.details || ''}`);
        } else {
          setError("Failed to load HR3 documents. Network error.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">HR3 Documents</h2>

        {loading ? ( // Show skeleton loading when loading is true
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border"><Skeleton width={100} /></th>
                    <th className="px-4 py-2 border"><Skeleton width={100} /></th>
                    <th className="px-4 py-2 border"><Skeleton width={80} /></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }).map((_, index) => ( // Render 3 skeleton rows as example
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border"><Skeleton /></td>
                      <td className="px-4 py-2 border"><Skeleton width={150} /></td>
                      <td className="px-4 py-2 border"><Skeleton width={100} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Error: {error}</div>
        ) : !loading && !error && documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Document Name</th>
                  <th className="px-4 py-2 border">PDF File</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{document.name || 'Document'}</td>
                    <td className="px-4 py-2 border">
                      {document.pdfUrl ? (
                        <a
                          href={document.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-gray-500">No PDF Available</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {document.pdfUrl && (
                        <a
                          href={document.pdfUrl}
                          download={`${document.name || 'document'}.pdf`}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && !error && <div className="text-center">No documents available.</div>
        )}
      </div>
    </div>
  );
};

export default Hr3Documents;
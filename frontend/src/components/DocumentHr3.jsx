import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Hr3Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic API URL for local and production

    const API_BASE_URL = 'https://gateway.jjm-manufacturing.com/hr3';

const authURL = process.env.NODE_ENV === 'production'
  ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-tokenG'
  : 'http://localhost:7690/api/auth/get-tokenG';

useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const tokenResponse = await axios.get(authURL, { withCredentials: true });
      const token = tokenResponse.data.token;
  
      if (!token) {
        console.error("🚨 No token received from backend!");
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/get-documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("response.data:", response.data); // Debug log
      console.log("response.data.documents:", response.data.documents); // Log the documents array
  
      // Extract the documents array
      const documentsArray = response.data.documents; 
  
      // Ensure it's an array before using map
      if (!Array.isArray(documentsArray)) {
        console.error("❌ Expected an array but got:", documentsArray);
        return;
      }
  
      // Transform API response
      const formattedDocuments = documentsArray.map(doc => ({
        name: doc.description,
        pdfUrl: doc.documentFile
      }));
  
      setDocuments(formattedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchDocuments();
}, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">HR3 Documents</h2>

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-500 text-center">Error: {error}</div>}

        {!loading && !error && documents.length > 0 ? (
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

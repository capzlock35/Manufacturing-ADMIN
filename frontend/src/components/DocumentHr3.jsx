import React, { useState } from 'react';

const Hr3DocumentDummy = () => {
  // --- Dummy Data for Documents ---
  const dummyDocuments = [
    {
      name: 'Employee Handbook 2023',
      pdfUrl: '/dummy-pdfs/employee-handbook-2023.pdf', // Replace with actual or dummy PDF path
    },
    {
      name: 'Confidentiality Agreement',
      pdfUrl: '/dummy-pdfs/confidentiality-agreement.pdf', // Replace with actual or dummy PDF path
    },
    {
      name: 'Performance Review Template',
      pdfUrl: '/dummy-pdfs/performance-review-template.pdf', // Replace with actual or dummy PDF path
    },
    {
      name: 'Benefits Enrollment Guide',
      pdfUrl: null, // Example of a document without a PDF URL
    },
  ];

  const [documents, setDocuments] = useState(dummyDocuments); // Initialize state with dummy data

  return (
    <div className="min-h-screen bg-gray-100 py-6">
        <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">HR3 Documents</h2>

        {documents.length > 0 ? ( // Check if there are documents to display
            <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 border">Document Name</th>
                    <th className="px-4 py-2 border">PDF File</th>
                    <th className="px-4 py-2 border">Actions</th> {/* Actions column */}
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
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block"
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
            <div className="text-center">No documents available.</div>
        )}
        </div>
    </div>
  );
};

export default Hr3DocumentDummy;
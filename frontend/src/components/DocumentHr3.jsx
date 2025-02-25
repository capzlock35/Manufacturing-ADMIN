import React, { useState, useEffect } from "react";
// import axios from "axios"; // Uncomment when integration starts

const DocumentHr3 = () => {
  const [documents, setDocuments] = useState([]);

  // useEffect(() => {
  //   axios.get("/api/hr3/documents").then((response) => {
  //     setDocuments(response.data);
  //   });
  // }, []);

  return (
    <div className="min-h-screen bg-white py-6"> 
        <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4 text-black">HR3 Documents</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
                <tr>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Action</th>
                </tr>
            </thead>
            <tbody>
                {documents.length === 0 ? (
                <tr>
                    <td colSpan="6" className="text-center py-4 bg-gray-200 border-black border text-gray-500">No Documents</td>
                </tr>
                ) : (
                documents.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{doc.title}</td>
                    <td className="py-2 px-4">{doc.date}</td>
                    <td className="py-2 px-4">{doc.category}</td>
                    <td className={`py-2 px-4 ${doc.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>{doc.status}</td>
                    <td className="py-2 px-4">{doc.description}</td>
                    <td className="py-2 px-4">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">
                        View
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  );
};

export default DocumentHr3;

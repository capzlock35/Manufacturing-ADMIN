import React from 'react';

const DocumentStorage = () => {
  return (
    <div className="p-4 bg-gray-200 h-screen"> {/* Added bg-white class here */}
      <h1 className="text-2xl font-bold mb-4">Document Storage</h1>
      <p>This is the Document Storage overview. Add your components and logic here.</p>

      {/* Sample Table */}
      <table className="min-w-full  bg-white border border-white mt-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4 border-b">Document Name</th>
            <th className="py-2 px-4 border-b">Upload Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">Vendor Agreement</td>
            <td className="py-2 px-4 border-b">2024-09-15</td>
            <td className="py-2 px-4 border-b">Approved</td>
            <td className="py-2 px-4 border-b">
              <button className="text-blue-500 hover:underline">View</button>
              <button className="text-red-500 hover:underline ml-2">Delete</button>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Purchase Order #12345</td>
            <td className="py-2 px-4 border-b">2024-09-10</td>
            <td className="py-2 px-4 border-b">Pending</td>
            <td className="py-2 px-4 border-b">
              <button className="text-blue-500 hover:underline">View</button>
              <button className="text-red-500 hover:underline ml-2">Delete</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentStorage;
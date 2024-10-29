import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Edit2, Trash2 } from 'lucide-react';
import ModalContract from '../Modals/ModalContract';

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load contracts from localStorage on component mount
  useEffect(() => {
    const savedContracts = localStorage.getItem('contracts');
    if (savedContracts && savedContracts !== 'undefined') {
      setContracts(JSON.parse(savedContracts));
    }
  }, []);

  useEffect(() => {
    if (contracts.length > 0) {
      localStorage.setItem('contracts', JSON.stringify(contracts));
    }
  }, [contracts]);

  const handleAddContract = (newContract) => {
    setContracts([...contracts, { ...newContract, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleEditContract = (updatedContract) => {
    setContracts(
      contracts.map((contract) =>
        contract.id === updatedContract.id ? updatedContract : contract
      )
    );
    setIsModalOpen(false);
    setEditingContract(null);
  };

  const handleDeleteContract = (id) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      const updatedContracts = contracts.filter((contract) => contract.id !== id);
      setContracts(updatedContracts);
      localStorage.setItem('contracts', JSON.stringify(updatedContracts)); // Ensure localStorage is updated
    }
  };

  const handleDownload = (fileData) => {
    if (!fileData) return;

    const { base64Data, fileName, fileType } = fileData;
    const link = document.createElement('a');
    link.href = `data:${fileType};base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Function to truncate long descriptions
  const truncateDescription = (description, maxLength) => {
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  return (
    <div className='px-4 bg-gray-200 min-h-screen'>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md"> {/* Container for the title */}
            <h1 className="text-4xl font-extrabold drop-shadow-lg text-center bg-gradient-to-r from-black to-green-300 text-transparent bg-clip-text">Contract Management</h1>
          </div>
        </div>
        {/* New container for Search, Filter, and Contracts */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-300">

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contracts..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black border-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg bg-white border-black"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
            </select>
            <button
              onClick={() => {
                setEditingContract(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              New Contract
            </button>
          </div>

          {/* Contracts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="bg-zinc-300 p-6 rounded-lg shadow-md border border-black">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{contract.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      contract.status === 'approved' ? 'bg-green-100 text-green-800' :
                      contract.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    } mt-2`}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingContract(contract);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteContract(contract.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Truncate long descriptions */}
                <p className="text-black mb-4">{truncateDescription(contract.description, 100)}</p> {/* Set the max length here */}
                <div className="flex justify-between items-center text-sm text-blue-600">
                  <span>Created: {new Date(contract.date).toLocaleDateString()}</span>
                  {contract.file && (
                    <button
                      onClick={() => handleDownload(contract.file)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Download size={16} />
                      Download {contract.file.fileName}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Modal */}
        {isModalOpen && (
          <ModalContract
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingContract(null);
            }}
            onSave={editingContract ? handleEditContract : handleAddContract}
            contract={editingContract}
          />
        )}
      </div>
    </div>
  );
};

export default ContractManagement;

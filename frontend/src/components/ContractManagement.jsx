import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import ModalContract from '../Modal/ModalContract';

const ContractManagement = () => {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      title: 'Supply Agreement 2024',
      party: 'ABC Corporation',
      status: 'draft',
      createdAt: '2024-03-15',
      dueDate: '2024-04-15',
    },
    {
      id: 2,
      title: 'Service Level Agreement',
      party: 'XYZ Services Ltd',
      status: 'review',
      createdAt: '2024-03-10',
      dueDate: '2024-03-30',
    },
    {
      id: 3,
      title: 'Partnership Agreement',
      party: 'Global Partners Inc',
      status: 'approved',
      createdAt: '2024-02-28',
      dueDate: '2024-03-28',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const handleCreateContract = (formData) => {
    const newContract = {
      ...formData,
      id: contracts.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContracts([...contracts, newContract]);
    setShowModal(false);
  };

  const handleUpdateContract = (formData) => {
    setContracts(
      contracts.map((contract) =>
        contract.id === selectedContract.id ? { ...formData, id: contract.id } : contract
      )
    );
    setShowModal(false);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setContracts(
      contracts.map((contract) =>
        contract.id === id ? { ...contract, status: newStatus } : contract
      )
    );
  };

  const handleDeleteContract = (id) => {
    setContracts(contracts.filter((contract) => contract.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='p-4 min-h-screen bg-gray-200'>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Contract Management
            </h1>
            <p className="text-gray-600 mt-1">
                Manage and track all your contracts in one place
            </p>
            </div>
            <button
            onClick={() => {
                setSelectedContract(null);
                setShowModal(true);
            }}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
            <Plus className="h-4 w-4 mr-2" />
            New Contract
            </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Party
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{contract.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{contract.party}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        contract.status
                        )}`}
                    >
                        {contract.status}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{contract.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{contract.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                        <button
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                            setSelectedContract(contract);
                            setShowModal(true);
                        }}
                        >
                        <Eye className="h-4 w-4" />
                        </button>
                        <button
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                            setSelectedContract(contract);
                            setShowModal(true);
                        }}
                        >
                        <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleDeleteContract(contract.id)}
                        >
                        <Trash2 className="h-4 w-4" />
                        </button>
                        {contract.status === 'review' && (
                        <>
                            <button
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleUpdateStatus(contract.id, 'approved')}
                            >
                            <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleUpdateStatus(contract.id, 'draft')}
                            >
                            <XCircle className="h-4 w-4" />
                            </button>
                        </>
                        )}
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {showModal && (
            <ModalContract
            contract={selectedContract}
            onClose={() => setShowModal(false)}
            onSave={selectedContract ? handleUpdateContract : handleCreateContract}
            />
        )}
        </div>
    </div>    
  );
};

export default ContractManagement;
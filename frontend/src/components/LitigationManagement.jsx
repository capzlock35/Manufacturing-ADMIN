import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import ModalLitigation from '../Modals/ModalLitigation';

// Initial dummy data
const initialDummyData = [
    {
        id: '1',
        caseNumber: 'LIT-2024-001',
        title: 'Smith vs. Johnson Corp',
        status: 'Active',
        legalCounsel: 'John Doe, LLP',
        lastUpdated: '2024-03-15',
        description: 'Contract dispute regarding software development agreement',
        documents: [
            { name: 'complaint.pdf', size: 1500000, type: 'application/pdf', uploadDate: '2024-03-15' },
            { name: 'response.pdf', size: 2000000, type: 'application/pdf', uploadDate: '2024-03-15' }
        ],
        communications: [
            { date: '2024-03-15', type: 'Email', description: 'Status update from counsel' },
            { date: '2024-03-14', type: 'Meeting', description: 'Initial consultation with client' }
        ]
    },
    {
        id: '2',
        caseNumber: 'LIT-2024-002',
        title: 'Roberts Patent Infringement',
        status: 'Pending',
        legalCounsel: 'Jane Smith & Associates',
        lastUpdated: '2024-03-10',
        description: 'Patent infringement case regarding mobile technology',
        documents: [
            { name: 'patent_filing.pdf', size: 3000000, type: 'application/pdf', uploadDate: '2024-03-10' }
        ],
        communications: [
            { date: '2024-03-10', type: 'Phone', description: 'Discussion about settlement options' }
        ]
    },
    {
        id: '3',
        caseNumber: 'LIT-2024-003',
        title: 'City Corp Environmental Case',
        status: 'Active',
        legalCounsel: 'Environmental Law Partners',
        lastUpdated: '2024-03-08',
        description: 'Environmental compliance investigation',
        documents: [
            { name: 'environmental_report.pdf', size: 5000000, type: 'application/pdf', uploadDate: '2024-03-08' }
        ],
        communications: [
            { date: '2024-03-08', type: 'Court', description: 'Initial hearing' },
            { date: '2024-03-07', type: 'Email', description: 'Document submission confirmation' }
        ]
    }
];

const LitigationManagement = () => {
    const [cases, setCases] = useState(initialDummyData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddCase = () => {
        setSelectedCase(null);
        setIsModalOpen(true);
    };

    const handleEditCase = (caseData) => {
        setSelectedCase(caseData);
        setIsModalOpen(true);
    };

    const handleDeleteCase = (id) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            setCases(cases.filter(c => c.id !== id));
        }
    };

    const handleSaveCase = (caseData) => {
        if (caseData.id) {
            // Update existing case
            setCases(cases.map(c => c.id === caseData.id ? caseData : c));
        } else {
            // Add new case
            const newCase = {
                ...caseData,
                id: (cases.length + 1).toString(),
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            setCases([...cases, newCase]);
        }
    };

    const filteredCases = cases.filter(caseItem =>
        caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-200 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Litigation Management</h1>
                <button
                    onClick={handleAddCase}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add New Case
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search cases..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legal Counsel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCases.map((caseItem) => (
                            <tr key={caseItem.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-gray-900">{caseItem.caseNumber}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-900">{caseItem.title}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${caseItem.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                        caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'}`}>
                                        {caseItem.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{caseItem.legalCounsel}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        {format(new Date(caseItem.lastUpdated), 'MMM d, yyyy')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEditCase(caseItem)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCase(caseItem.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ModalLitigation
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    caseData={selectedCase}
                    onSave={(data) => {
                        handleSaveCase(data);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default LitigationManagement;
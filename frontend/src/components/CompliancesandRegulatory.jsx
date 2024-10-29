import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import ModalCompReg from '../Modals/ModalCompReg';

// Initial dummy data
const initialRegulations = [
    {
        id: '1',
        title: 'Data Protection Regulation',
        category: 'Privacy',
        status: 'Compliant',
        priority: 'High',
        nextReview: '2024-06-15',
        lastUpdated: '2024-03-10',
        description: 'Guidelines for handling and protecting customer data',
        requirements: [
            'Data encryption requirements',
            'User consent management',
            'Data breach notification procedures'
        ],
        updates: [
            {
                date: '2024-03-10',
                type: 'Amendment',
                description: 'Updated requirements for international data transfers'
            }
        ],
        assignedTeam: 'IT Security',
        documents: [
            {
                name: 'compliance_checklist.pdf',
                uploadDate: '2024-03-10'
            }
        ]
    },
    {
        id: '2',
        title: 'Environmental Compliance Standards',
        category: 'Environmental',
        status: 'Under Review',
        priority: 'Medium',
        nextReview: '2024-05-20',
        lastUpdated: '2024-03-08',
        description: 'Standards for environmental impact and waste management',
        requirements: [
            'Waste disposal procedures',
            'Environmental impact assessment',
            'Regular monitoring and reporting'
        ],
        updates: [
            {
                date: '2024-03-08',
                type: 'New Requirement',
                description: 'Additional reporting requirements for carbon emissions'
            }
        ],
        assignedTeam: 'Environmental Affairs',
        documents: [
            {
                name: 'environmental_guidelines.pdf',
                uploadDate: '2024-03-08'
            }
        ]
    },
    {
        id: '3',
        title: 'Workplace Safety Regulations',
        category: 'Safety',
        status: 'Non-Compliant',
        priority: 'High',
        nextReview: '2024-04-30',
        lastUpdated: '2024-03-15',
        description: 'Occupational health and safety requirements',
        requirements: [
            'Safety equipment standards',
            'Emergency procedures',
            'Regular safety training'
        ],
        updates: [
            {
                date: '2024-03-15',
                type: 'Update',
                description: 'New safety training requirements added'
            }
        ],
        assignedTeam: 'Health & Safety',
        documents: [
            {
                name: 'safety_manual.pdf',
                uploadDate: '2024-03-15'
            }
        ]
    }
];

const CompliancesandRegulatory = () => {
    const [regulations, setRegulations] = useState(initialRegulations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRegulation, setSelectedRegulation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const handleAddRegulation = () => {
        setSelectedRegulation(null);
        setIsModalOpen(true);
    };

    const handleEditRegulation = (regulation) => {
        setSelectedRegulation(regulation);
        setIsModalOpen(true);
    };

    const handleDeleteRegulation = (id) => {
        if (window.confirm('Are you sure you want to delete this regulation?')) {
            setRegulations(regulations.filter(reg => reg.id !== id));
        }
    };

    const handleSaveRegulation = (regulationData) => {
        if (regulationData.id) {
            // Update existing regulation
            setRegulations(regulations.map(reg => 
                reg.id === regulationData.id ? regulationData : reg
            ));
        } else {
            // Add new regulation
            const newRegulation = {
                ...regulationData,
                id: (regulations.length + 1).toString(),
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            setRegulations([...regulations, newRegulation]);
        }
    };

    // Filter regulations based on search term and category
    const filteredRegulations = regulations.filter(reg => {
        const matchesSearch = reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            reg.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || reg.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter
    const categories = ['All', ...new Set(regulations.map(reg => reg.category))];

    return (
        <div className="p-6 bg-gray-200 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Compliance & Regulatory Management</h1>
                <button
                    onClick={handleAddRegulation}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add New Regulation
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search regulations..."
                        className="w-full pl-10 pr-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Regulations Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Review</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRegulations.map((regulation) => (
                            <tr key={regulation.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{regulation.title}</div>
                                    <div className="text-sm text-gray-500">{regulation.description.substring(0, 60)}...</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{regulation.category}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${regulation.status === 'Compliant' ? 'bg-green-100 text-green-800' : 
                                        regulation.status === 'Non-Compliant' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'}`}>
                                        {regulation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${regulation.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                        regulation.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-green-100 text-green-800'}`}>
                                        {regulation.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        {format(new Date(regulation.nextReview), 'MMM d, yyyy')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{regulation.assignedTeam}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEditRegulation(regulation)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRegulation(regulation.id)}
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

            {/* Modal */}
            {isModalOpen && (
                <ModalCompReg
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    regulationData={selectedRegulation}
                    onSave={handleSaveRegulation}
                />
            )}
        </div>
    );
};

export default CompliancesandRegulatory;
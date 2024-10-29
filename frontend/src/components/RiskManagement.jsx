import React, { useState } from 'react';
import { AlertTriangle, ArrowUpDown, Filter, Plus, Search, Shield } from 'lucide-react';
import RiskModal from '../Modals/ModalRisk';

// Dummy data for risk assessments
const dummyRisks = [
  {
    id: 1,
    title: 'Product Liability Risk - Manufacturing Defect',
    category: 'Product Liability',
    severity: 'high',
    probability: 'medium',
    impact: 'severe',
    status: 'active',
    lastAssessment: '2024-03-15',
    nextAssessment: '2024-06-15',
    description: 'Potential manufacturing defects in product line X could lead to customer safety issues.',
    mitigationSteps: [
      'Quality control process enhancement',
      'Supplier audit implementation',
      'Regular product testing protocol'
    ],
    responsibleParty: 'Quality Assurance Team'
  },
  {
    id: 2,
    title: 'Supply Chain Compliance Risk',
    category: 'Supply Chain',
    severity: 'medium',
    probability: 'high',
    impact: 'moderate',
    status: 'monitoring',
    lastAssessment: '2024-03-10',
    nextAssessment: '2024-05-10',
    description: 'Potential non-compliance with environmental regulations in supplier operations.',
    mitigationSteps: [
      'Supplier compliance audit',
      'Regular monitoring schedule',
      'Documentation requirements update'
    ],
    responsibleParty: 'Supply Chain Management'
  }
];

const categories = ['Product Liability', 'Supply Chain', 'Operations', 'Compliance', 'Contractual'];
const severityLevels = ['low', 'medium', 'high'];
const probabilityLevels = ['low', 'medium', 'high'];
const impactLevels = ['minimal', 'moderate', 'severe'];

export default function RiskManagement() {
  const [risks, setRisks] = useState(dummyRisks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    status: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);

  const handleCreateRisk = (newRisk) => {
    setRisks([...risks, {
      ...newRisk,
      id: risks.length + 1,
      lastAssessment: new Date().toISOString().split('T')[0],
    }]);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || risk.category === filters.category;
    const matchesSeverity = !filters.severity || risk.severity === filters.severity;
    const matchesStatus = !filters.status || risk.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const openRiskModal = (risk = null) => {
    setSelectedRisk(risk);
    setIsModalOpen(true);
  };

  return (
    <div className='p-4 min-h-screen bg-gray-100'>
        <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Risk Management</h1>
            <button
                onClick={() => openRiskModal()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus className="h-5 w-5" />
                New Risk Assessment
            </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                type="text"
                placeholder="Search risks..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-black bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  border-black bg-white"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
                <option value="">All Categories</option>
                {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  border-black bg-white"
                value={filters.severity}
                onChange={(e) => setFilters({...filters, severity: e.target.value})}
            >
                <option value="">All Severity Levels</option>
                {severityLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
            </select>
            <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  border-black bg-white"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
            </select>
            </div>
        </div>

        <div className="space-y-4">
            {filteredRisks.map((risk) => (
            <div
                key={risk.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-black bg-green-100"
                onClick={() => openRiskModal(risk)}
            >
                <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`h-5 w-5 ${risk.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                    <h3 className="font-semibold text-lg">{risk.title}</h3>
                    </div>
                    <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {risk.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(risk.severity)}`}>
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Severity
                    </span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                    risk.status === 'active' ? 'bg-red-100 text-red-800' :
                    risk.status === 'monitoring' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                </span>
                </div>
                <p className="text-gray-600 mb-4">{risk.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                <span>Last Assessment: {risk.lastAssessment}</span>
                <span>Next Assessment: {risk.nextAssessment}</span>
                </div>
            </div>
            ))}
        </div>

        {isModalOpen && (
            <RiskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            risk={selectedRisk}
            onSave={handleCreateRisk}
            categories={categories}
            severityLevels={severityLevels}
            probabilityLevels={probabilityLevels}
            impactLevels={impactLevels}
            />
        )}
        </div>
    </div>    
  );
}
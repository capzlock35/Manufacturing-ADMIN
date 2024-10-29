import React, { useState } from 'react';

const ModalRisk = ({ isOpen, onClose, risk, onSave, categories, severityLevels, probabilityLevels, impactLevels }) => {
  const [newRisk, setNewRisk] = useState({
    title: '',
    category: '',
    severity: '',
    probability: '',
    impact: '',
    description: '',
    mitigationSteps: [''],
    responsibleParty: ''
  });

  const handleSave = () => {
    onSave(newRisk);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRisk({ ...newRisk, [name]: value });
  };

  const handleMitigationChange = (index, value) => {
    const updatedSteps = [...newRisk.mitigationSteps];
    updatedSteps[index] = value;
    setNewRisk({ ...newRisk, mitigationSteps: updatedSteps });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{risk ? 'Edit Risk' : 'New Risk'}</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Risk Title"
            value={newRisk.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          />

          <select
            name="category"
            value={newRisk.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="severity"
            value={newRisk.severity}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          >
            <option value="">Select Severity</option>
            {severityLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="probability"
            value={newRisk.probability}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          >
            <option value="">Select Probability</option>
            {probabilityLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="impact"
            value={newRisk.impact}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          >
            <option value="">Select Impact</option>
            {impactLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Risk Description"
            value={newRisk.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          />

          <h3 className="text-lg font-semibold">Mitigation Steps</h3>
          {newRisk.mitigationSteps.map((step, index) => (
            <input
              key={index}
              type="text"
              value={step}
              onChange={(e) => handleMitigationChange(index, e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500 mb-2"
              placeholder={`Step ${index + 1}`}
            />
          ))}

          <input
            type="text"
            name="responsibleParty"
            placeholder="Responsible Party"
            value={newRisk.responsibleParty}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Risk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRisk;

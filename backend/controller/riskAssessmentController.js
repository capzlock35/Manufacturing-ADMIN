import RiskAssessment from '../model/RiskAssessment.js';

// Create a new Risk Assessment
export const createRiskAssessment = async (req, res) => {
  try {
    const newRiskAssessment = new RiskAssessment(req.body);
    const savedRiskAssessment = await newRiskAssessment.save();
    res.status(201).json(savedRiskAssessment); // 201 Created status
  } catch (err) {
    res.status(500).json({ message: err.message }); // 500 Internal Server Error
  }
};

// Get all ACTIVE Risk Assessments (default)
export const getAllRiskAssessments = async (req, res) => {
  try {
    const riskAssessments = await RiskAssessment.find({ isActive: true }).sort({ createdAt: -1 }); // Filter for isActive: true
    res.status(200).json(riskAssessments); // 200 OK
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all INACTIVE Risk Assessments (for archive/deleted view)
export const getInactiveRiskAssessments = async (req, res) => {
  try {
    const riskAssessments = await RiskAssessment.find({ isActive: false }).sort({ createdAt: -1 }); // Filter for isActive: false
    res.status(200).json(riskAssessments); // 200 OK
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a Risk Assessment by ID
export const getRiskAssessmentById = async (req, res) => {
  try {
    const riskAssessment = await RiskAssessment.findById(req.params.id);
    if (!riskAssessment) {
      return res.status(404).json({ message: 'Risk Assessment not found' }); // 404 Not Found
    }
    res.status(200).json(riskAssessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Risk Assessment
export const updateRiskAssessment = async (req, res) => {
  try {
    const updatedRiskAssessment = await RiskAssessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new:true returns updated doc, runValidators: ensures schema validation
    );
    if (!updatedRiskAssessment) {
      return res.status(404).json({ message: 'Risk Assessment not found' });
    }
    res.status(200).json(updatedRiskAssessment);
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request for validation errors
  }
};

// Delete a Risk Assessment (Hard Delete - Use with caution)
export const deleteRiskAssessment = async (req, res) => {
  try {
    const deletedRiskAssessment = await RiskAssessment.findByIdAndDelete(req.params.id);
    if (!deletedRiskAssessment) {
      return res.status(404).json({ message: 'Risk Assessment not found' });
    }
    res.status(200).json({ message: 'Risk Assessment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft Delete (Archive) a Risk Assessment
export const softDeleteRiskAssessment = async (req, res) => {
  try {
    const updatedRiskAssessment = await RiskAssessment.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // Set isActive to false for soft delete
      { new: true } // Return the updated document
    );
    if (!updatedRiskAssessment) {
      return res.status(404).json({ message: 'Risk Assessment not found' });
    }
    res.status(200).json({ message: 'Risk Assessment archived successfully', data: updatedRiskAssessment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restore (Undo Soft Delete) a Risk Assessment
export const restoreRiskAssessment = async (req, res) => {
  try {
    const updatedRiskAssessment = await RiskAssessment.findByIdAndUpdate(
      req.params.id,
      { isActive: true }, // Set isActive back to true to restore
      { new: true } // Return the updated document
    );
    if (!updatedRiskAssessment) {
      return res.status(404).json({ message: 'Risk Assessment not found' });
    }
    res.status(200).json({ message: 'Risk Assessment restored successfully', data: updatedRiskAssessment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
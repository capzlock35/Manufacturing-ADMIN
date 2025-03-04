// routes/riskAssessmentRoutes.js
import express from 'express';
import {
  createRiskAssessment,
  getAllRiskAssessments,
  getRiskAssessmentById,
  updateRiskAssessment,
  deleteRiskAssessment,
} from '../controller/riskAssessmentController.js';

const router = express.Router();

router.post('/', createRiskAssessment);        // Create a new Risk Assessment
router.get('/', getAllRiskAssessments);         // Get all Risk Assessments
router.get('/:id', getRiskAssessmentById);    // Get a Risk Assessment by ID
router.put('/:id', updateRiskAssessment);      // Update a Risk Assessment (full update)
router.patch('/:id', updateRiskAssessment);    // Update a Risk Assessment (partial update - same controller func)
router.delete('/:id', deleteRiskAssessment);     // Delete a Risk Assessment

export default router;
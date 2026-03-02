import express from 'express';
import {
  createRiskAssessment,
  getAllRiskAssessments,
  getRiskAssessmentById,
  updateRiskAssessment,
  deleteRiskAssessment,
  softDeleteRiskAssessment,
  restoreRiskAssessment,
  getInactiveRiskAssessments // Import the new function
} from '../controller/riskAssessmentController.js';

const router = express.Router();

router.post('/', createRiskAssessment);
router.get('/', getAllRiskAssessments);         // Get all ACTIVE Risk Assessments (default)
router.get('/inactive', getInactiveRiskAssessments); // New route to get INACTIVE Risk Assessments
router.get('/:id', getRiskAssessmentById);
router.put('/:id', updateRiskAssessment);
router.patch('/:id', updateRiskAssessment);
router.delete('/:id', deleteRiskAssessment);

router.patch('/:id/archive', softDeleteRiskAssessment);
router.patch('/:id/restore', restoreRiskAssessment);

export default router;
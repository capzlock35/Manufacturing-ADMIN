// Correct route order in routes/contractRoutes.js
import express from 'express';
import {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  getContractsByStatus,
  searchContracts,
  approveContract,
  rejectContract,
  addReviewNote,
} from '../controller/contractController.js';

const router = express.Router();

// --- Basic CRUD Routes ---
router.post('/contracts', createContract);
router.get('/contracts', getAllContracts);

// --- SEARCH ROUTE - DEFINE BEFORE :id ROUTES ---
router.get('/contracts/search', searchContracts); // Search route - MUST BE DEFINED FIRST

router.get('/contracts/:id', getContractById); // Route with :id parameter - NOW DEFINED AFTER SEARCH
router.put('/contracts/:id', updateContract);
router.delete('/contracts/:id', deleteContract);

// --- Additional Routes ---
router.post('/contracts/:id/approve', approveContract);
router.post('/contracts/:id/reject', rejectContract);
router.post('/contracts/:id/review-note', addReviewNote);
router.get('/contracts/status/:status', getContractsByStatus);


export default router;
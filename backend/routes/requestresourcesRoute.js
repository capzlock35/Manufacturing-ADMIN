import express from 'express';
import {
    createResourceRequest,
    getAllResourceRequests,
    getResourceRequestById,
    updateResourceRequestStatus,
    deleteResourceRequest // <--- Import delete function
} from '../controller/requestresourcesController.js';

const router = express.Router();

router.post('/', createResourceRequest);
router.get('/', getAllResourceRequests);
router.get('/:id', getResourceRequestById);
router.put('/:id', updateResourceRequestStatus);

router.delete('/:id', deleteResourceRequest); // <--- ADD DELETE route

export default router;
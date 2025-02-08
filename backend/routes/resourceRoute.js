import express from 'express';
const router = express.Router();
import {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} from '../controller/resourceController.js'; // Correct path

// Get all resources
router.get('/', getAllResources);

// Get a single resource by ID
router.get('/:id', getResourceById);

// Create a new resource
router.post('/', createResource);

// Update a resource
router.put('/:id', updateResource);

// Delete a resource
router.delete('/:id', deleteResource);

export default router;
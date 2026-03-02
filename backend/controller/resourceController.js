import Resource from '../model/resourcesModel.js';

// Get all resources
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single resource by ID
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json(resource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Create a new resource
// Create a new resource
// Create a new resource
export const createResource = async (req, res) => {
    try {
        const resource = new Resource({
            resourceName: req.body.resourceName,
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            quantity: req.body.quantity,
            unit: req.body.unit,
            allocatedTo: req.body.allocatedTo,
            completedDate: req.body.completedDate, // Expect completedDate from request body
        });

        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};
// Update a resource
// Update a resource
// Update a resource
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        resource.resourceName = req.body.resourceName;
        resource.name = req.body.name;
        resource.type = req.body.type;
        resource.description = req.body.description;
        resource.quantity = req.body.quantity;
        resource.unit = req.body.unit;
        resource.allocatedTo = req.body.allocatedTo;
        resource.completedDate = req.body.completedDate; // Allow updating completedDate

        const updatedResource = await resource.save();
        res.json(updatedResource);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};
// Delete a resource
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};  
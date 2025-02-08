import RequestResource from "../model/requestresourcesModel.js";

// Create a new resource request
export const createResourceRequest = async (req, res) => {
    try {
        const { name, resourceName, type, description, quantity, unit, allocatedTo, requestingUser } = req.body;

        const newResourceRequest = new RequestResource({ // Corrected model name
            name: name,
            resourceName: resourceName,
            type: type,
            description: description,
            quantity: quantity,
            unit: unit,
            allocatedTo: allocatedTo,
            requestingUser: requestingUser
        });

        const savedRequest = await newResourceRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Get all resource requests
export const getAllResourceRequests = async (req, res) => {
    try {
        const resourceRequests = await RequestResource.find(); // Corrected model name
        res.json(resourceRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single resource request by ID
export const getResourceRequestById = async (req, res) => {
    try {
        const resourceRequest = await RequestResource.findById(req.params.id); // Corrected model name
        if (!resourceRequest) {
            return res.status(404).json({ message: 'Resource request not found' });
        }
        res.json(resourceRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update a resource request's status (e.g., approve/reject)
export const updateResourceRequestStatus = async (req, res) => {
    try {
        const resourceRequest = await RequestResource.findById(req.params.id); // Corrected model name
        if (!resourceRequest) {
            return res.status(404).json({ message: 'Resource request not found' });
        }

        resourceRequest.status = req.body.status; // Expect 'approved' or 'rejected' in req.body
        const updatedRequest = await resourceRequest.save();
        res.json(updatedRequest);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Delete a resource request
export const deleteResourceRequest = async (req, res) => {
    try {
        const resourceRequest = await RequestResource.findByIdAndDelete(req.params.id);
        if (!resourceRequest) {
            return res.status(404).json({ message: 'Resource request not found' });
        }
        res.json({ message: 'Resource request deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
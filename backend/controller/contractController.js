// controller/contractController.js
import Contract from '../model/Contract.js';

// --- CREATE ---
export const createContract = async (req, res) => {
  try {
      const newContract = new Contract(req.body);
      // Now, directly take createdByUsername from req.body (sent from frontend)
      // const userName = req.user?.userName; // No longer directly using req.user here for create
      const createdByUsername = req.body.createdByUsername || "System"; // Default if not sent
      newContract.createdByUsername = createdByUsername;


      const savedContract = await newContract.save();
      res.status(201).json(savedContract);
  } catch (error) {
      res.status(500).json({ error: 'Could not create contract', message: error.message });
  }
};

// --- GET ALL CONTRACTS ---
export const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve contracts', message: error.message });
  }
};

// --- GET CONTRACT BY ID ---
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve contract', message: error.message });
  }
};

// --- UPDATE CONTRACT ---
export const updateContract = async (req, res) => {
  try {
      const updatedContract = await Contract.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
      );
      if (!updatedContract) {
          return res.status(404).json({ message: 'Contract not found for update' });
      }

      const userName = localStorage.getItem('userName'); // Get username from localStorage  <---- GET USERNAME FROM LOCAL STORAGE HERE TOO
      if (userName) { // Check if userName exists
         updatedContract.updatedByUsername = userName; // Set updatedByUsername
         await updatedContract.save(); // Save again to include updatedByUsername
      }


      res.status(200).json(updatedContract);
  } catch (error) {
      res.status(400).json({ error: 'Could not update contract', message: error.message });
  }
};

// --- DELETE CONTRACT ---
export const deleteContract = async (req, res) => {
  try {
    const deletedContract = await Contract.findByIdAndDelete(req.params.id);
    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found for deletion' });
    }
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete contract', message: error.message });
  }
};

// --- Additional Controller Functions ---

// --- APPROVE CONTRACT ---
export const approveContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    if (contract.status === 'approved') {
      return res.status(400).json({ message: 'Contract is already approved' }); // Or handle as needed
    }

    const { userName } = req.body;

    contract.status = 'approved';
    contract.approvalHistory.push({
      status: 'approved',
      username: userName,
      date: Date.now(),
    });
    await contract.save();
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Could not approve contract', message: error.message });
  }
};

// --- REJECT CONTRACT ---
export const rejectContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    if (contract.status === 'rejected') {
      return res.status(400).json({ message: 'Contract is already rejected' }); // Or handle as needed
    }

    const { userName } = req.body;

    contract.status = 'rejected';
    contract.approvalHistory.push({
      status: 'rejected',
      username: userName,
      date: Date.now(),
    });
    await contract.save();
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Could not reject contract', message: error.message });
  }
};

// --- ADD REVIEW NOTE ---
export const addReviewNote = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const { comment } = req.body; // Expecting 'comment' in request body
    if (!comment) {
      return res.status(400).json({ message: 'Review comment is required' });
    }

    contract.reviewNotes.push({
      comment: comment,
      // user: req.user?._id, // Assuming user authentication - if you want to track user for notes as well
      date: Date.now(),
    });
    await contract.save();
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Could not add review note', message: error.message });
  }
};

// Example: Get contracts by status (already implemented)
export const getContractsByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const contracts = await Contract.find({ status: status });
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve contracts by status', message: error.message });
  }
};

// Example: Search contracts (already implemented)
export const searchContracts = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const contracts = await Contract.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { contractNumber: { $regex: searchTerm, $options: 'i' } },
      ],
    });
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Could not search contracts', message: error.message });
  }
};
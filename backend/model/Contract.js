// model/Contract.js
import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  contractNumber: { // Optional, but good for identification
    type: String,
    unique: true, // Ensure unique contract numbers
  },
  partiesInvolved: {
    supplier: { type: String }, // Or could be a reference to a Supplier model
    customer: { type: String },  // Or could be a reference to a Customer model
    partner: { type: String },   // Or could be a reference to a Partner model
  },
  startDate: {
    type: Date,
    default: Date.now, // Default to creation date
  },
  endDate: {
    type: Date,
  },
  contractDocument: { // Store the contract content (could be rich text, PDF link, etc.)
    type: String, // Or consider storing a link to cloud storage if files are large
    required: true, // Or maybe allow drafts without document initially
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'rejected', 'active', 'expired', 'terminated'], // Define possible statuses
    default: 'draft',
  },
  reviewNotes: [{ // Array of review notes/comments
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If you have user authentication
    comment: String,
    date: { type: Date, default: Date.now },
  }],
  approvalHistory: [{ // Track approval stages
    username: { type: String },           // <--- ADD USERNAME FIELD
    status: String, // e.g., 'submitted for review', 'approved', 'rejected'
    date: { type: Date, default: Date.now },
  }],
  createdBy: {  // Track who created the contract (if you have user authentication)
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  },
  updatedBy: { // Track who last updated the contract
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  },
  createdByUsername: { type: String },  // <-- ADD Created By Username
  updatedByUsername: { type: String },  // <-- ADD Updated By Username
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // ... Add other relevant fields like:
  //   - Contract Value
  //   - Payment Terms
  //   - Renewal Terms
  //   - Associated Projects/Tasks
  //   - Custom Fields specific to your needs
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
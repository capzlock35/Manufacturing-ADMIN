// models/RiskAssessment.js
import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Operations', 'Supply Chain', 'Product Liability', 'Legal', 'Financial', 'Reputational', 'Strategic', 'Compliance', 'Other'], // Example categories
    default: 'Other',
  },
  likelihood: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], // Example likelihood levels
    default: 'Medium',
  },
  impact: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], // Example impact levels
    default: 'Medium',
  },
  mitigationStrategies: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed', 'Resolved'],
    default: 'Open',
  },
  assessmentDate: {
    type: Date,
    default: Date.now,
  },
  reviewDate: { // Optional: For scheduled reviews
    type: Date,
  },
  createdBy: { // Optional: Track who created it (if you have user authentication)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const RiskAssessment = mongoose.model('RiskAssessment', riskAssessmentSchema);

export default RiskAssessment;
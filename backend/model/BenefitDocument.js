import mongoose from 'mongoose';

const benefitDocumentSchema = new mongoose.Schema({
  documentFile: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const BenefitDocument = mongoose.model('BenefitDocument', benefitDocumentSchema);
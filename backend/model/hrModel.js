import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Employee', 'Admin', 'Superadmin'],
    default: 'Employee',
  },
  Hr: {
    type: Number,
    enum: [1, 2, 3, 4], 
    required: true,
  },
  position: { 
    type: String,
    enum: ['CEO', 'Secretary', 'Production Head', 'Resellers Sales Head', 'Resellers'], 
    required: true,
  },
});

const Hruser = mongoose.model('Hruser', userSchema);

export default Hruser;
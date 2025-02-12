import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Employee', 'Admin', 'Superadmin'], // Allowed roles
    default: 'Employee', // Default role
  },

});

const Hruser = mongoose.model('Hruser', userSchema);
 
export default Hruser;
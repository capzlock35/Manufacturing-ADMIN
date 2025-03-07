import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  employeeId: { type: Number, required: true },
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
  },
  position: { 
    type: String, 
    required: true,
  },
});

const Hruser = mongoose.model('Hruser', userSchema);

export default Hruser;
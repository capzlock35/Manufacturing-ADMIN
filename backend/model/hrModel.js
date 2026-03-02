import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  employeeId: { type: Number, required: false, unique: true }, // Added unique: true for employeeId
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Employee', 'Admin', 'Superadmin'],
    default: 'Employee',
  },
  Hr: { // Consider renaming this to something more descriptive, like 'hrLevel' or 'hrDepartment' if it represents that
    type: Number,
    enum: [1, 2, 3, 4], // What do these numbers represent? Consider making this an enum of strings for clarity if applicable.
  },
  position: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Optional: Add timestamps for createdAt and updatedAt

const Hruser = mongoose.model('Hruser', userSchema);

export default Hruser;
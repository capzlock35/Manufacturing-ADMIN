// User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  birthday: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'staff', 'employee', 'manager']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['admin', 'finance', 'core 1', 'core 2', 'logistic 1', 'logistic 2', 'hr 1', 'hr 2', 'hr 3', 'hr 4']
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;

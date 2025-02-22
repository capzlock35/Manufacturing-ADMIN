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
  Hr: {
    type: Number,
    enum: [1, 2, 3, 4],  //Restrict the values of HR
    required: true,       // Optional field.  If you want it to always exist, set to `true`.
  },
});

const Hruser = mongoose.model('Hruser', userSchema);
 
export default Hruser;
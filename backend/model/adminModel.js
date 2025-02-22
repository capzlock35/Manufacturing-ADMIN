import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  image:{
    public_id:{
        type: String,
        required: true
    },
    secure_url:{
        type:String,
        required: true
    }
},
userName:{ type: String, required: true },
email:{ type: String, required: true },
password:{ type: String, required: true },
firstName: { type: String, required: true },
lastName: { type: String, required: true },
birthday: { type: String, required: true },
gender: { type: String, required: true },
role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'staff', 'superadmin']
  },
}, {timestamp: true})

const Admin = mongoose.model('AdminUser', userSchema);

export default Admin;
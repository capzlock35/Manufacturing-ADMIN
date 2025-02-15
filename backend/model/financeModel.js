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
password:{ type: String, required: true },
email:{ type: String, required: true },
fullName:{ type: String, required: true },
role:{type: String, required: true }
}, {timestamp: true})

const Finance = mongoose.model('Finance', userSchema);

export default Finance;
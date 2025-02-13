import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
userName:{ type: String, required: true },
password:{ type: String, required: true },
email:{ type: String, required: true },
fullName:{ type: String, required: true },
role:{type: String, required: true }
}, {timestamp: true})

const Finance = mongoose.model('Financeuser', userSchema);

export default Finance;
import mongoose from 'mongoose'

//Employee Model
const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true, }, 
    lastName: { type: String, required: true, },
    email: { type: String, required: true, },
    middleName: { type: String, required: true, },
    age: { type: String, required: true, },
    birthday: { type: String, required: true, },
    gender: { type: String, required: true, },
    address: { type: String, required: true, },
    department: { 
        type: String,
        enum: ['Admin', 'Logistic1', 'Logistic2' , 'Hr1','Hr2','Hr3','Hr4', 'Core1','Core2', 'Finance'], 
        required: true,
      }, 
      role:{type: String, required: true },
}, {timestamp: true});


const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee

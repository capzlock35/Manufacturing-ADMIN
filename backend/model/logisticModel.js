import mongoose from "mongoose";


const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String },
    password: { type: String },
    phone: { type: String },
    date: { type: Date },
    address: { type: String },
    city: { type: String },
    image: { type: String },
    age: { type: Number },
    condition: { type: String },
    verified: { type: String },
    role: {
      type: String,
      enum: [
        "admin",
        "logistic",
        "user",
        "pending",
        "vendorAdmin",
        "qualityControl",
        "superAdmin",
      ],
      default: "pending",
    },
        LogisticLevel: { 
      type: Number,
      enum: [1, 2],     
      required: true,    
    },
    generalSetting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeneralSettings",
    },
  },
  { timestamps: true }
);
const Logistic = mongoose.model("Logistic", userSchema);

export default Logistic;
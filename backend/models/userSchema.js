import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    address: { type: String, default: "" }, 
    phone: { type: String, default: "" }, 
    state: { type: String, default: "" },
    city: { type: String, default: "" },
}, { timestamps: true });

// Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;

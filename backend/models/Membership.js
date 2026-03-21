import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  gender: String,
  dob: String,
  location: String,
  membershipPlan: { 
    type: String, 
    enum: ["Basic", "Pro", "Premium"], 
  },
  startDate: {
    type: String,
    required: true
  },
  selectedTrainer: String,
  selectedNutritionist: String,
  paymentId: String,
  totalPrice: Number,

  renewalCount: { type: Number, default: 0 },
  renewalRevenue: { type: Number, default: 0 },
}, { timestamps: true }
);

const Membership = mongoose.model("Membership", membershipSchema);
export default Membership;

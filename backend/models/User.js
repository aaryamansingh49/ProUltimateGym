// Model for MembershipPlan
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  state: String,
  city: String,
  password: String,
  // otp: {
  //   type: String,
  //   default: null,
  // },
  
  // otpExpiry: {
  //   type: Date,
  //   default: null,
  // },
  
  // resetOtp: {
  //   type: String,
  //   default: null,
  // },
  
  // resetOtpExpiry: {
  //   type: Date,
  //   default: null,
  // },      

  membershipPlan: String, 
  membershipStartDate: Date,
  assignedCoach: String,
  profilePhoto: {
    type: String, 
    default: null,
  },
},
{
  timestamps: true,
}
);

const User = mongoose.model("User", userSchema);

export default User;

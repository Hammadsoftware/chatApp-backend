import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: "", // Default profile picture URL
  },
  online: {
    type: Boolean,
    default: false, // Default to offline
  },
}
, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const User = mongoose.model("User", authSchema);
export default User;
export { authSchema }; // Export the schema if needed elsewhere
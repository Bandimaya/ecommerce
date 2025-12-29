// models/User.ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Prevents password from being sent in API responses by default
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "", // URL to the profile image
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Structured address for better shipping logic
    address: {
      line: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hot-reload safe export for Next.js
const User = models.User || model("User", UserSchema);

export default User;

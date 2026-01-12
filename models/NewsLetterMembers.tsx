import { Schema, model, models } from "mongoose";

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in Next.js dev mode
const Newsletter =
  models.Newsletter || model("Newsletter", NewsletterSchema);

export default Newsletter;

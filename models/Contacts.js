// models/Contact.ts
import { Schema, model, models } from "mongoose";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED"],
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

// Hot-reload safe export for Next.js
const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;

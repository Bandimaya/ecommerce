// models/ContactInfo.ts
import { Schema, model, models } from "mongoose";

const ContactInfoSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      required: true,
    },
    logo_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hot-reload safe export for Next.js
const ContactInfo =
  models.ContactInfo || model("ContactInfo", ContactInfoSchema);

export default ContactInfo;

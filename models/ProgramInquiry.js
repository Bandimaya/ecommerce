// models/Inquiry.ts
import { Schema, model, models } from "mongoose";

const InquirySchema = new Schema(
  {
    parentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    childAge: Number,
    programInterest: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

// Hot-reload safe export for Next.js
const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);

export default Inquiry;

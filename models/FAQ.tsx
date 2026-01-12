import { Schema, model, models } from "mongoose";

const FAQSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in Next.js dev mode
const FAQ = models.FAQ || model("FAQ", FAQSchema);

export default FAQ;

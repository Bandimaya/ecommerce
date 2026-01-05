import mongoose from "mongoose";

const jargonItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    icon: { type: String, required: true }, // e.g. Cpu, Code
    color: { type: String, required: true }, // bg-blue-500
    accentColor: { type: String, required: true }, // #3b82f6
  },
  { timestamps: true }
);

const JargonItem =
  mongoose.models.JargonItem ||
  mongoose.model("JargonItem", jargonItemSchema);

export default JargonItem;

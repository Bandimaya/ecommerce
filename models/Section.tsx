import mongoose, { Schema, Document } from "mongoose";

export interface ISection extends Document {
  label: string;
  icon: string;
  description: string;
}

const SectionSchema = new Schema<ISection>(
  {
    label: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Section ||
  mongoose.model<ISection>("Section", SectionSchema);

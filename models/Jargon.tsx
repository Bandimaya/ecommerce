import mongoose, { Schema, Document } from "mongoose";

export interface IJargon extends Document {
  title: string;
  description: string;
  image: string;
  alt: string;
  color: string;
  accentColor: string;
}

const JargonSchema = new Schema<IJargon>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    color: { type: String, required: true },
    accentColor: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Jargon ||
  mongoose.model<IJargon>("Jargon", JargonSchema);

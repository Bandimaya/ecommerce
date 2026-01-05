import mongoose, { Schema, Document } from "mongoose";
import { ISection } from "./Section"; // Import the Section model

export interface ISectionCourse extends Document {
  title: string;
  ageRange: string;
  image: string;
  alt: string;
  description: string;
  duration: string;
  level: string;
  skills: string[];
  rating: number;
  enrolled: number;
  sectionId: ISection["_id"]; // Reference to the Section model
}

const SectionCourseSchema = new Schema<ISectionCourse>(
  {
    title: { type: String, required: true },
    ageRange: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    skills: { type: [String], required: true },
    rating: { type: Number, required: true },
    enrolled: { type: Number, required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true } // Foreign key to Section model
  },
  { timestamps: true }
);

export default mongoose.models.SectionCourse ||
  mongoose.model<ISectionCourse>("SectionCourse", SectionCourseSchema);

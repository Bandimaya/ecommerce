import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    student: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    views: { type: String, required: true }, // e.g. 1.2k
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;

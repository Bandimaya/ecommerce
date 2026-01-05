import mongoose from "mongoose";

const stemCourseSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true }, // MD-01
    title: { type: String, required: true },
    image: { type: String, required: true },
    age: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true }, // Beginner | Intermediate | Advanced | Expert
    duration: { type: String, required: true }, // 24 Sessions
    enrolled: { type: String, required: true }, // 1.5k+
  },
  { timestamps: true }
);

const StemCourse =
  mongoose.models.StemCourse ||
  mongoose.model("StemCourse", stemCourseSchema);

export default StemCourse;

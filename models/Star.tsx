import mongoose from "mongoose";

const starSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    quote: { type: String, required: true },
    video: { type: String, default: "" }, // ⬅ video file path
  },
  { timestamps: true }
);

const Star = mongoose.models.Star || mongoose.model("Star", starSchema);
export default Star;

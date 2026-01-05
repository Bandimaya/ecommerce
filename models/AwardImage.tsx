import mongoose from "mongoose";

const awardImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AwardImage ||
  mongoose.model("AwardImage", awardImageSchema);

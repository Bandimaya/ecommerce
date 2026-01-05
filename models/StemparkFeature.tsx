import mongoose from "mongoose";

const stemparkFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    icon: {
      type: String,
      required: true, // e.g. "Cpu", "Gamepad2"
    },
    stat: { type: String, required: true },
  },
  { timestamps: true }
);

const StemparkFeature =
  mongoose.models.StemparkFeature ||
  mongoose.model("StemparkFeature", stemparkFeatureSchema);

export default StemparkFeature;

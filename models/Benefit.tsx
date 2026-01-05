import mongoose from "mongoose";

const benefitSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    text: { type: String, required: true }, // HTML string
    alt: { type: String, required: true },
  },
  { timestamps: true }
);

const Benefit =
  mongoose.models.Benefit || mongoose.model("Benefit", benefitSchema);

export default Benefit;

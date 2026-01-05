import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    icon: { type: String, required: true }, // award | shield | globe
  },
  { timestamps: true }
);

const Certification =
  mongoose.models.Certification ||
  mongoose.model("Certification", certificationSchema);

export default Certification;

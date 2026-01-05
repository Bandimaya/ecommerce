import mongoose from "mongoose";

const partnerImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const PartnerImage =
  mongoose.models.PartnerImage ||
  mongoose.model("PartnerImage", partnerImageSchema);

export default PartnerImage;

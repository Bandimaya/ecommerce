import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    programId: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },

    // 👇 IMPORTANT
    stats: {
      type: Object,
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Program =
  mongoose.models.Program || mongoose.model("Program", programSchema);

export default Program;

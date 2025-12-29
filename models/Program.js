// models/Program.ts
import { Schema, model, models } from "mongoose";

const ProgramSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      url: { type: String, required: true },
      alt: String,
      position: { type: Number, default: 0 },
    },
    features: {
      type: [String],
      default: [],
    },
    // --- New STEM Fields ---
    durationWeeks: {
      type: Number,
      required: false,
    },
    ageGroup: {
      type: String, // e.g., "Ages 14-18"
    },
    prerequisites: {
      type: String,
    },
    certification: {
      type: String,
    },
    equipment: {
      type: [String], // Array of tools like "3D Printer", "VEX Kit"
      default: [],
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    // -----------------------
    type: {
      type: String,
      enum: ["main", "additional"],
      default: "main",
    },
    icon: {
      type: String,
      default: "Cpu",
    },
    color: {
      type: String,
      default: "#6366f1", // Default Indigo
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Program = models.Program || model("Program", ProgramSchema);

export default Program;
import mongoose, { Schema, model, models } from "mongoose";

const BrandSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index with case-insensitive collation
BrandSchema.index(
  { title: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

// Prevent model overwrite error in Next.js (hot reload)
const Brand = models.Brand || model("Brand", BrandSchema);

export default Brand;

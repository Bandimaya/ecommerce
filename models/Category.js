// models/Category.ts
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
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
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Case-insensitive unique index
CategorySchema.index(
  { title: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

// Hot-reload safe export for Next.js
const Category = models.Category || model("Category", CategorySchema);

export default Category;

// models/NewProduct.ts
import { Schema, model, models } from "mongoose";
const Brand = require("../models/Brand");
const Category = require("../models/Category");

const ProductSchema = new Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: String,

    // RELATIONS
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    // MEDIA
    media: [
      {
        url: { type: String, required: true },
        alt: String,
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        position: Number,
        videoType: {
          type: String,
          enum: ["youtube", "vimeo"],
          default: null,
        },
      },
    ],

    // VARIANT OPTIONS (UI)
    variantOptions: [
      {
        name: { type: String, required: true },
        values: [{ type: String }],
      },
    ],

    // PRICING (fallback)
    pricing: [
      {
        region: { type: String, default: "Domestic" },
        currency: { type: String, required: true, default: "USD" },
        originalPrice: { type: Number, required: true },
        salePrice: { type: Number, default: null },
      },
    ],

    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    // FLAGS
    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isOnlyProduct: {
      type: Boolean,
      default: false,
    },

    productData: {
      type: Object,
    },

    // STATS
    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hot-reload safe export for Next.js
const NewProduct =
  models.NewProduct || model("NewProduct", ProductSchema);

export default NewProduct;

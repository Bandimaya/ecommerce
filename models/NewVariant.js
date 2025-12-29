// models/Variant.ts
import { Schema, model, models } from "mongoose";

const VariantSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },

    barcode: String,

    // ATTRIBUTE MAP (dynamic)
    attributes: {
      type: Map,
      of: String, // { Color: "Black", Size: "M" }
    },

    // PRICING
    pricing: [
      {
        region: { type: String, default: "Domestic" },
        currency: { type: String, required: true, default: "USD" },
        originalPrice: { type: Number, required: true },
        salePrice: { type: Number, default: null },
      },
    ],

    // INVENTORY
    inventory: {
      stock: { type: Number, default: 0 },
      reserved: { type: Number, default: 0 },
      lowStockThreshold: { type: Number, default: 5 },
    },

    // SHIPPING
    weight: Number,

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // MEDIA
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        position: Number,
      },
    ],

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

    status: {
      type: String,
      enum: ["active", "out_of_stock", "disabled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Hot-reload safe export for Next.js
const Variant = models.Variant || model("Variant", VariantSchema);

export default Variant;

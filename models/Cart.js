import mongoose, { Schema, model, models } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    region: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },
    currencyCode: {
      type: String,
      default: "USD",
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "NewProduct",
          required: true,
        },
        variantId: {
          type: Schema.Types.ObjectId,
          ref: "Variant",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in Next.js dev mode
const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;

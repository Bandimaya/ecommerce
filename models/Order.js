// models/Order.ts
import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // captures the pricing context
    region: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      required: true,
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
        name: String,
        image: String, // snapshot of product image
        variantLabel: String, // e.g., "Pro Kit / Blue"
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },

    shippingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },

    paymentId: String,
    paymentMethod: {
      type: String,
      enum: ["STRIPE", "RAZORPAY", "COD"],
      default: "RAZORPAY",
    },
  },
  {
    timestamps: true,
  }
);

// Hot-reload safe export for Next.js
const Order = models.Order || model("Order", OrderSchema);

export default Order;

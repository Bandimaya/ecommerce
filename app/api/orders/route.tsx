import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/NewProduct";
import Variant from "@/models/NewVariant";
import User from "@/models/User";
import ContactInfo from "@/models/ContactInfo";
import { UserPayload, withAuth } from "@/lib/withAuth";
import sendEmail from "@/lib/email";

type Pricing = {
  region: string;
  currency: string;
  originalPrice: number;
  salePrice?: number | null;
};

export const getFinalPrice = (
  pricing: Pricing[],
  region: string
) => {
  const price = pricing.find(p => p.region === region);

  if (!price) {
    throw new Error(`Pricing not found for region: ${region}`);
  }

  const hasValidSale =
    typeof price.salePrice === "number" &&
    price.salePrice > 0 &&
    price.salePrice < price.originalPrice;

  return {
    price: hasValidSale ? price.salePrice : price.originalPrice,
    currency: price.currency,
    originalPrice: price.originalPrice,
    salePrice: hasValidSale ? price.salePrice : null,
    isOnSale: hasValidSale,
  };
};

// ------------------ CREATE ORDER ------------------
export const POST = withAuth(async (req: NextRequest, user: UserPayload) => {
  try {
    const body = await req.json();
    const { shippingAddress, isIndia } = body;

    const cart = await Cart.findOne({ userId: user.id })
      .populate("items.productId")
      .populate("items.variantId");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const orderItems: any[] = [];
    let calculatedTotal = 0;

    const priceKey = isIndia ? "price" : "priceOverseas";
    const basePriceKey = isIndia ? "basePrice" : "basePriceOverseas";

    // Track stock updates for rollback
    const stockUpdates: {
      model: any;
      id: any;
      stockPath: string;
      qty: number;
    }[] = [];

    for (const item of cart.items) {
      const isVariable = !!item.variantId;
      const target = isVariable ? item.variantId : item.productId;

      if (!target) {
        throw new Error("Item no longer exists");
      }

      const currentStock = isVariable
        ? target.inventory?.stock
        : target.productData?.inventory?.stock;

      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.productId.name}`);
      }

      const region = isIndia ? "Domestic" : "International";

      const {
        price: finalPrice,
        currency,
        isOnSale,
      } = getFinalPrice(target.pricing, region);

      // const finalPrice = isVariable
      //   ? (target[priceKey].sale || target[priceKey].regular)
      //   : (target[basePriceKey].sale || target[basePriceKey].regular);

      calculatedTotal += Number(finalPrice) * item.quantity;

      orderItems.push({
        productId: item.productId._id,
        variantId: item.variantId?._id || null,
        name: item.productId.name,
        variantLabel: isVariable
          ? Object.values(item.variantId.attributes).join(" / ")
          : "Standard",
        quantity: item.quantity,
        price: finalPrice,
        image: item.productId.images?.[0]?.url,
      });

      const Model = isVariable ? Variant : Product;
      const stockPath = isVariable
        ? "inventory.stock"
        : "productData.inventory.stock";

      await Model.findByIdAndUpdate(target._id, {
        $inc: { [stockPath]: -item.quantity },
      });

      stockUpdates.push({
        model: Model,
        id: target._id,
        stockPath,
        qty: item.quantity,
      });
    }

    const order = await Order.create({
      userId: user.id,
      region: isIndia ? "IN" : "OUT",
      currency: isIndia ? "INR" : "USD",
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      shippingAddress,
    });

    await Cart.findOneAndUpdate(
      { userId: user.id },
      { items: [] }
    );

    // Async email (non-blocking)
    sendOrderEmails(order, user).catch(console.error);

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Order failed" },
      { status: 500 }
    );
  }
});

// ------------------ HELPER: SEND EMAILS ------------------
async function sendOrderEmails(order: any, user: any) {
  const contactInfo = await ContactInfo.findOne().sort({ createdAt: -1 });
  const adminEmail = contactInfo?.email || process.env.ADMIN_EMAIL;

  await sendEmail({
    to: adminEmail,
    subject: `New Order #${order._id.toString().slice(-6).toUpperCase()}`,
    html: `<h3>Order from ${user?.name}</h3><p>Total: ₹${order?.totalAmount}</p>`
  });

  await sendEmail({
    to: user.email,
    subject: "Order Confirmed!",
    html: `<h3>Thanks for your order, ${user?.name}!</h3><p>ID: ${order._id}</p>`
  });
}

// ------------------ GET USER ORDERS ------------------
export const GET = withAuth(async (req: NextRequest, user: UserPayload) => {
  try {
    const orders = await Order.find({ userId: user.id })
      .populate({ path: 'items.productId' })
      .populate('userId')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

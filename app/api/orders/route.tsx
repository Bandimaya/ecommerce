import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/NewProduct";
import Variant from "@/models/NewVariant";
import User from "@/models/User";
import ContactInfo from "@/models/ContactInfo";
import { withAuth } from "@/lib/withAuth";
import sendEmail from "@/lib/email";

// ------------------ CREATE ORDER ------------------
export const POST = withAuth(async (user, req: NextRequest) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const { shippingAddress, isIndia } = body;

    const cart = await Cart.findOne({ userId: user.id })
      .populate("items.productId")
      .populate("items.variantId")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const orderItems = [];
    let calculatedTotal = 0;
    const priceKey = isIndia ? "price" : "priceOverseas";
    const basePriceKey = isIndia ? "basePrice" : "basePriceOverseas";

    for (const item of cart.items) {
      const isVariable = !!item.variantId;
      const target = isVariable ? item.variantId : item.productId;

      if (!target) throw new Error(`Item no longer exists.`);

      const currentStock = isVariable
        ? target.inventory?.stock
        : target.productData?.inventory?.stock;

      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.productId.name}`);
      }

      const finalPrice = isVariable
        ? (target[priceKey].sale || target[priceKey].regular)
        : (target[basePriceKey].sale || target[basePriceKey].regular);

      calculatedTotal += finalPrice * item.quantity;

      orderItems.push({
        productId: item.productId._id,
        variantId: item.variantId?._id || null,
        name: item.productId.name,
        variantLabel: isVariable ? Object.values(item.variantId.attributes).join(" / ") : "Standard",
        quantity: item.quantity,
        price: finalPrice,
        image: item.productId.images?.[0]?.url,
      });

      const Model = isVariable ? Variant : Product;
      const stockPath = isVariable ? "inventory.stock" : "productData.inventory.stock";

      await Model.findByIdAndUpdate(target._id, {
        $inc: { [stockPath]: -item.quantity }
      }).session(session);
    }

    const order = await Order.create([{
      userId: user.id,
      region: isIndia ? "IN" : "OUT",
      currency: isIndia ? "INR" : "USD",
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      shippingAddress
    }], { session });

    await Cart.findOneAndUpdate({ userId: user.id }, { items: [] }, { session });

    await session.commitTransaction();
    session.endSession();

    // Async email
    sendOrderEmails(order[0], user).catch(console.error);

    return NextResponse.json(order[0], { status: 201 });
  } catch (error: any) {
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: error.message }, { status: 500 });
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
export const GET = withAuth(async (user, req: NextRequest) => {
  try {
    const orders = await Order.find({ userId: user.id })
      .populate({ path: 'items.productId' })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

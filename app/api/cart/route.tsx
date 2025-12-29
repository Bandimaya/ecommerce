import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Product from "@/models/NewProduct";
import Variant from "@/models/NewVariant";
import { getLivePrice } from "@/lib/cartHelpers";
import { verifyToken } from "@/lib/auth"; // Helper to get user from JWT
import { connectDB } from "@/lib/db";

export const GET = async (req: Request) => {
  await connectDB();

  try {
    const userId = verifyToken(req);
    const cart = await Cart.findOne({ userId }).populate(["items.productId", "items.variantId"]);

    if (!cart) return NextResponse.json({ items: [], subtotal: 0 });

    const userCurrency = cart.currencyCode || "USD";
    let subtotal = 0;

    const itemsWithLivePrices = await Promise.all(
      cart.items.map(async (item: any) => {
        const product = item.productId;
        const variant = item.variantId;
        const pricingSource = variant ? variant.pricing : product?.pricing;
        const activePricing = pricingSource?.find((p: any) => p.currency === userCurrency) || pricingSource?.[0];
        const livePrice = activePricing ? (activePricing.salePrice || activePricing.originalPrice) : 0;
        const itemTotal = livePrice * item.quantity;
        subtotal += itemTotal;

        return {
          ...item.toObject(),
          livePrice,
          itemTotal,
          currencySymbol: userCurrency
        };
      })
    );

    return NextResponse.json({
      _id: cart._id,
      currencyCode: userCurrency,
      items: itemsWithLivePrices,
      subtotal: Number(subtotal.toFixed(2)),
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Error fetching cart", error: err.message }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  await connectDB();

  try {
    const userId = verifyToken(req);
    const { productId, variantId, quantity, isIndia, currency } = await req.json();

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const itemIndex = cart.items.findIndex((item: any) =>
      item.productId.toString() === productId &&
      (variantId ? item.variantId?.toString() === variantId : !item.variantId)
    );

    cart.region = isIndia ? "IN" : "OUT";
    cart.currencyCode = currency;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ productId, variantId, quantity });
    }

    await cart.save();
    return NextResponse.json({ message: "Item added to cart", success: true });
  } catch (err: any) {
    return NextResponse.json({ message: "Error adding to cart", error: err.message }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  await connectDB();

  try {
    const userId = verifyToken(req);
    const { cartItemId, quantity } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const item = cart.items.id(cartItemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    item.quantity = quantity;
    await cart.save();

    return NextResponse.json({ message: "Quantity updated", success: true });
  } catch (err: any) {
    return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  await connectDB();

  try {
    const userId = verifyToken(req);
    const url = new URL(req.url);
    const cartItemId = url.searchParams.get("cartItemId");

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    if (cartItemId) {
      cart.items = cart.items.filter((item: any) => item._id.toString() !== cartItemId);
      await cart.save();
      return NextResponse.json(await cart.populate(["items.productId", "items.variantId"]));
    } else {
      await Cart.findOneAndDelete({ userId });
      return NextResponse.json({ message: "Cart cleared successfully", items: [], subtotal: 0 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Removal failed", error: err.message }, { status: 500 });
  }
};

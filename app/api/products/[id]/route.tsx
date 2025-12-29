import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/NewProduct";
import Variant from "@/models/NewVariant";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id)
      .populate("categories")
      .populate("brand")
      .lean();

    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const variants = await Variant.find({ productId: id }).lean();

    return NextResponse.json({ ...product, variants });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    await Variant.deleteMany({ productId: id });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/NewProduct";
import Variant from "@/models/NewVariant";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const product = await Product.findOne({ slug })
      .populate("categories")
      .populate("brand")
      .lean();

    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const variants = await Variant.find({ productId: product._id }).lean();

    return NextResponse.json({ ...product, variants });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

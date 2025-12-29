// app/api/brands/[id]/route.ts
import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  await connectDB();

  try {
    const brand = await Brand.findById(params.id);
    if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ message: "Invalid brand ID" }, { status: 500 });
  }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  await connectDB();

  try {
    const { title, subTitle, description } = await req.json();

    const brand = await Brand.findByIdAndUpdate(
      params.id,
      { title, subTitle, description },
      { new: true, runValidators: true }
    );

    if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

    return NextResponse.json(brand);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Brand with this title already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  await connectDB();

  try {
    const brand = await Brand.findByIdAndDelete(params.id);
    if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Invalid brand ID" }, { status: 500 });
  }
};

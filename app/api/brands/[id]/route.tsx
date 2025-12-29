// app/api/brands/[id]/route.ts
import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB();

  try {
    const { id } = await params;
    console.log('Fetching brand with ID:', params);

    const brand = await Brand.findById(id);
    if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ message: "Invalid brand ID" }, { status: 500 });
  }
};

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB();

  try {
    const { id } = await params;

    const { title, subTitle, description } = await req.json();

    const brand = await Brand.findByIdAndUpdate(
      id,
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

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB();

  try {
    const { id } = await params;

    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Invalid brand ID" }, { status: 500 });
  }
};

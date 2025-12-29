// app/api/brands/route.ts
import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/db";

export const POST = async (req: Request) => {
  await connectDB();

  try {
    const { title, subTitle, description } = await req.json();

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const brand = await Brand.create({ title, subTitle, description });

    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Brand with this title already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Brand.countDocuments(query);

    return NextResponse.json({
      total,
      page,
      limit,
      data: brands,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

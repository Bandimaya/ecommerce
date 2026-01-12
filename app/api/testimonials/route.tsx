import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/models/Testimonial";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const testimonials = await Testimonial.find()
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(testimonials);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const quote = fd.get("quote")?.toString();
    const name = fd.get("name")?.toString();
    const testimonial_type = fd.get("testimonial_type")?.toString() ?? 'product';
    const designation = fd.get("designation")?.toString();
    const file = fd.get("image") as File | null;

    if (!quote || !name || !testimonial_type || !designation || !file) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "testimonials");

    const saved = await Testimonial.create({
      quote,
      name,
      testimonial_type,
      designation,
      image: imageUrl,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const { quote, name, testimonial_type, designation, image } = await req.json();

  if (!quote || !name || !testimonial_type || !designation || !image) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await Testimonial.create({
    quote,
    name,
    testimonial_type,
    designation,
    image,
  });

  return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE ===== */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "ID required" }, { status: 400 });
  }

  await Testimonial.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

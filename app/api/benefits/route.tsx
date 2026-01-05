import { NextRequest, NextResponse } from "next/server";
import Benefit from "@/models/Benefit";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const benefits = await Benefit.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(benefits);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const file = fd.get("image") as File | null;
    const text = fd.get("text")?.toString();
    const alt = fd.get("alt")?.toString();

    if (!file || !text || !alt) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "benefits");
    const saved = await Benefit.create({ image: imageUrl, text, alt });
    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const { image, text, alt } = await req.json();
  if (!image || !text || !alt) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await Benefit.create({ image, text, alt });
  return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE ===== */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "ID required" }, { status: 400 });
  }

  await Benefit.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

import { NextRequest, NextResponse } from "next/server";
import Certification from "@/models/Certification";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const items = await Certification.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(items);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const label = fd.get("label")?.toString();
    const alt = fd.get("alt")?.toString();
    const icon = fd.get("icon")?.toString();
    const file = fd.get("image") as File | null;

    if (!label || !alt || !icon || !file) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "certifications");

    const saved = await Certification.create({
      label,
      alt,
      icon,
      image: imageUrl,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const { label, alt, icon, image } = await req.json();

  if (!label || !alt || !icon || !image) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await Certification.create({
    label,
    alt,
    icon,
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

  await Certification.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

import { NextRequest, NextResponse } from "next/server";
import AwardImage from "@/models/AwardImage";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const images = await AwardImage.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(images);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();

  const contentType = req.headers.get("content-type") || "";

  // ✅ Case 1: Upload file
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const file = fd.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Image file required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "awards");
    const saved = await AwardImage.create({ image: imageUrl });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Case 2: Image URL
  const { image } = await req.json();
  if (!image) {
    return NextResponse.json(
      { message: "Image URL required" },
      { status: 400 }
    );
  }

  const saved = await AwardImage.create({ image });
  return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE ===== */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "ID required" }, { status: 400 });
  }

  await AwardImage.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

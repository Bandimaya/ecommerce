import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Jargon from "@/models/Jargon";
import { saveFile, deleteFile } from "../programs/route";

/* ===== GET ALL ===== */
export async function GET() {
  await connectDB();
  const items = await Jargon.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}

/* ===== CREATE ===== */
export async function POST(req: NextRequest) {
  await connectDB();

  const contentType = req.headers.get("content-type") || "";

  // ✅ FILE UPLOAD
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const title = fd.get("title")?.toString();
    const description = fd.get("description")?.toString();
    const alt = fd.get("alt")?.toString();
    const icon = fd.get("icon")?.toString();
    const color = fd.get("color")?.toString();
    const accentColor = fd.get("accentColor")?.toString();
    const file = fd.get("image") as File | null;

    if (
      !title ||
      !description ||
      !alt ||
      !icon ||
      !color ||
      !accentColor ||
      !file
    ) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imagePath = await saveFile(file, "jargon");

    const saved = await Jargon.create({
      title,
      description,
      alt,
      icon,
      color,
      accentColor,
      image: imagePath,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ IMAGE URL
  const body = await req.json();

  const saved = await Jargon.create(body);
  return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE (BULK) ===== */
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();

  const item = await Jargon.findById(id);
  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (item.image?.startsWith("/uploads/")) {
    await deleteFile(item.image);
  }

  await item.deleteOne();
  return NextResponse.json({ success: true });
}

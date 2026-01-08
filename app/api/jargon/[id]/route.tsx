import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Jargon from "@/models/Jargon";
import { saveFile, deleteFile } from "../../programs/route";

/* ===== GET ONE ===== */
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  // Validate id before querying DB to avoid cast errors
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const item = await Jargon.findById(id);
    if (!item) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ===== UPDATE ===== */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const contentType = req.headers.get("content-type") || "";
  const existing = await Jargon.findById(id);
  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // ✅ FILE UPDATE
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const file = fd.get("image") as File | null;

    if (file) {
      const newImage = await saveFile(file, "jargon");
      await deleteFile(existing.image);
      existing.image = newImage;
    }

    ["title", "description", "alt", "icon", "color", "accentColor"].forEach(
      (key) => {
        const val = fd.get(key)?.toString();
        if (val) (existing as any)[key] = val;
      }
    );

    await existing.save();
    return NextResponse.json(existing);
  }

  // ✅ JSON UPDATE
  const body = await req.json();
  const updated = await Jargon.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

/* ===== DELETE ===== */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

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

import { NextRequest, NextResponse } from "next/server";
import JargonItem from "@/models/Jargon";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const items = await JargonItem.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(items);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
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

    const imageUrl = await saveFile(file, "jargon");

    const saved = await JargonItem.create({
      title,
      description,
      alt,
      icon,
      color,
      accentColor,
      image: imageUrl,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const { title, description, alt, icon, color, accentColor, image } =
    await req.json();

  if (
    !title ||
    !description ||
    !alt ||
    !icon ||
    !color ||
    !accentColor ||
    !image
  ) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await JargonItem.create({
    title,
    description,
    alt,
    icon,
    color,
    accentColor,
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

  await JargonItem.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

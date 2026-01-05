// app/api/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import Program from "@/models/Program";
import { connectDB } from "@/lib/db";

// Helper for saving files manually
const BASE_UPLOAD_DIR = `${process.env.UPLOADS_DIR}`; // 👈 outside Next.js

export const saveFile = async (file: File, folder: string) => {
  const uploadDir = path.join(BASE_UPLOAD_DIR, folder);

  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");

  const filename = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(uploadDir, filename), buffer);

  // URL served via nginx
  return `/uploads/${folder}/${filename}`;
};

/**
 * Deletes a file using its public URL
 * Example input: /uploads/jargon/123-image.png
 */
export const deleteFile = async (fileUrl?: string) => {
  try {
    if (!fileUrl) return;

    // Ensure it's an uploads path (security check)
    if (!fileUrl.startsWith("/uploads/")) return;

    const relativePath = fileUrl.replace("/uploads/", "");
    const filePath = path.join(BASE_UPLOAD_DIR, relativePath);

    if (existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log("Deleted file:", filePath);
    }
  } catch (error) {
    console.error("File delete error:", error);
  }
};

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const programs = await Program.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(programs);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const programId = fd.get("programId")?.toString();
    const title = fd.get("title")?.toString();
    const subtitle = fd.get("subtitle")?.toString();
    const description = fd.get("description")?.toString();
    const icon = fd.get("icon")?.toString();
    const color = fd.get("color")?.toString();
    const stats = JSON.parse(fd.get("stats")?.toString() || "[]");
    const features = JSON.parse(fd.get("features")?.toString() || "[]");
    const file = fd.get("image") as File | null;

    if (
      !programId ||
      !title ||
      !subtitle ||
      !description ||
      !icon ||
      !color ||
      !file
    ) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "programs");

    const saved = await Program.create({
      programId,
      title,
      subtitle,
      description,
      icon,
      color,
      stats,
      features,
      image: imageUrl,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const {
    programId,
    title,
    subtitle,
    description,
    icon,
    color,
    image,
    stats,
    features,
  } = await req.json();

  if (
    !programId ||
    !title ||
    !subtitle ||
    !description ||
    !icon ||
    !color ||
    !image
  ) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await Program.create({
    programId,
    title,
    subtitle,
    description,
    icon,
    color,
    image,
    stats,
    features,
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

  await Program.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

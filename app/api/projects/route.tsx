import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const projects = await Project.find()
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(projects);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const student = fd.get("student")?.toString();
    const title = fd.get("title")?.toString();
    const views = fd.get("views")?.toString();
    const file = fd.get("image") as File | null;

    if (!student || !title || !views || !file) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "projects");

    const saved = await Project.create({
      student,
      title,
      views,
      image: imageUrl,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const { student, title, views, image } = await req.json();

  if (!student || !title || !views || !image) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await Project.create({
    student,
    title,
    views,
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

  await Project.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

import { NextRequest, NextResponse } from "next/server";
import StemCourse from "@/models/StemCourse";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const courses = await StemCourse.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(courses);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();
  const contentType = req.headers.get("content-type") || "";

  // ✅ Upload image
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const courseId = fd.get("courseId")?.toString();
    const title = fd.get("title")?.toString();
    const age = fd.get("age")?.toString();
    const description = fd.get("description")?.toString();
    const level = fd.get("level")?.toString();
    const duration = fd.get("duration")?.toString();
    const enrolled = fd.get("enrolled")?.toString();
    const file = fd.get("image") as File | null;

    if (
      !courseId ||
      !title ||
      !age ||
      !description ||
      !level ||
      !duration ||
      !enrolled ||
      !file
    ) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(file, "stem-courses");

    const saved = await StemCourse.create({
      courseId,
      title,
      age,
      description,
      level,
      duration,
      enrolled,
      image: imageUrl,
    });

    return NextResponse.json(saved, { status: 201 });
  }

  // ✅ Image URL
  const {
    courseId,
    title,
    age,
    description,
    level,
    duration,
    enrolled,
    image,
  } = await req.json();

  if (
    !courseId ||
    !title ||
    !age ||
    !description ||
    !level ||
    !duration ||
    !enrolled ||
    !image
  ) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const saved = await StemCourse.create({
    courseId,
    title,
    age,
    description,
    level,
    duration,
    enrolled,
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

  await StemCourse.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

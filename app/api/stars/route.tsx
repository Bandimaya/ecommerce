import { NextRequest, NextResponse } from "next/server";
import Star from "@/models/Star";
import { connectDB } from "@/lib/db";
import { saveFile, deleteFile } from "../programs/route";

/* ================= GET ================= */
export async function GET() {
  await connectDB();
  const stars = await Star.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(stars);
}

/* ================= POST ================= */
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();

    const name = fd.get("name")?.toString();
    const role = fd.get("role")?.toString();
    const quote = fd.get("quote")?.toString();
    const image = fd.get("image") as File | null;
    const video = fd.get("video") as File | null;

    if (!name || !role || !quote || !image) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(image, "stars");
    const videoUrl = video ? await saveFile(video, "stars/videos") : "";

    const star = await Star.create({
      name,
      role,
      quote,
      image: imageUrl,
      video: videoUrl,
    });

    return NextResponse.json(star, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Create failed" }, { status: 500 });
  }
}

/* ================= PUT ================= */
export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();
    const id = fd.get("id")?.toString();
    if (!id)
      return NextResponse.json({ message: "ID required" }, { status: 400 });

    const star = await Star.findById(id);
    if (!star)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    star.name = fd.get("name")?.toString() || star.name;
    star.role = fd.get("role")?.toString() || star.role;
    star.quote = fd.get("quote")?.toString() || star.quote;

    const image = fd.get("image") as File | null;
    if (image) {
      const img = await saveFile(image, "stars");
      await deleteFile(star.image);
      star.image = img;
    }

    const video = fd.get("video") as File | null;
    if (video) {
      const vid = await saveFile(video, "stars/videos");
      if (star.video) await deleteFile(star.video);
      star.video = vid;
    }

    await star.save();
    return NextResponse.json(star);
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  const star = await Star.findById(id);
  if (!star)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  await deleteFile(star.image);
  if (star.video) await deleteFile(star.video);
  await star.deleteOne();

  return NextResponse.json({ message: "Deleted" });
}

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
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    let name: string | undefined;
    let role: string | undefined;
    let quote: string | undefined;
    let image: File | null = null;
    let video: File | null = null;

    if (contentType.includes("application/json")) {
      // Support JSON bodies for simpler clients (no files)
      const json = await req.json().catch(() => null);
      name = json?.name?.toString();
      role = json?.role?.toString();
      quote = json?.quote?.toString();
    } else {
      // Expect multipart/form-data — but be defensive in case parsing fails
      let fd: FormData | null = null;
      try {
        fd = await req.formData();
      } catch (err) {
        console.error("Failed to parse formData for stars POST", err, { contentType });
        return NextResponse.json({ message: "Invalid form submission" }, { status: 400 });
      }

      name = fd.get("name")?.toString();
      role = fd.get("role")?.toString();
      quote = fd.get("quote")?.toString();
      image = (fd.get("image") as File) || null;
      video = (fd.get("video") as File) || null;
    }

    if (!name || !role || !quote || !image) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    const imageUrl = await saveFile(image, "stars");
    const videoUrl = video ? await saveFile(video, "stars/videos") : "";

    const star = await Star.create({ name, role, quote, image: imageUrl, video: videoUrl });

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
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    let fd: FormData | null = null;

    try {
      fd = await req.formData();
    } catch (err) {
      console.error("Failed to parse formData for stars PUT", err, { contentType });
      return NextResponse.json({ message: "Invalid form submission" }, { status: 400 });
    }

    const id = fd.get("id")?.toString();
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const star = await Star.findById(id);
    if (!star) return NextResponse.json({ message: "Not found" }, { status: 404 });

    star.name = fd.get("name")?.toString() || star.name;
    star.role = fd.get("role")?.toString() || star.role;
    star.quote = fd.get("quote")?.toString() || star.quote;

    const image = (fd.get("image") as File) || null;
    if (image) {
      const img = await saveFile(image, "stars");
      await deleteFile(star.image);
      star.image = img;
    }

    const video = (fd.get("video") as File) || null;
    if (video) {
      const vid = await saveFile(video, "stars/videos");
      if (star.video) await deleteFile(star.video);
      star.video = vid;
    }

    await star.save();
    return NextResponse.json(star);
  } catch (err) {
    console.error(err);
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

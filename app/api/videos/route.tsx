import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/Video";
import { connectDB } from "@/lib/db";

/* ===== GET ===== */
export async function GET() {
  await connectDB();
  const videos = await Video.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(videos);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();

  const { youtubeId } = await req.json();

  if (!youtubeId) {
    return NextResponse.json(
      { message: "YouTube ID required" },
      { status: 400 }
    );
  }

  const saved = await Video.create({ youtubeId });
  return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE ===== */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "ID required" }, { status: 400 });
  }

  await Video.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}

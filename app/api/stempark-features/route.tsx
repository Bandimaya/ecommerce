import { NextRequest, NextResponse } from "next/server";
import StemparkFeature from "@/models/StemparkFeature";
import { connectDB } from "@/lib/db";
import { saveFile, deleteFile } from "../programs/route";

/* ================= GET ================= */
export async function GET() {
  await connectDB();
  const features = await StemparkFeature.find()
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(features);
}

/* ================= POST ================= */
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();

    const title = fd.get("title")?.toString();
    const subtitle = fd.get("subtitle")?.toString();
    const description = fd.get("description")?.toString();
    const stat = fd.get("stat")?.toString();
    const icon = fd.get("icon")?.toString();
    const image = fd.get("image") as File | null;

    if (!title || !subtitle || !description || !stat || !icon || !image) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(image, "stempark");

    const feature = await StemparkFeature.create({
      title,
      subtitle,
      description,
      stat,
      icon,
      image: imageUrl,
    });

    return NextResponse.json(feature, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Create failed" },
      { status: 500 }
    );
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

    const feature = await StemparkFeature.findById(id);
    if (!feature)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    feature.title = fd.get("title")?.toString() || feature.title;
    feature.subtitle = fd.get("subtitle")?.toString() || feature.subtitle;
    feature.description =
      fd.get("description")?.toString() || feature.description;
    feature.stat = fd.get("stat")?.toString() || feature.stat;
    feature.icon = fd.get("icon")?.toString() || feature.icon;

    const image = fd.get("image") as File | null;
    if (image) {
      const img = await saveFile(image, "stempark");
      await deleteFile(feature.image);
      feature.image = img;
    }

    await feature.save();
    return NextResponse.json(feature);
  } catch {
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();
  const feature = await StemparkFeature.findById(id);

  if (!feature)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  await deleteFile(feature.image);
  await feature.deleteOne();

  return NextResponse.json({ message: "Deleted" });
}

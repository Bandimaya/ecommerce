import { NextRequest, NextResponse } from "next/server";
import FAQ from "@/models/FAQ";
import { connectDB } from "@/lib/db";

/* ===== GET ===== */
export async function GET() {
  await connectDB();

  const faqs = await FAQ.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(faqs);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();

  const { question, answer } = await req.json();

  if (!question || !answer) {
    return NextResponse.json(
      { message: "Question and answer are required" },
      { status: 400 }
    );
  }

  const saved = await FAQ.create({ question, answer });

  return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE ===== */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: "FAQ ID is required" },
      { status: 400 }
    );
  }

  await FAQ.findByIdAndDelete(id);

  return NextResponse.json({ message: "FAQ deleted" });
}

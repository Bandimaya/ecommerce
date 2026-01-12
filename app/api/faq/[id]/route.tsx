import { NextRequest, NextResponse } from "next/server";
import FAQ from "@/models/FAQ";
import { connectDB } from "@/lib/db";

/* ===== GET (Single FAQ) ===== */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const faq = await FAQ.findById(id).lean();
  if (!faq) {
    return NextResponse.json(
      { message: "FAQ not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(faq);
}

/* ===== PUT (Update FAQ) ===== */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const { question, answer } = await req.json();

  if (!question || !answer) {
    return NextResponse.json(
      { message: "Question and answer are required" },
      { status: 400 }
    );
  }

  const updated = await FAQ.findByIdAndUpdate(
    id,
    { question, answer },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { message: "FAQ not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* ===== DELETE (Remove FAQ) ===== */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const deleted = await FAQ.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { message: "FAQ not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "FAQ deleted successfully" });
}

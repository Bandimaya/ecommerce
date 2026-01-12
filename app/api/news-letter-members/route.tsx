import { NextRequest, NextResponse } from "next/server";
import Newsletter from "@/models/NewsLetterMembers";
import { connectDB } from "@/lib/db";

/* ===== GET ===== */
export async function GET() {
  await connectDB();

  const members = await Newsletter.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(members);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Email is required" },
      { status: 400 }
    );
  }

  // ✅ Check if already enrolled
  const existing = await Newsletter.findOne({ email });

  if (existing) {
    // Ignore duplicate enrollment
    return NextResponse.json(
      { message: "Already subscribed" },
      { status: 200 }
    );
  }

  const saved = await Newsletter.create({ email });

  return NextResponse.json(saved, { status: 201 });
}

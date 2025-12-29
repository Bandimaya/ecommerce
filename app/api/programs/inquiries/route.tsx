// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from "next/server";
import Inquiry from "@/models/ProgramInquiry";
import { connectDB } from "@/lib/db";

// ----------------- GET ALL INQUIRIES -----------------
export const GET = async (req: NextRequest) => {
  await connectDB();
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

// ----------------- CREATE INQUIRY -----------------
export const POST = async (req: NextRequest) => {
  await connectDB();
  try {
    const body = await req.json();

    await Inquiry.create(body);

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

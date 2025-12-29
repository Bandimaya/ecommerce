import { connectDB } from "@/lib/db";
import Program from "@/models/Program";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    await connectDB();

    const programs = await Program.find({ type: "additional" });

    return NextResponse.json(programs);
};
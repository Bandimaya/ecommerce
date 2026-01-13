import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { withAuth, UserPayload } from "@/lib/withAuth";
import { connectDB } from "@/lib/db";

// ----------------- GET ALL USERS -----------------
export const GET = withAuth(async (req: NextRequest, user: UserPayload) => {
  await connectDB();

  try {
    // Optional: restrict to admin
    // if (user.role !== "admin") {
    //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    // 

    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
});

// ----------------- UPDATE PROFILE -----------------
export const PATCH = withAuth(async (req: NextRequest, user: UserPayload) => {
  await connectDB();

  try {
    const { name, phone, address } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: { name, phone, address } },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
});

// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { withAuth, UserPayload } from "@/lib/withAuth";
import { connectDB } from "@/lib/db";

// GET /api/users/:id
export const GET = withAuth(async (req: NextRequest, user: UserPayload) => {
  await connectDB();

  try {
    // Extract dynamic param from the URL
    const { pathname } = req.nextUrl;
    const segments = pathname.split("/"); // e.g., ["", "api", "users", "123"]
    const id = segments[segments.length - 1];

    const foundUser = await User.findById(id).select("-password");
    if (!foundUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(foundUser);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
});

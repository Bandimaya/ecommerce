// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { withAuth, UserPayload } from "@/lib/withAuth";
import { connectDB } from "@/lib/db";

// ----------------- GET ALL USERS -----------------
export const GET = withAuth(async (user: UserPayload, req: NextRequest) => {
    await connectDB();

    try {
        const users = await User.find().select("-password"); // exclude passwords
        return NextResponse.json(users);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
});

// ----------------- UPDATE PROFILE -----------------
export const PATCH = withAuth(async (user: UserPayload, req: NextRequest) => {
    await connectDB();

    try {
        const body = await req.json();
        const { name, phone, address } = body;

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

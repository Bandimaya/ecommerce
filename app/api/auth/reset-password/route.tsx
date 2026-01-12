// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const POST = async (req: Request) => {
  await connectDB();

  try {
    const { email, curr_pass, token, new_pass } = await req.json();

    // Validate input
    if (!email || !new_pass || (!curr_pass && !token)) {
      return NextResponse.json(
        { message: "Email, new password, and either current password or token are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).select(
      "+password resetPasswordToken resetPasswordExpires"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Case 1: Reset using current password
    if (curr_pass) {
      const isMatch = await bcrypt.compare(curr_pass, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // Case 2: Reset using token
    else if (token) {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      if (
        user.resetPasswordToken !== hashedToken ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires < new Date()
      ) {
        return NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 400 }
        );
      }
      // Clear token fields after successful validation
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
    }

    // Hash new password and save
    user.password = await bcrypt.hash(new_pass, 10);
    await user.save();

    return NextResponse.json(
      { message: "Password has been updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
};

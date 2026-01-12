// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const POST = async (req: Request) => {
    await connectDB();

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email }).select("+password");

        // Always return success (security best practice)
        if (!user) {
            return NextResponse.json(
                {
                    message:
                        "If an account exists for this email, you will receive password reset instructions.",
                },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before saving
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        // Reset URL (frontend page)
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${email}`;

        // TODO: Send email here
        console.log("Password reset link:", resetUrl);

        return NextResponse.json(
            {
                message:
                    "If an account exists for this email, you will receive password reset instructions.",
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
};

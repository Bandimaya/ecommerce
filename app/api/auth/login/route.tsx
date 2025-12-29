// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const POST = async (req: Request) => {
  await connectDB();

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("+password");
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({ token, user: userResponse });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

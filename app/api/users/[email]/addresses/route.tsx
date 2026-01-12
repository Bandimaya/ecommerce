import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: Promise<{ email: string }> }) => {
    await connectDB();
    const { email } = await params;

    try {
        const user = await User.findOne({ email }).select("addresses");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json(user.addresses, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const POST = async (req: Request, { params }: { params: Promise<{ email: string }> }) => {
    await connectDB();
    const { email } = await params;

    try {
        const { line, city, state, pincode } = await req.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const newAddress = { line, city, state, pincode };
        user.addresses.push(newAddress);
        await user.save();

        return NextResponse.json(user.addresses, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

// Update or Delete an address using index (or could use _id if added)
export const PATCH = async (req: Request, { params }: { params: Promise<{ email: string }> }) => {
    await connectDB();
    const { email } = await params;

    try {
        const { index, line, city, state, pincode } = await req.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        if (index === undefined || index < 0 || index >= user.addresses.length) {
            return NextResponse.json({ message: "Invalid address index" }, { status: 400 });
        }

        // Update fields selectively
        if (line !== undefined) user.addresses[index].line = line;
        if (city !== undefined) user.addresses[index].city = city;
        if (state !== undefined) user.addresses[index].state = state;
        if (pincode !== undefined) user.addresses[index].pincode = pincode;

        await user.save();

        return NextResponse.json(user.addresses, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ email: string }> }) => {
    await connectDB();
    const { email } = await params;

    try {
        const { index } = await req.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        if (index === undefined || index < 0 || index >= user.addresses.length) {
            return NextResponse.json({ message: "Invalid address index" }, { status: 400 });
        }

        user.addresses.splice(index, 1);
        await user.save();

        return NextResponse.json(user.addresses, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

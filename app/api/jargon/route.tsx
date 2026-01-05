import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Jargon from "@/models/Jargon";
import { saveFile } from "../programs/route";

/**
 * CREATE Jargon
 * POST /api/jargon
 */
export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const formData = await req.formData();

        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();
        const alt = formData.get("alt")?.toString();
        const color = formData.get("color")?.toString();
        const accentColor = formData.get("accentColor")?.toString();
        const image = formData.get("image") as File | null;

        if (!title || !description || !image) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // ⚠️ upload image here (cloudinary / local / s3)
        const imageUrl = await saveFile(image, "jargon");

        const jargon = await Jargon.create({
            title,
            description,
            alt,
            color,
            accentColor,
            image: imageUrl
        });

        return NextResponse.json(
            { success: true, data: jargon },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("Jargon POST error:", err);
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}

/**
 * READ ALL Jargons
 * GET /api/jargon
 */
export async function GET() {
    await connectDB();

    try {
        const data = await Jargon.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

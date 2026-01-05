import { NextRequest, NextResponse } from "next/server";
import NewsItem from "@/models/NewsItem";
import { connectDB } from "@/lib/db";
import { saveFile } from "../programs/route";

/* ===== GET ===== */
export async function GET() {
    await connectDB();
    const news = await NewsItem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(news);
}

/* ===== POST ===== */
export async function POST(req: NextRequest) {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";

    // ✅ Case 1: Upload image
    if (contentType.includes("multipart/form-data")) {
        const fd = await req.formData();
        const file = fd.get("image") as File | null;
        const text = fd.get("text")?.toString();

        if (!file || !text) {
            return NextResponse.json({ message: "Image file and text are required" },
                { status: 400 });
        }

        const imageUrl = await saveFile(file, "news");
        const saved = await NewsItem.create({
            image: imageUrl,
            text,
        });

        return NextResponse.json(saved, { status: 201 });
    }

    // ✅ Case 2: Image URL
    const { image, text } = await req.json();

    if (!image || !text) {
        return NextResponse.json(
            { message: "Image URL and text required" },
            { status: 400 }
        );
    }

    const saved = await NewsItem.create({ image, text });
    return NextResponse.json(saved, { status: 201 });
}

/* ===== DELETE ===== */
export async function DELETE(req: NextRequest) {
    await connectDB();

    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    await NewsItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
}

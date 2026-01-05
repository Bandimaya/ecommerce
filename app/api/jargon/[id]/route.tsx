import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Jargon from "@/models/Jargon";
import { deleteFile, saveFile } from "../../programs/route";

/**
 * READ ONE
 * GET /api/jargon/:id
 */
export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();

    try {
        const {id} = await params;
        const jargon = await Jargon.findById(id);

        if (!jargon) {
            return NextResponse.json(
                { message: "Jargon not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: jargon });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

/**
 * UPDATE
 * PUT /api/jargon/:id
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();

    try {
        const formData = await req.formData();
        const {id} = await params;

        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();
        const alt = formData.get("alt")?.toString();
        const color = formData.get("color")?.toString();
        const accentColor = formData.get("accentColor")?.toString();
        const image = formData.get("image") as File | null;

        const existing = await Jargon.findById(id);

        if (!existing) {
            return NextResponse.json(
                { message: "Jargon not found", id: id },
                { status: 404 }
            );
        }

        const updateData: any = {
            title,
            description,
            alt,
            color,
            accentColor
        };

        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );

        if (image && image.size > 0) {
            if (existing.image) {
                await deleteFile(existing.image);
            }
            updateData.image = await saveFile(image, "jargon");
        }

        const updated = await Jargon.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { message: "Jargon not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("UPDATE Jargon Error:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE
 * DELETE /api/jargon/:id
 */
export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();

    try {
        const {id} = (await params);
        const deleted = await Jargon.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { message: "Jargon not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Jargon deleted successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

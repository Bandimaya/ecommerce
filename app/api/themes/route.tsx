import { NextRequest, NextResponse } from "next/server";
import Theme from "@/models/Theme";
import { connectDB } from "@/lib/db";

// ----------------- GET ALL THEMES -----------------
export const GET = async (req: NextRequest) => {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const isPublic = searchParams.get("public");

    // Build Query
    let query: any = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (isPublic === "true") query.isPublic = true;

    const themes = await Theme.find(query).sort({ createdAt: -1 });

    return NextResponse.json(themes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// ----------------- CREATE NEW THEME -----------------
export const POST = async (req: NextRequest) => {
  await connectDB();

  try {
    const body = await req.json();
    const { name, config, isPublic, createdBy } = body;

    // Basic Validation
    if (!name || !config || !config.color) {
      return NextResponse.json(
        { message: "Theme name and core configuration are required" },
        { status: 400 }
      );
    }

    // Check for existing name
    const existingTheme = await Theme.findOne({ name });
    if (existingTheme) {
      return NextResponse.json(
        { message: "A theme with this name already exists" },
        { status: 409 }
      );
    }

    const theme = await Theme.create({
      name,
      config,
      isPublic: isPublic ?? true,
      createdBy,
    });

    return NextResponse.json(theme, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// ----------------- UPDATE THEME -----------------
export const PUT = async (req: NextRequest) => {
  await connectDB();

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "Theme ID is required" }, { status: 400 });
    }

    const updatedTheme = await Theme.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTheme) {
      return NextResponse.json({ message: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTheme);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// ----------------- DELETE THEME -----------------
export const DELETE = async (req: NextRequest) => {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Theme ID is required" }, { status: 400 });
    }

    const deletedTheme = await Theme.findByIdAndDelete(id);

    if (!deletedTheme) {
      return NextResponse.json({ message: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Theme deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
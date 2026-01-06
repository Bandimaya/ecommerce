import { NextRequest, NextResponse } from "next/server";
import Section from "@/models/Section"; // Your Section model
import { connectDB } from "@/lib/db";
import { deleteFile, saveFile } from "../programs/route";

// Connect to the database


export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const sections = await Section.find().lean(); // Fetch all sections
    return NextResponse.json(sections);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching sections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();

    const label = formData.get("label")?.toString();
    const icon = formData.get("icon") as File | null;
    const description = formData.get("description")?.toString();

    // Validate the data
    if (!label || !icon || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    const iconUrl = await saveFile(icon, "sections");

    // Create a new section
    const newSection = await Section.create({
      label,
      icon: iconUrl,
      description
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (err) {
    console.error("Section POST error:", err);
    return NextResponse.json({ message: "Error creating section" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();

  const id = formData.get("id")?.toString();
  const label = formData.get("label")?.toString();
  const icon = formData.get("icon") as File | null;
  const description = formData.get("description")?.toString();

  if (!id) {
    return NextResponse.json({ message: "Section ID is required" }, { status: 400 });
  }

  try {
    const section = await Section.findById(id);
    if (!section) return NextResponse.json({ message: "Section not found" }, { status: 404 });

    // Update section details
    section.label = label || section.label;
    if (icon) {
      section.icon = await saveFile(icon, "sections");
      const existing = await Section.findById(id);
      if (existing?.icon) {
        await deleteFile(existing.icon);
      }
    }
    section.description = description || section.description;

    await section.save();

    return NextResponse.json(section, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error updating section" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Section ID is required" }, { status: 400 });
  }

  try {
    const section = await Section.findById(id);
    if (!section) return NextResponse.json({ message: "Section not found" }, { status: 404 });

    await section.deleteOne();
    return NextResponse.json({ message: "Section deleted successfully" }, { status: 200 });
  } catch (err) {
    console.log("Section DELETE error:", err);
    return NextResponse.json({ message: "Error deleting section" }, { status: 500 });
  }
}

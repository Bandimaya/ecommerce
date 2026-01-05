// app/api/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import Program from "@/models/Program";
import { connectDB } from "@/lib/db";

// Helper for saving files manually
const BASE_UPLOAD_DIR = `${process.env.UPLOADS_DIR}`; // 👈 outside Next.js

export const saveFile = async (file: File, folder: string) => {
  const uploadDir = path.join(BASE_UPLOAD_DIR, folder);

  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");

  const filename = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(uploadDir, filename), buffer);

  // URL served via nginx
  return `/uploads/${folder}/${filename}`;
};

/**
 * Deletes a file using its public URL
 * Example input: /uploads/jargon/123-image.png
 */
export const deleteFile = async (fileUrl?: string) => {
  try {
    if (!fileUrl) return;

    // Ensure it's an uploads path (security check)
    if (!fileUrl.startsWith("/uploads/")) return;

    const relativePath = fileUrl.replace("/uploads/", "");
    const filePath = path.join(BASE_UPLOAD_DIR, relativePath);

    if (existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log("Deleted file:", filePath);
    }
  } catch (error) {
    console.error("File delete error:", error);
  }
};

// ----------------- GET ALL PROGRAMS -----------------
export const GET = async (req: NextRequest) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const query = (type === "main" || type === "additional") ? { type } : {};
  const programs = await Program.find(query);

  return NextResponse.json(programs);
};

// ----------------- CREATE PROGRAM -----------------
export const POST = async (req: NextRequest) => {
  await connectDB();
  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File || formData.get("image") as File;
    if (!file) return NextResponse.json({ message: "Program image is required" }, { status: 400 });

    const logoUrl = await saveFile(file, "programs");

    // Helper to parse arrays safely from FormData
    const parseArray = (key: string) => {
      const value = formData.get(key);
      if (!value) return [];
      try {
        // If it's a JSON string from frontend, parse it
        return JSON.parse(value as string);
      } catch {
        // Fallback for simple comma-separated strings
        return (value as string).split(",").map(i => i.trim()).filter(Boolean);
      }
    };

    const program = await Program.create({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),
      type: formData.get("type"),
      icon: formData.get("icon"),
      color: formData.get("color"),
      // --- NEW STEM FIELDS ---
      durationWeeks: Number(formData.get("durationWeeks")) || 0,
      ageGroup: formData.get("ageGroup"),
      prerequisites: formData.get("prerequisites"),
      certification: formData.get("certification"),
      features: parseArray("features"),
      equipment: parseArray("equipment"),
      learningOutcomes: parseArray("learningOutcomes"),
      // -----------------------
      image: {
        url: logoUrl,
        alt: formData.get("title") || "program image",
        position: 1,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

// ----------------- UPDATE PROGRAM -----------------
export const PUT = async (req: NextRequest) => {
  await connectDB();
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    if (!id) return NextResponse.json({ message: "Program ID required" }, { status: 400 });

    const program = await Program.findById(id);
    if (!program) return NextResponse.json({ message: "Program not found" }, { status: 404 });

    const file = formData.get("file") as File || formData.get("image") as File;
    if (file && file.size > 0) {
      if (program.image?.url) {
        const oldPath = path.join(process.cwd(), "public", program.image.url);
        try { await fs.unlink(oldPath); } catch (e) {}
      }
      program.image.url = await saveFile(file, "programs");
    }

    // Helper to parse arrays safely
    const parseArray = (key: string) => {
      const value = formData.get(key);
      try { return JSON.parse(value as string); } 
      catch { return (value as string || "").split(",").map(i => i.trim()).filter(Boolean); }
    };

    // Update standard fields
    program.title = formData.get("title") ?? program.title;
    program.subtitle = formData.get("subtitle") ?? program.subtitle;
    program.description = formData.get("description") ?? program.description;
    program.type = formData.get("type") ?? program.type;
    program.icon = formData.get("icon") ?? program.icon;
    program.color = formData.get("color") ?? program.color;

    // Update STEM specific fields
    if (formData.has("durationWeeks")) program.durationWeeks = Number(formData.get("durationWeeks"));
    if (formData.has("ageGroup")) program.ageGroup = formData.get("ageGroup");
    if (formData.has("prerequisites")) program.prerequisites = formData.get("prerequisites");
    if (formData.has("certification")) program.certification = formData.get("certification");
    
    // Update Array fields
    if (formData.has("features")) program.features = parseArray("features");
    if (formData.has("equipment")) program.equipment = parseArray("equipment");
    if (formData.has("learningOutcomes")) program.learningOutcomes = parseArray("learningOutcomes");

    await program.save();
    return NextResponse.json(program);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

// ----------------- DELETE PROGRAM -----------------
export const DELETE = async (req: NextRequest) => {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Program ID required" }, { status: 400 });

    const program = await Program.findByIdAndDelete(id);
    if (!program) return NextResponse.json({ message: "Program not found" }, { status: 404 });

    if (program.image?.url) {
      const imgPath = path.join(process.cwd(), "public", program.image.url);
      try { await fs.unlink(imgPath); } catch (e) { /* ignore */ }
    }

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
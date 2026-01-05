import { NextRequest, NextResponse } from "next/server";
import Winner from "@/models/Winner";
import { connectDB } from "@/lib/db";
import { saveFile, deleteFile } from "../programs/route";

/* ===================== GET ===================== */
// Get all winners
export async function GET() {
  await connectDB();

  try {
    const winners = await Winner.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(winners, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching winners" },
      { status: 500 }
    );
  }
}

/* ===================== POST ===================== */
// Create winner
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();

    const team = formData.get("team")?.toString();
    const event = formData.get("event")?.toString();
    const position = formData.get("position")?.toString();
    const school = formData.get("school")?.toString();
    const category = formData.get("category")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image") as File | null;

    if (
      !team ||
      !event ||
      !position ||
      !school ||
      !category ||
      !description ||
      !image
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const imageUrl = await saveFile(image, "winners");

    const winner = await Winner.create({
      team,
      event,
      position,
      school,
      category,
      description,
      image: imageUrl,
    });

    return NextResponse.json(winner, { status: 201 });
  } catch (error) {
    console.error("Winner POST error:", error);
    return NextResponse.json(
      { message: "Error creating winner" },
      { status: 500 }
    );
  }
}

/* ===================== PUT ===================== */
// Update winner
export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();

    const id = formData.get("id")?.toString();
    if (!id) {
      return NextResponse.json(
        { message: "Winner ID is required" },
        { status: 400 }
      );
    }

    const winner = await Winner.findById(id);
    if (!winner) {
      return NextResponse.json(
        { message: "Winner not found" },
        { status: 404 }
      );
    }

    const team = formData.get("team")?.toString();
    const event = formData.get("event")?.toString();
    const position = formData.get("position")?.toString();
    const school = formData.get("school")?.toString();
    const category = formData.get("category")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image") as File | null;

    // Update fields
    winner.team = team || winner.team;
    winner.event = event || winner.event;
    winner.position = position || winner.position;
    winner.school = school || winner.school;
    winner.category = category || winner.category;
    winner.description = description || winner.description;

    if (image) {
      const newImage = await saveFile(image, "winners");
      await deleteFile(winner.image);
      winner.image = newImage;
    }

    await winner.save();

    return NextResponse.json(winner, { status: 200 });
  } catch (error) {
    console.error("Winner PUT error:", error);
    return NextResponse.json(
      { message: "Error updating winner" },
      { status: 500 }
    );
  }
}

/* ===================== DELETE ===================== */
// Delete winner
export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Winner ID is required" },
        { status: 400 }
      );
    }

    const winner = await Winner.findById(id);
    if (!winner) {
      return NextResponse.json(
        { message: "Winner not found" },
        { status: 404 }
      );
    }

    await deleteFile(winner.image);
    await winner.deleteOne();

    return NextResponse.json(
      { message: "Winner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Winner DELETE error:", error);
    return NextResponse.json(
      { message: "Error deleting winner" },
      { status: 500 }
    );
  }
}

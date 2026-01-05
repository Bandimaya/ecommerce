import { NextRequest, NextResponse } from "next/server";
import SectionCourse from "@/models/SectionCourse"; // SectionCourse model
import Section from "@/models/Section"; // Section model to associate with SectionCourse
import { connectDB } from "@/lib/db"; // Database connection utility
import { deleteFile, saveFile } from "../programs/route";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const sectionCourses = await SectionCourse.find()
      .populate("sectionId") // Populate section data
      .lean(); // Get plain JS object instead of Mongoose documents

    return NextResponse.json(sectionCourses);
  } catch (err) {
    return NextResponse.json({ message: "Error fetching section courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const title = formData.get('title')?.toString();
    const ageRange = formData.get('ageRange')?.toString();
    const imageFile = formData.get('image') as File;
    const alt = formData.get('alt')?.toString();
    const description = formData.get('description')?.toString();
    const duration = formData.get('duration')?.toString();
    const level = formData.get('level')?.toString();
    const skills = formData.get('skills')?.toString(); // Comma-separated string
    const rating = formData.get('rating')?.toString();
    const enrolled = formData.get('enrolled')?.toString();
    const sectionId = formData.get('sectionId')?.toString();

    // Validate required fields
    if (!title || !ageRange || !imageFile || !description || !sectionId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if the section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 });
    }

    // Save image file and get the URL
    const imageUrl = await saveFile(imageFile, 'section-course');

    // Convert skills to array if available
    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

    // Parse rating as an integer
    const parsedRating = rating ? parseInt(rating) : 0;

    // Create the new course in the database
    const newSectionCourse = await SectionCourse.create({
      title,
      ageRange,
      image: imageUrl,
      alt,
      description,
      duration,
      level,
      skills: skillsArray,
      rating: parsedRating,
      enrolled,
      sectionId
    });

    return NextResponse.json(newSectionCourse, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error creating section course" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    
    // Extract form data
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString();
    const ageRange = formData.get('ageRange')?.toString();
    const alt = formData.get('alt')?.toString();
    const description = formData.get('description')?.toString();
    const duration = formData.get('duration')?.toString();
    const level = formData.get('level')?.toString();
    const skills = formData.get('skills')?.toString();
    const rating = formData.get('rating')?.toString();
    const enrolled = formData.get('enrolled')?.toString();
    const sectionId = formData.get('sectionId')?.toString();
    const imageFile = formData.get('image') as File;

    if (!id) {
      return NextResponse.json({ message: "SectionCourse ID is required" }, { status: 400 });
    }

    const sectionCourse = await SectionCourse.findById(id);
    if (!sectionCourse) {
      return NextResponse.json({ message: "SectionCourse not found" }, { status: 404 });
    }

    // Check if the section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 });
    }

    // If a new image is provided, handle the image upload
    let imageUrl = sectionCourse.image; // Default to the existing image if no new one is provided
    
    if (imageFile) {
      // If there is an old image, delete it first
      if (sectionCourse.image) {
        await deleteFile(sectionCourse.image); // Assuming this deletes the old image
      }

      // Save the new image
      imageUrl = await saveFile(imageFile, 'section-course');
    }

    // Update SectionCourse fields
    sectionCourse.title = title || sectionCourse.title;
    sectionCourse.ageRange = ageRange || sectionCourse.ageRange;
    sectionCourse.image = imageUrl;
    sectionCourse.alt = alt || sectionCourse.alt;
    sectionCourse.description = description || sectionCourse.description;
    sectionCourse.duration = duration || sectionCourse.duration;
    sectionCourse.level = level || sectionCourse.level;
    sectionCourse.skills = skills ? skills.split(',') : sectionCourse.skills; // Assuming skills is a comma-separated string
    sectionCourse.rating = rating ? Number(rating) : sectionCourse.rating; // Assuming rating is a number
    sectionCourse.enrolled = enrolled || sectionCourse.enrolled;
    sectionCourse.sectionId = sectionId || sectionCourse.sectionId;

    // Save updated section course
    await sectionCourse.save();

    return NextResponse.json(sectionCourse, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating section course" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "SectionCourse ID is required" }, { status: 400 });
    }

    const sectionCourse = await SectionCourse.findById(id);
    if (!sectionCourse) {
      return NextResponse.json({ message: "SectionCourse not found" }, { status: 404 });
    }

    // Delete the section course
    await sectionCourse.remove();
    return NextResponse.json({ message: "SectionCourse deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error deleting section course" }, { status: 500 });
  }
}

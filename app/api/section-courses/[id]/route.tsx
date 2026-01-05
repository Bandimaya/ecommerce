import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import SectionCourse from '@/models/SectionCourse';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();

    const { id } = await params;  // Get the ID from the route params

    try {
        // Fetch the course from the database using the provided ID
        const course = await SectionCourse.findById(id);

        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json(course, { status: 200 });
    } catch (err) {
        console.error("Error fetching course:", err);
        return NextResponse.json({ message: "Error fetching course" }, { status: 500 });
    }
}

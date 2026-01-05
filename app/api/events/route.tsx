// app/api/events/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/models/Event';  // Import Event model
import { connectDB } from '@/lib/db';
import { deleteFile, saveFile } from '../programs/route';

// Create Event (POST)
export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const formData = await req.formData(); // Retrieve FormData from request

        const title = formData.get("title")?.toString();
        const subtitle = formData.get("subtitle")?.toString();
        const category = formData.get("category")?.toString();
        const thumbnail = formData.get("thumbnail")?.toString(); // Thumbnail image URL (optional)
        const color = formData.get("color")?.toString();
        const bgGradient = formData.get("bgGradient")?.toString();
        const count = formData.get("count")?.toString();
        const logo = formData.get("logo") as File;

        if (!title || !subtitle || !category || !logo) {
            return NextResponse.json(
                { message: "Missing required fields (title, subtitle, category, or logo)" },
                { status: 400 }
            );
        }

        // Save image file
        const imagePath = await saveFile(logo, 'events');

        const newEvent = new Event({
            title,
            subtitle,
            category,
            thumbnail,
            logo: imagePath, // Save the path of the uploaded logo
            color,
            bgGradient,
            count
        });

        await newEvent.save();

        return NextResponse.json(newEvent, { status: 201 });
    } catch (err) {
        console.error("Error creating event:", err);
        return NextResponse.json({ message: "Error creating event" }, { status: 500 });
    }
}

// Get All Events (GET)
export async function GET() {
    await connectDB();
    try {
        const events = await Event.find();
        return NextResponse.json(events, { status: 200 });
    } catch (err) {
        console.error('Error fetching events:', err);
        return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
    }
}

// Update Event by ID (PUT)
export async function PUT(req: NextRequest) {
    await connectDB();
    try {
        const formData = await req.formData();

        const id = formData.get('id')?.toString();
        const title = formData.get('title')?.toString();
        const subtitle = formData.get('subtitle')?.toString();
        const category = formData.get('category')?.toString();
        const thumbnail = formData.get('thumbnail')?.toString();
        const logo = formData.get('logo') as File;
        const color = formData.get('color')?.toString();
        const bgGradient = formData.get('bgGradient')?.toString();
        const count = formData.get('count')?.toString();

        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        // Update fields
        event.title = title || event.title;
        event.subtitle = subtitle || event.subtitle;
        event.category = category || event.category;
        event.thumbnail = thumbnail || event.thumbnail;
        if (logo) {
            await deleteFile(event.logo);
            event.logo = await saveFile(logo, 'events');
        }
        event.color = color || event.color;
        event.bgGradient = bgGradient || event.bgGradient;
        event.count = count || event.count;

        await event.save();
        return NextResponse.json(event);
    } catch (err) {
        console.error("Error updating event:", err);
        return NextResponse.json({ message: "Error updating event" }, { status: 500 });
    }
}

// Delete Event by ID (DELETE)
export async function DELETE(req: NextRequest) {
    await connectDB();
    try {
        const { id } = await req.json();

        const event = await Event.findByIdAndDelete(id);
        if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error deleting event:', err);
        return NextResponse.json({ message: 'Error deleting event' }, { status: 500 });
    }
}

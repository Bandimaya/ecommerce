import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Registration from '@/models/EventRegistrations';
import Event from '@/models/Event';

// Create Registration (POST)
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { eventId, name, email, phone } = body;

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Prevent duplicate registration (optional but recommended)
    const existing = await Registration.findOne({ event: eventId, email });
    if (existing) {
      return NextResponse.json(
        { message: 'Already registered for this event' },
        { status: 409 }
      );
    }

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      name,
      email,
      phone,
    });

    // Increment event count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { count: 1 },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (err) {
    console.error('Error creating registration:', err);
    return NextResponse.json(
      { message: 'Error creating registration' },
      { status: 500 }
    );
  }
}

// Get All Registrations (GET)
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    const filter = eventId ? { event: eventId } : {};

    const registrations = await Registration.find(filter)
      .populate('event', 'title category')
      .sort({ createdAt: -1 });

    return NextResponse.json(registrations, { status: 200 });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    return NextResponse.json(
      { message: 'Error fetching registrations' },
      { status: 500 }
    );
  }
}

// Delete Registration (DELETE)
export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { id } = await req.json();

    const registration = await Registration.findByIdAndDelete(id);
    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    // Decrement event count
    await Event.findByIdAndUpdate(registration.event, {
      $inc: { count: -1 },
    });

    return NextResponse.json(
      { message: 'Registration deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting registration:', err);
    return NextResponse.json(
      { message: 'Error deleting registration' },
      { status: 500 }
    );
  }
}

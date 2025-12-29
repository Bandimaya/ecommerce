import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/Contacts";
import ContactInfo from "@/models/ContactInfo";
import { connectDB } from "@/lib/db";
import sendEmail from "@/lib/email";

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save to database
        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });

        const savedContact = await newContact.save();

        if (!savedContact?._id) {
            throw new Error("Failed to save contact record");
        }

        console.log("Contact saved successfully:", savedContact._id);

        // Fetch admin email
        const contactSettings = await ContactInfo.findOne().sort({ createdAt: -1 });
        const adminEmail = contactSettings?.email || process.env.ADMIN_EMAIL;

        // Send email asynchronously (non-blocking)
        if (adminEmail) {
            sendEmail({
                to: adminEmail,
                subject: `New Inquiry: ${subject || "No subject"}`,
                html: `<h3>New Message from ${name}</h3><p>${message}</p><p>Email: ${email}</p>`
            }).catch(err => console.error("Admin notification email failed:", err));
        }

        return NextResponse.json({ success: true, data: savedContact }, { status: 201 });

    } catch (err: any) {
        console.error("SubmitContactForm Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

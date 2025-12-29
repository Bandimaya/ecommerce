import { NextResponse } from "next/server";
import fs from "fs/promises"; // Use promises for cleaner code
import path from "path";
import ContactInfo from "@/models/ContactInfo";
import { connectDB } from "@/lib/db";
import { withAuth, UserPayload } from "@/lib/withAuth";

export async function GET() {
  await connectDB();
  const contact = await ContactInfo.findOne();
  if (!contact) return NextResponse.json({ message: "Contact not found" }, { status: 404 });
  return NextResponse.json(contact);
}

export const PUT = withAuth(async (user: UserPayload, req: Request) => {
  try {
    await connectDB();

    // 1. Parse FormData natively
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const hours = formData.get("hours") as string;
    const file = formData.get("logo") as File | null;

    let logoUrl = undefined;

    // 2. Handle File Upload (Manual save)
    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "branding");

      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name}`;
      const filePath = path.join(uploadDir, filename);

      // Convert file to Buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      // Save the path relative to the 'public' folder for web access
      logoUrl = `/uploads/branding/${filename}`;
    }

    // 3. Database Operations
    let contact = await ContactInfo.findOne();

    if (!contact) {
      contact = new ContactInfo({ email, phone, address, hours, logo_url: logoUrl });
    } else {
      contact.email = email ?? contact.email;
      contact.phone = phone ?? contact.phone;
      contact.address = address ?? contact.address;
      contact.hours = hours ?? contact.hours;
      if (logoUrl) contact.logo_url = logoUrl;
    }

    await contact.save();
    return NextResponse.json(contact);

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
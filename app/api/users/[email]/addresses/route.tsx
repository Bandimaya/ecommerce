import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const GET = async (req: Request, { params }: { params: Promise<{ email: string }> }) => {
    await connectDB();
    const { email } = await params;

    try {
        const user = await User.findOne({ email }).select("addresses");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json(user.addresses, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

function validateAddress(data: any, isPatch = false) {
  if (!isPatch && !data.label) {
    throw new Error("Label is required");
  }

  if (!data.country) {
    throw new Error("Country is required");
  }

  if (data.country === "IN") {
    if (!data.doorNo || !data.street || !data.city || !data.pincode) {
      throw new Error("Invalid Indian address");
    }
  } else {
    if (!data.city || !data.street) {
      throw new Error("Invalid international address");
    }
  }
}

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) => {
  await connectDB();
  const { email } = await params;

  try {
    const data = await req.json();

    validateAddress(data);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newAddress = {
      label: data.label,
      country: data.country,
      doorNo: data.doorNo || "",
      street: data.street || "",
      village: data.village || "",
      city: data.city,
      state: data.state || "",
      pincode: data.pincode || "",
      zone: data.zone || "",
      building: data.building || "",
      isDefault: data.isDefault || false,
    };

    // Optional: enforce single default
    if (newAddress.isDefault) {
      user.addresses.forEach((a: any) => (a.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json(user.addresses, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) => {
  await connectDB();
  const { email } = await params;

  try {
    const { _id, ...updates } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { message: "Address ID required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const address = user.addresses.id(_id);
    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    validateAddress({ ...address.toObject(), ...updates }, true);

    const allowedFields = [
      "label",
      "country",
      "doorNo",
      "street",
      "village",
      "city",
      "state",
      "pincode",
      "zone",
      "building",
      "isDefault",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        (address as any)[field] = updates[field];
      }
    });

    // Enforce single default
    if (updates.isDefault) {
      user.addresses.forEach((a: any) => {
        if (a._id.toString() !== _id) a.isDefault = false;
      });
    }

    await user.save();
    return NextResponse.json(user.addresses, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ email: string }> }) => {
    await connectDB();
    const { email } = await params;

    try {
        const { index } = await req.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        if (index === undefined || index < 0 || index >= user.addresses.length) {
            return NextResponse.json({ message: "Invalid address index" }, { status: 400 });
        }

        user.addresses.splice(index, 1);
        await user.save();

        return NextResponse.json(user.addresses, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

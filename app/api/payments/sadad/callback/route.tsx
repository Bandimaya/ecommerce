import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

/**
 * 🔐 Generate SADAD Signature (same logic as request)
 */
function generateSadadSignature(
    payload: Record<string, any>,
    secretKey: string
) {
    // ❌ Remove non-signable fields
    const excludedKeys = ["signature", "productdetail"];

    const filtered: Record<string, any> = {};
    Object.keys(payload)
        .filter((k) => !excludedKeys.includes(k))
        .sort()
        .forEach((key) => {
            filtered[key] = payload[key];
        });

    // Convert to key=value|key=value
    const dataString = Object.entries(filtered)
        .map(([k, v]) => `${k}=${v}`)
        .join("|");

    return crypto
        .createHash("sha256")
        .update(dataString + secretKey)
        .digest("hex");
}

/**
 * 📥 SADAD CALLBACK
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            ORDER_ID,
            TXN_STATUS,
            TXN_AMOUNT,
            signature,
        } = body;

        if (!ORDER_ID || !signature) {
            return NextResponse.json(
                { success: false, message: "Invalid callback payload" },
                { status: 400 }
            );
        }

        // 🔐 Verify signature
        const expectedSignature = generateSadadSignature(
            body,
            process.env.SADAD_SECRET_KEY!
        );

        if (expectedSignature !== signature) {
            return NextResponse.json(
                { success: false, message: "Signature mismatch" },
                { status: 401 }
            );
        }

        // 🔎 Fetch order
        const order = await Order.findById(ORDER_ID);
        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // 💰 Validate amount
        if (Number(TXN_AMOUNT) !== Number(order.totalAmount)) {
            return NextResponse.json(
                { success: false, message: "Amount mismatch" },
                { status: 400 }
            );
        }

        // ✅ Update order status
        if (TXN_STATUS === "SUCCESS") {
            order.paymentStatus = "PAID";
            order.paymentMethod = "SADAD";
            order.paymentDetails = body;
            await order.save();
        } else {
            order.paymentStatus = "FAILED";
            order.paymentDetails = body;
            await order.save();
        }

        // 🟢 MUST return success to SADAD
        return NextResponse.json({
            success: true,
            message: "Callback processed successfully",
        });
    } catch (error) {
        console.error("SADAD CALLBACK ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

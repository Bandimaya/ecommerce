import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { generateSadadSignature } from "@/lib/sadad";
import { UserPayload, withAuth } from "@/lib/withAuth";

export const POST = withAuth(
    async (req: NextRequest, user: UserPayload) => {
        await connectDB();

        const { orderId } = await req.json();
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        const txnDate = new Date().toISOString().replace("T", " ").substring(0, 19);

        const payload: any = {
            merchant_id: "6205111",
            WEBSITE: "https://unchested-tristin-unbuffeted.ngrok-free.dev",
            ORDER_ID: order._id.toString(),
            TXN_AMOUNT: order.totalAmount.toFixed(2),
            EMAIL: order.shippingAddress.email,
            CURRENCY: "INR",
            MOBILE_NO: order.shippingAddress.phone,
            CALLBACK_URL: `https://unchested-tristin-unbuffeted.ngrok-free.dev/api/payments/sadad/callback`,
            txnDate,

            // array → excluded from signature
            productdetail: order.items.map((i: any) => ({
                order_id: i.productId.toString(),
                amount: i.price,
                quantity: i.quantity,
            })),
        };

        // 🔐 SIGNATURE
        const signature = generateSadadSignature(
            payload,
            process.env.NEXT_PUBLIC_SADAD_SECRET_KEY!
        );

        return NextResponse.json({
            actionUrl: "https://sadadqa.com/webpurchase",
            payload: {
                ...payload,
                signature,
            },
        });
    }
);

// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import Order from "@/models/Order";
// import { connectDB } from "@/lib/db";

// /**
//  * 🔐 Generate SADAD Signature (same logic as request)
//  */
// function generateSadadSignature(
//     payload: Record<string, any>,
//     secretKey: string
// ) {
//     // ❌ Remove non-signable fields
//     const excludedKeys = ["signature", "productdetail"];

//     const filtered: Record<string, any> = {};
//     Object.keys(payload)
//         .filter((k) => !excludedKeys.includes(k))
//         .sort()
//         .forEach((key) => {
//             filtered[key] = payload[key];
//         });

//     // Convert to key=value|key=value
//     const dataString = Object.entries(filtered)
//         .map(([k, v]) => `${k}=${v}`)
//         .join("|");

//     return crypto
//         .createHash("sha256")
//         .update(dataString + secretKey)
//         .digest("hex");
// }

// /**
//  * 📥 SADAD CALLBACK
//  */
// export async function POST(req: NextRequest) {
//     try {
//         await connectDB();

//         const body = await req.json();

//         const {
//             ORDER_ID,
//             TXN_STATUS,
//             TXN_AMOUNT,
//             signature,
//         } = body;

//         if (!ORDER_ID || !signature) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid callback payload" },
//                 { status: 400 }
//             );
//         }

//         // 🔐 Verify signature
//         const expectedSignature = generateSadadSignature(
//             body,
//             process.env.SADAD_SECRET_KEY!
//         );

//         if (expectedSignature !== signature) {
//             return NextResponse.json(
//                 { success: false, message: "Signature mismatch" },
//                 { status: 401 }
//             );
//         }

//         // 🔎 Fetch order
//         const order = await Order.findById(ORDER_ID);
//         if (!order) {
//             return NextResponse.json(
//                 { success: false, message: "Order not found" },
//                 { status: 404 }
//             );
//         }

//         // 💰 Validate amount
//         if (Number(TXN_AMOUNT) !== Number(order.totalAmount)) {
//             return NextResponse.json(
//                 { success: false, message: "Amount mismatch" },
//                 { status: 400 }
//             );
//         }

//         // ✅ Update order status
//         if (TXN_STATUS === "SUCCESS") {
//             order.paymentStatus = "PAID";
//             order.paymentMethod = "SADAD";
//             order.paymentDetails = body;
//             await order.save();
//         } else {
//             order.paymentStatus = "FAILED";
//             order.paymentDetails = body;
//             await order.save();
//         }

//         // 🟢 MUST return success to SADAD
//         return NextResponse.json({
//             success: true,
//             message: "Callback processed successfully",
//         });
//     } catch (error) {
//         console.error("SADAD CALLBACK ERROR:", error);
//         return NextResponse.json(
//             { success: false, message: "Server error" },
//             { status: 500 }
//         );
//     }
// }
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import crypto from "crypto";

/**
 * AES decrypt (same as PHP decrypt_e)
 */
function decrypt_e(encrypted: string, key: string) {
  const iv = "@@@@&&&&####$$$$";
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Verify SADAD checksum (same as verifychecksum_eFromStr)
 */
function verifySadadChecksum(
  payload: Record<string, any>,
  merchantId: string,
  secretKey: string,
  checksumhash: string
): boolean {
  // SADAD requires JSON string
  const data_response = {
    postData: payload,
    secretKey: encodeURIComponent(secretKey),
  };

  const key = encodeURIComponent(secretKey) + merchantId;

  const sadad_hash = decrypt_e(checksumhash, key);

  const salt = sadad_hash.slice(-4);
  const finalString = JSON.stringify(data_response) + "|" + salt;

  const website_hash =
    crypto.createHash("sha256").update(finalString).digest("hex") + salt;

  return website_hash === sadad_hash;
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      ORDERID,
      RESPCODE,
      RESPMSG,
      TXNAMOUNT,
      transaction_number,
      checksumhash,
    } = body;

    if (!ORDERID || !checksumhash) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Remove checksum before verification (IMPORTANT)
    const payload = { ...body };
    delete payload.checksumhash;

    const isValid = verifySadadChecksum(
      payload,
      process.env.SADAD_MERCHANT_ID!,
      process.env.SADAD_SECRET_KEY!,
      checksumhash
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Checksum verification failed" },
        { status: 401 }
      );
    }

    const order = await Order.findById(ORDERID);
    if (!order) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    // Amount validation
    if (Number(TXNAMOUNT) !== Number(order.totalAmount)) {
      return NextResponse.json(
        { success: false, message: "Amount mismatch" },
        { status: 400 }
      );
    }

    // SADAD response codes
    if (RESPCODE === "1") {
      order.paymentStatus = "PAID";
    } else if (RESPCODE === "400" || RESPCODE === "402") {
      order.paymentStatus = "PENDING";
    } else {
      order.paymentStatus = "FAILED";
    }

    order.paymentMethod = "SADAD";
    order.paymentDetails = body;
    order.transactionId = transaction_number;

    await order.save();

    // SADAD expects HTTP 200
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SADAD CALLBACK ERROR", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

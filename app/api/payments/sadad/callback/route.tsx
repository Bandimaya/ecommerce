import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import crypto from "crypto";

/**
 * PHP equivalent of:
 * openssl_decrypt($crypt, "AES-128-CBC", $ky, 0, $iv)
 */
export function decrypt_e(encrypted: string, ky: string): string {
  // PHP: html_entity_decode($ky)
  const decodedKey = ky;

  // IV must be EXACT
  const iv = Buffer.from("@@@@&&&&####$$$$", "utf8"); // 16 bytes

  // PHP pads key with NULL bytes
  const key = Buffer.alloc(16);
  Buffer.from(decodedKey, "utf8").copy(key);

  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    key,
    iv
  );

  // 🔥 IMPORTANT: BASE64, NOT HEX
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}


/**
 * PHP equivalent of:
 * verifychecksum_eFromStr($str, $key, $checksumvalue)
 */
function verifySadadChecksumV2(
  payload: Record<string, any>,
  secretKey: string
): boolean {
  // Remove checksumhash
  const data = { ...payload };
  const receivedHash = data.checksumhash;
  delete data.checksumhash;

  // Sort keys alphabetically (important)
  const sortedKeys = Object.keys(data).sort();

  const dataString = sortedKeys
    .map((key) => `${key}=${data[key]}`)
    .join("|");

  const calculatedHash = crypto
    .createHash("sha256")
    .update(dataString + secretKey)
    .digest("hex");

  return calculatedHash === receivedHash;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const body: Record<string, any> = {};
    formData.forEach((v, k) => (body[k] = v.toString()));

    console.log("🔥 SADAD CALLBACK BODY:", body);

    const { checksumhash } = body;
    if (!checksumhash) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const isValid = verifySadadChecksumV2(
      body,
      process.env.SADAD_SECRET_KEY!
    );

    console.log("🔐 Checksum valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Checksum verification failed" },
        { status: 401 }
      );
    }

    const order = await Order.findById(body.ORDERID);
    if (!order) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    if (body.RESPCODE === "1") {
      order.paymentStatus = "PAID";
    } else if (body.RESPCODE === "400" || body.RESPCODE === "402") {
      order.paymentStatus = "PENDING";
    } else {
      order.paymentStatus = "FAILED";
    }

    order.paymentMethod = "SADAD";
    order.paymentDetails = body;
    order.transactionId = body.transaction_number;

    await order.save();

    console.log("✅ SADAD PAYMENT VERIFIED & SAVED");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ SADAD CALLBACK ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

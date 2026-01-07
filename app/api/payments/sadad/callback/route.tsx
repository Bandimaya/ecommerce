import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

/* =========================================================
   🔐 SADAD CRYPTO HELPERS (PHP-COMPATIBLE)
   ========================================================= */

/**
 * PHP openssl_encrypt behavior:
 * - Uses AES-128-CBC
 * - Key is NULL-padded (NOT truncated)
 * - IV is fixed
 */
function getSadadKey(secretKey: string, merchantId: string): Buffer {
  const rawKey = encodeURIComponent(secretKey) + merchantId;

  // PHP pads with NULL bytes to 16 bytes
  const key = Buffer.alloc(16);
  Buffer.from(rawKey, "utf8").copy(key);

  return key;
}

/**
 * Decrypt checksumhash (HEX, NOT base64)
 */
function decrypt_e(
  encryptedHex: string,
  secretKey: string,
  merchantId: string
): string {
  const iv = Buffer.from("@@@@&&&&####$$$$", "utf8"); // 16 bytes
  const key = getSadadKey(secretKey, merchantId);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Verify SADAD checksum (exact PHP port)
 */
function verifySadadChecksum(
  payload: Record<string, any>,
  merchantId: string,
  secretKey: string,
  checksumhash: string
): boolean {
  /**
   * PHP logic:
   * $data['postData'] = $_POST;
   * $data['secretKey'] = urlencode($secretKey);
   */
  const data_response = {
    postData: payload,
    secretKey: encodeURIComponent(secretKey),
  };

  // Decrypt checksum
  const sadad_hash = decrypt_e(
    checksumhash,
    secretKey,
    merchantId
  );

  // Last 4 chars = salt
  const salt = sadad_hash.slice(-4);

  const finalString = JSON.stringify(data_response) + "|" + salt;

  const website_hash =
    crypto.createHash("sha256").update(finalString).digest("hex") + salt;

  return website_hash === sadad_hash;
}

/* =========================================================
   📥 SADAD CALLBACK API
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /**
     * SADAD sends:
     * Content-Type: application/x-www-form-urlencoded
     */
    const formData = await req.formData();

    // Convert FormData → plain object
    const body: Record<string, any> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    console.log("🔥 SADAD CALLBACK BODY:", body);

    const {
      ORDERID,
      RESPCODE,
      RESPMSG,
      TXNAMOUNT,
      transaction_number,
      checksumhash,
    } = body;

    if (!ORDERID || !checksumhash) {
      console.error("❌ Missing ORDERID or checksumhash");
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Remove checksumhash before verification
    const payload = { ...body };
    delete payload.checksumhash;

    const isValid = verifySadadChecksum(
      payload,
      "6205111",
      process.env.NEXT_PUBLIC_SADAD_SECRET_KEY!,
      checksumhash
    );

    console.log("🔐 Checksum valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Checksum verification failed" },
        { status: 401 }
      );
    }

    // Fetch order
    const order = await Order.findById(ORDERID);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
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

    console.log("✅ SADAD CALLBACK PROCESSED");

    /**
     * IMPORTANT:
     * SADAD REQUIRES HTTP 200 ALWAYS
     */
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ SADAD CALLBACK ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

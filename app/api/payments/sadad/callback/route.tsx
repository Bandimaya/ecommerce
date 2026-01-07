import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import crypto from "crypto";

/**
 * PHP equivalent of:
 * openssl_decrypt($crypt, "AES-128-CBC", $ky, 0, $iv)
 */
function decrypt_e(encryptedHex: string, key: string): string {
  const iv = Buffer.from("@@@@&&&&####$$$$", "utf8"); // 16 bytes

  /**
   * PHP pads / trims key internally.
   * We must replicate it exactly.
   */
  const keyBuf = Buffer.alloc(16);
  Buffer.from(key, "utf8").copy(keyBuf);

  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    keyBuf,
    iv
  );

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * PHP equivalent of:
 * verifychecksum_eFromStr($str, $key, $checksumvalue)
 */
function verifychecksum_eFromStr(
  str: string,
  key: string,
  checksumvalue: string
): boolean {
  const sadad_hash = decrypt_e(checksumvalue, key);

  // Last 4 characters are salt
  const salt = sadad_hash.slice(-4);

  const finalString = str + "|" + salt;

  let website_hash =
    crypto.createHash("sha256").update(finalString).digest("hex");

  website_hash += salt;

  return website_hash === sadad_hash;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    /**
     * SADAD sends application/x-www-form-urlencoded
     */
    const formData = await req.formData();

    // Convert FormData → plain object
    const postData: Record<string, any> = {};
    formData.forEach((value, key) => {
      postData[key] = value.toString();
    });

    console.log("🔥 SADAD CALLBACK BODY:", postData);

    const checksum_response = postData.checksumhash;
    delete postData.checksumhash;

    const merchantId = "6205111";
    const secretKey = process.env.NEXT_PUBLIC_SADAD_SECRET_KEY!;

    const sadad_secrete_key = encodeURIComponent(secretKey);

    const data_response = {
      postData,
      secretKey: sadad_secrete_key,
    };

    const key = sadad_secrete_key + merchantId;

    const isValid = verifychecksum_eFromStr(
      JSON.stringify(data_response),
      key,
      checksum_response
    );

    console.log("🔐 Checksum valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Checksum verification failed" },
        { status: 401 }
      );
    }

    // ✅ VERIFIED — you can safely update order
    const order = await Order.findById(postData.ORDERID);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (postData.RESPCODE === "1") {
      order.paymentStatus = "PAID";
    } else if (postData.RESPCODE === "400" || postData.RESPCODE === "402") {
      order.paymentStatus = "PENDING";
    } else {
      order.paymentStatus = "FAILED";
    }

    order.paymentMethod = "SADAD";
    order.paymentDetails = postData;
    order.transactionId = postData.transaction_number;

    await order.save();

    console.log("✅ SADAD PAYMENT VERIFIED & SAVED");

    /**
     * SADAD requires HTTP 200 always
     */
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ SADAD CALLBACK ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

import crypto from "crypto";

export function generateSadadSignature(
  payload: Record<string, any>,
  secretKey: string
) {
  // ❌ productdetail must NOT be included
  const filtered = Object.keys(payload)
    .filter((k) => k !== "productdetail" && payload[k] !== undefined)
    .sort();

  let signatureString = secretKey;

  for (const key of filtered) {
    signatureString += payload[key];
  }

  return crypto
    .createHash("sha256")
    .update(signatureString)
    .digest("hex");
}

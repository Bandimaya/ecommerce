// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function verifyToken(req: Request | NextRequest) {
  // Get the Authorization header
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("No token provided");

  try {
    // Verify JWT and return payload
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload; // Usually contains { id: user._id }
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// lib/withAuth.ts
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export type UserPayload = {
  id: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

export function withAuth(
  handler: (req: NextRequest, user: UserPayload) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) throw new Error("Unauthorized");

      const token = authHeader.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

      return handler(req, payload);
    } catch (err: any) {
      return NextResponse.json({ message: err.message || "Unauthorized" }, { status: 500 });
    }
  };
}

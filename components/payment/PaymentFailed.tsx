import React from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg bg-white p-8 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold">Payment Failed</h1>
        </div>
        <p className="text-gray-600 mb-6">We were unable to process your payment. Please try again or contact support.</p>
        <div className="flex gap-3">
          <Link href="/cart" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded">Return to Cart</Link>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 border rounded">Go to Home</Link>
        </div>
      </div>
    </div>
  );
}
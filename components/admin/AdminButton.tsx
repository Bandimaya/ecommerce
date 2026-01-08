"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "ghost" | "danger";
};

export default function AdminButton({
  loading = false,
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const isDisabled = !!(disabled || loading);

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${base} ${variants[variant] || variants.primary} ${className} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}

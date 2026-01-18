"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/axios";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        data: { email },
      });

      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/80 bg-white rounded-2xl border border-border/50 shadow-xl overflow-hidden relative"
      >
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div className="px-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder=" "
                  className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-background/50 border-2 rounded-xl outline-none transition-all duration-200
                    ${error
                      ? "border-destructive focus:border-destructive bg-destructive/5"
                      : "border-border/50 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] hover:border-border"
                    }`}
                />
                <label
                  className={`absolute left-10 top-3.5 text-muted-foreground text-sm transition-all duration-200 origin-[0]
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-2.5
                    peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                    ${error ? "text-destructive" : ""}`}
                >
                  Email Address
                </label>
              </div>
              {error && (
                <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Skeleton className="mr-2 h-4 w-4 rounded-full bg-white/50" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
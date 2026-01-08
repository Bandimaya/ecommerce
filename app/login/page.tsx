"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const { login, loading } = useUser();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error on type
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (generalError) setGeneralError(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      // Trigger success animation
      setSuccess(true);
      // Delay navigation to allow animation to play
      setTimeout(() => {
        router.push("/shop");
      }, 300);
    } catch (err: any) {
      setGeneralError(err.message || "Invalid credentials. Please try again.");
    }
  };

  // --- Animations ---
  const cardVariants: Variants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 24 }
    },
    exitSuccess: {
      opacity: 0,
      scale: 1.05,
      y: -20,
      filter: "blur(10px)",
      transition: { duration: 0.4, ease: "backIn" }
    },
  };

  const shakeVariants = {
    idle: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/30 p-4">
      <AnimatePresence mode="wait">
        {!success && (
          <motion.div
            key="login-card"
            variants={cardVariants}
            initial="initial"
            animate="enter"
            exit="exitSuccess"
            className="w-full max-w-md bg-card/80 bg-white rounded-2xl border border-border/50 shadow-xl overflow-hidden shadow-black/5"
          >
            {/* Header with subtle gradient */}
            <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-b from-card to-card/80 border-b border-border/30">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access your account
              </p>
            </div>

            {/* Global Error Message */}
            <AnimatePresence>
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="px-8 overflow-hidden"
                >
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{generalError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Section */}
            <motion.form
              onSubmit={handleSubmit}
              className="px-8 pb-8 space-y-5 bg-card/60"
              variants={shakeVariants}
              animate={generalError || Object.keys(errors).length > 0 ? "shake" : "idle"}
            >
              {/* Email Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-background/50 border-2 rounded-xl outline-none transition-all duration-200
                    ${errors.email
                        ? "border-destructive focus:border-destructive bg-destructive/5"
                        : "border-border/50 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] hover:border-border"
                      }`}
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-10 top-3.5 text-muted-foreground text-sm transition-all duration-200 origin-[0]
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-2.5
                    peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                    ${errors.email ? "text-destructive" : ""}`}
                  >
                    Email Address
                  </label>
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className={`peer w-full pl-10 pr-10 pt-5 pb-2 bg-background/50 border-2 rounded-xl outline-none transition-all duration-200
                    ${errors.password
                        ? "border-destructive focus:border-destructive bg-destructive/5"
                        : "border-border/50 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] hover:border-border"
                      }`}
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-10 top-3.5 text-muted-foreground text-sm transition-all duration-200 origin-[0]
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-2.5
                    peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                    ${errors.password ? "text-destructive" : ""}`}
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive ml-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <div className="bg-muted/20 p-4 text-center border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
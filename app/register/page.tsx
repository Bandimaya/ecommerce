"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Phone,
  ArrowLeft // Imported ArrowLeft
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Register = () => {
  // @ts-ignore
  const { register, loading } = useUser();
  const navigate = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // UI State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For mobile, restrict to numbers only
    if (name === "mobile" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "password" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!phoneRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    try {
      await register(formData.email, formData.password, formData.mobile);
      navigate.push("/shop");
    } catch (err: any) {
      setGeneralError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      {/* Added 'relative' class here to position the back button */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden relative">

        {/* Back Button */}
        <button
          onClick={() => navigate.back()}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Get Started
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Create your account to start shopping
          </p>
        </div>

        {/* Global Error Message */}
        {generalError && (
          <div className="mx-8 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {/* Name Input */}
          <div className="space-y-1">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-white border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                  }`}
              />
              <label
                htmlFor="name"
                className={`absolute left-10 top-3.5 text-gray-500 text-sm transition-all duration-200 origin-[0]
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-2.5
                  peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                  ${errors.name ? "text-red-500" : ""}`}
              >
                Full Name
              </label>
            </div>
            {errors.name && (
              <p className="text-xs text-red-600 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-white border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                  }`}
              />
              <label
                htmlFor="email"
                className={`absolute left-10 top-3.5 text-gray-500 text-sm transition-all duration-200 origin-[0]
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-2.5
                  peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                  ${errors.email ? "text-red-500" : ""}`}
              >
                Email Address
              </label>
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Mobile Input */}
          <div className="space-y-1">
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                id="mobile"
                name="mobile"
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-white border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.mobile
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                  }`}
              />
              <label
                htmlFor="mobile"
                className={`absolute left-10 top-3.5 text-gray-500 text-sm transition-all duration-200 origin-[0]
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-2.5
                  peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                  ${errors.mobile ? "text-red-500" : ""}`}
              >
                Mobile Number
              </label>
            </div>
            {errors.mobile && (
              <p className="text-xs text-red-600 ml-1">{errors.mobile}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-10 pt-5 pb-2 bg-white border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                  }`}
              />
              <label
                htmlFor="password"
                className={`absolute left-10 top-3.5 text-gray-500 text-sm transition-all duration-200 origin-[0]
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-2.5
                  peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                  ${errors.password ? "text-red-500" : ""}`}
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 ml-1">{errors.password}</p>
            )}
            {!errors.password && formData.password && (
              <div className="text-xs text-gray-500 ml-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-10 pt-5 pb-2 bg-white border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                  }`}
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute left-10 top-3.5 text-gray-500 text-sm transition-all duration-200 origin-[0]
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-2.5
                  peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                  ${errors.confirmPassword ? "text-red-500" : ""}`}
              >
                Confirm Password
              </label>

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 ml-1">{errors.confirmPassword}</p>
            )}
            {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="text-xs text-green-600 ml-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Passwords match
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            disabled={loading}
          >
            {loading ? (
              <>
                <Skeleton className="mr-2 h-4 w-4 rounded-full bg-slate-900/10" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Terms and Conditions */}
          <div className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary font-medium hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary font-medium hover:underline">
              Privacy Policy
            </Link>
          </div>
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
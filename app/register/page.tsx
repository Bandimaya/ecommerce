"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, User, Mail, Lock, AlertCircle } from "lucide-react";

const Register = () => {
  const { register, loading } = useUser();
  const navigate = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // UI State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    try {
      await register(formData.name, formData.email, formData.password);
      navigate.push("/shop");
    } catch (err: any) {
      setGeneralError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Get Started
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Create your account to start shopping
          </p>
        </div>

        {/* Global Error Message */}
        {generalError && (
          <div className="mx-8 mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {/* Name Input */}
          <div className="space-y-1">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-background border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.name 
                    ? "border-destructive focus:border-destructive" 
                    : "border-border/50 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                  }`}
              />
              <label
                htmlFor="name"
                className={`absolute left-10 top-3.5 text-muted-foreground text-sm transition-all duration-200 origin-[0]
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-2.5
                  peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5
                  ${errors.name ? "text-destructive" : ""}`}
              >
                Full Name
              </label>
            </div>
            {errors.name && (
              <p className="text-xs text-destructive ml-1">{errors.name}</p>
            )}
          </div>

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
                className={`peer w-full pl-10 pr-3 pt-5 pb-2 bg-background border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.email 
                    ? "border-destructive focus:border-destructive" 
                    : "border-border/50 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
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
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className={`peer w-full pl-10 pr-10 pt-5 pb-2 bg-background border-2 rounded-xl outline-none transition-all duration-200
                  ${errors.password 
                    ? "border-destructive focus:border-destructive" 
                    : "border-border/50 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive ml-1">{errors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="bg-muted/30 p-4 text-center border-t border-border/50">
          <p className="text-sm text-muted-foreground">
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
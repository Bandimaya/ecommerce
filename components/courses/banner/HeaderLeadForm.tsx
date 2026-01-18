'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  X,
  Calendar,
  Building2
} from 'lucide-react';
import { apiFetch } from '@/lib/axios';
import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderLeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    parent: "",
    child: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.parent.trim()) newErrors.parent = "Name is required"; // Changed label slightly
    if (!formData.child.trim()) newErrors.child = "Student name is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Enter a valid 10-digit number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await apiFetch(`/contacts/submit`, {
        method: "POST", data: {
          name: formData.parent,
          message: `Inquiry for student: ${formData.child}`,
          phone: formData.phone,
          email: formData.email,
          subject: "Course Inquiry"
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll on mobile modal
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileOpen]);

  // Subtle shake for errors
  const shakeVariants = {
    idle: { x: 0 },
    shake: {
      x: [0, -4, 4, -4, 4, 0],
      transition: { duration: 0.4 },
    },
  };

  // Helper to render form content (shared between desktop/mobile to avoid duplication)
  const renderFormContent = (isMobileMode: boolean) => (
    <>
      {/* Mobile Close Header */}
      {isMobileMode && (
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Book a Session</h3>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!success ? (
          <div className="flex flex-col">

            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                Get in Touch
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Fill out the form below and our academic counselors will contact you within 24 hours.
              </p>
            </div>

            {/* Form Fields */}
            <motion.form
              onSubmit={handleSubmit}
              className="px-8 pb-8 space-y-5"
              variants={shakeVariants}
              animate={Object.keys(errors).length > 0 ? "shake" : "idle"}
            >
              <InputField
                id={`parent-${isMobileMode ? 'm' : 'd'}`}
                name="parent"
                label="Parent Name"
                icon={User}
                value={formData.parent}
                onChange={handleChange}
                error={errors.parent}
              />

              <InputField
                id={`child-${isMobileMode ? 'm' : 'd'}`}
                name="child"
                label="Student Name"
                icon={User}
                value={formData.child}
                onChange={handleChange}
                error={errors.child}
              />

              <InputField
                id={`phone-${isMobileMode ? 'm' : 'd'}`}
                name="phone"
                label="Phone Number"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                type="tel"
              />

              <InputField
                id={`email-${isMobileMode ? 'm' : 'd'}`}
                name="email"
                label="Email Address"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                type="email"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 h-12 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Request Callback</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                We respect your privacy. No spam.
              </p>
            </motion.form>
          </div>
        ) : (
          /* Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center h-[480px]"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">Thank You</h2>
            <p className="text-slate-500 text-sm mb-8 max-w-[250px]">
              Your request has been received. Our team will reach out to <strong>{formData.phone}</strong> shortly.
            </p>

            <button
              onClick={() => {
                setSuccess(false);
                setFormData({ parent: "", child: "", phone: "", email: "" });
                setIsMobileOpen(false);
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Close Form
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {/* --- Mobile Trigger Button (Visible only on Mobile) --- */}
      <div className="lg:hidden w-full px-4 mb-8">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-semibold py-3.5 rounded-lg shadow-md hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule Consultation</span>
        </button>
      </div>

      {/* --- Desktop Static Card (Inline) --- */}
      <div className="hidden lg:block relative z-[100]">
        <div className="w-full bg-white overflow-hidden lg:max-w-[420px] lg:rounded-xl lg:border lg:border-slate-200 lg:shadow-lg">
          {renderFormContent(false)}
        </div>
      </div>

      {/* --- Mobile Modal (Portal) --- */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            >
              {/* Backdrop Click */}
              <div className="absolute inset-0" onClick={() => setIsMobileOpen(false)} />

              {/* Card */}
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-10 w-full bg-white overflow-hidden rounded-2xl shadow-2xl max-w-[400px]"
                onClick={(e) => e.stopPropagation()}
              >
                {renderFormContent(true)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// --- Professional Input Component ---
const InputField = ({
  id, name, label, icon: Icon, value, onChange, error, type = "text"
}: any) => (
  <div className="relative group">
    {/* Input */}
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      className={`
        peer block w-full px-4 pb-2.5 pt-6 text-sm text-slate-900 bg-slate-50 
        rounded-lg border border-slate-200 
        focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
        focus:bg-white transition-all duration-200
        ${error ? "bg-red-50 border-red-300 focus:border-red-500 focus:ring-red-200" : ""}
      `}
    />

    {/* Floating Label */}
    <label
      htmlFor={id}
      className={`
        absolute text-sm text-slate-500 duration-200 transform 
        -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-slate-400
        peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-600
        ${error ? "text-red-500 peer-focus:text-red-600" : ""}
      `}
    >
      {label}
    </label>

    {/* Icon (Optional - Positioned to the right or integrated subtly) */}
    <div className="absolute right-3 top-4 text-slate-400 pointer-events-none peer-focus:text-indigo-500 transition-colors">
      <Icon size={18} />
    </div>

    {/* Error Message */}
    {error && (
      <p className="text-[11px] font-medium text-red-600 mt-1 ml-1 flex items-center gap-1 animate-in slide-in-from-top-1 fade-in">
        {error}
      </p>
    )}
  </div>
);
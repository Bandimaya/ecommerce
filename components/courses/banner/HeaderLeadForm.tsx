'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Smile, 
  Phone, 
  Mail, 
  Loader2, 
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function HeaderLeadForm() {
  // --- State (Functionality unchanged) ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    parent: "",
    child: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Handlers (Functionality unchanged) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; 

    if (!formData.parent.trim()) newErrors.parent = "Parent name is required";
    if (!formData.child.trim()) newErrors.child = "Child name is required";
    
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const shakeVariants = {
    idle: { x: 0 },
    shake: {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.35 },
    },
  };

  return (
    <div className="w-full max-w-[440px] perspective-1000">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="lead-form"
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-white/40"
          >
            {/* Top Indicator */}
            <div className="bg-orange-500 py-1.5 px-4 flex justify-center items-center gap-2">
               <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Only 4 Slots Left Today</span>
            </div>

            {/* Header Section */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="inline-flex items-center justify-center p-2.5 bg-orange-50 rounded-2xl mb-4">
                 <Sparkles className="w-6 h-6 text-orange-500 fill-orange-200" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 leading-tight mb-2">
                Unlock Their Future
              </h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Book a <span className="text-orange-600 underline underline-offset-4 decoration-orange-200 decoration-2">Free Expert Counseling</span> session.
              </p>
            </div>

            {/* Form Section */}
            <motion.form
              onSubmit={handleSubmit}
              className="px-8 pb-8 space-y-4"
              variants={shakeVariants}
              animate={Object.keys(errors).length > 0 ? "shake" : "idle"}
            >
              <InputField 
                id="parent"
                name="parent"
                label="Parent's Name"
                icon={User}
                value={formData.parent}
                onChange={handleChange}
                error={errors.parent}
              />

              <InputField 
                id="child"
                name="child"
                label="Child's Name"
                icon={Smile}
                value={formData.child}
                onChange={handleChange}
                error={errors.child}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField 
                  id="phone"
                  name="phone"
                  label="Phone No."
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  type="tel"
                />
                
                <InputField 
                  id="email"
                  name="email"
                  label="Email ID"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  type="email"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-14 flex items-center justify-center text-lg font-black text-white rounded-2xl overflow-hidden
                  bg-gradient-to-br from-orange-400 to-orange-600 hover:scale-[1.02] active:scale-95
                  shadow-[0_10px_25px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-70"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin stroke-[3]" />
                      <span>Securing Spot...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Get Started Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Secure & Confidential</span>
                </div>
              </div>
            </motion.form>
          </motion.div>
        ) : (
          /* Success State - Professional Glass */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-10 text-center border border-white/50"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-3">Booking Confirmed!</h2>
            <p className="text-gray-500 leading-relaxed text-sm mb-8 px-4">
              Great choice, <strong className="text-gray-900">{formData.parent}</strong>! We've reserved a session for <strong className="text-gray-900">{formData.child}</strong>. Expect a call from our experts within 24 hours.
            </p>
            
            <button 
              onClick={() => {
                setSuccess(false);
                setFormData({ parent: "", child: "", phone: "", email: "" });
              }}
              className="py-3 px-6 rounded-xl text-xs font-black text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all uppercase tracking-widest border border-transparent hover:border-orange-100"
            >
              Submit another request
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const InputField = ({ 
  id, name, label, icon: Icon, value, onChange, error, type = "text" 
}: any) => (
  <div className="relative">
    <div className="relative group">
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 pointer-events-none
        ${error ? 'text-red-500' : 'text-gray-400 group-focus-within:text-orange-500 group-focus-within:scale-110'}`} 
      />
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full pl-12 pr-4 h-[60px] rounded-2xl outline-none text-gray-900 font-bold transition-all duration-300
          placeholder-transparent border-2 shadow-sm
          ${error
            ? "border-red-100 bg-red-50/50 focus:border-red-500"
            : "bg-white/40 border-gray-100 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-gray-200"
          }`}
      />
      
      <label
        htmlFor={id}
        className={`absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold transition-all duration-300 origin-[0] pointer-events-none
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-[-50%]
          peer-focus:scale-75 peer-focus:-translate-y-[170%] peer-focus:text-orange-600
          peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-[170%]
          ${error ? "text-red-400" : ""}
        `}
      >
        {label}
      </label>

      {error && (
        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 animate-in fade-in zoom-in duration-300" />
      )}
    </div>
    {error && (
      <p className="text-[10px] text-red-600 mt-1 ml-4 font-black uppercase tracking-wider flex items-center gap-1">
        {error}
      </p>
    )}
  </div>
);
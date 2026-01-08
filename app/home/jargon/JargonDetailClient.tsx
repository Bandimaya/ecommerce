"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  ArrowLeft, 
  Cpu, 
  Zap, 
  Code, 
  Wifi, 
  Cog, 
  Brain, 
  Sparkles,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/axios";
import { IMAGE_URL } from "@/lib/constants";
import ProfessionalLoader from "@/app/loader/Loader";

// --- Types ---
interface JargonItem {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  alt?: string;
  icon?: string; // Expecting string names like "Cpu", "Zap"
  color?: string; // Expecting Tailwind classes like "bg-blue-500"
  accentColor?: string; // Hex code
}

// --- Icon Mapping ---
// Ensure this matches the names stored in your DB
const ICON_MAP: Record<string, any> = { 
  Cpu, 
  Zap, 
  Code, 
  Wifi, 
  Cog, 
  Brain 
};

export default function JargonDetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<JargonItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await apiFetch(`/jargon/${id}`);
        if (isMounted) {
          setItem(res);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          const msg = err?.message || "Failed to fetch";
          setError(msg);
          setItem(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Clean up to prevent state updates if user leaves quickly
    return () => { isMounted = false; };
  }, [id]);

  // Helper to get the actual Icon component
  const IconComponent = item?.icon ? ICON_MAP[item.icon] : null;

  if (loading) return <ProfessionalLoader />;

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{error || "We couldn't find that topic."}</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 py-8 px-4 md:py-16 flex items-center justify-center"
    >
      <div className="relative w-full max-w-8xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]">
        
        {/* --- Close Button (Floating) --- */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm transition-all border border-slate-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* --- Left Column: Image --- */}
        <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden group">
          <div className="absolute inset-0 bg-slate-900/10 z-10" />
          <img
            src={(IMAGE_URL || "") + (item.image || "")}
            alt={item.alt || item.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Mobile Overlay Title (Optional, visually nice) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent md:hidden z-20">
            <h1 className="text-2xl font-bold text-white">{item.title}</h1>
          </div>
        </div>

        {/* --- Right Column: Content --- */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col relative bg-white">
          
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
               {/* Icon Box */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${item.color || "bg-blue-600"}`}>
                {IconComponent ? <IconComponent size={28} strokeWidth={2} /> : <Sparkles size={28} />}
              </div>
              
              {/* Badges */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                     Definition
                   </span>
                   <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                     <Sparkles size={12} /> Beginner Friendly
                   </span>
                </div>
              </div>
            </div>

            <h1 className="hidden md:block text-4xl font-extrabold text-slate-900 leading-tight mb-2">
              {item.title}
            </h1>
          </div>

          {/* Body Text */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-lg text-slate-600 leading-8 whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={18} /> Back to List
            </button>

            {/* Optional decorative color indicator */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
               <span>Topic Color:</span>
               <div 
                 className="w-6 h-6 rounded-full border-2 border-slate-100 shadow-sm" 
                 style={{ backgroundColor: item.accentColor || item.color?.replace('bg-', '') || '#3b82f6' }} 
               />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
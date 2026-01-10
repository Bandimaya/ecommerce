"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/certifications')
      .then(data => setCertifications(data))
      .catch(() => console.log("Failed to fetch certifications"));
  }, []);

  // Duplicate the array to create a seamless loop effect
  const scrollItems = [...certifications, ...certifications];

  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="h-[2px] w-12 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Verified quality</span>
          <div className="h-[2px] w-12 bg-primary" />
        </div>
        <h2 className="text-center text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Global Recognition & Accreditations
        </h2>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative flex overflow-x-hidden py-4">
        <motion.div 
          className="flex whitespace-nowrap gap-8"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 25, // Adjust speed here (higher = slower)
            repeat: Infinity,
          }}
        >
          {scrollItems.map((item: any, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-[10px] overflow-hidden group transition-colors hover:border-blue-200"
              style={{ width: '180px', height: '80px' }}
            >
              <img
                loading="lazy"
                src={IMAGE_URL + item.image}
                alt={item.alt || "Certification"}
                className="max-h-[60%] w-auto object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>

        {/* Gradient Overlays for Fade Effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20" />
      </div>

      <p className="text-center mt-10 text-slate-400 text-xs font-medium">
        Our certifications are recognized by leading STEM organizations worldwide.
      </p>
    </section>
  );
};

export default CertificationsSection;
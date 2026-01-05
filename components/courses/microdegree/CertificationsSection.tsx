"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Globe } from 'lucide-react';
import { apiFetch } from '@/lib/axios';
import { IMAGE_URL } from '@/lib/constants';

const ICONS_MAP: { [key: string]: React.ReactNode } = {
  award: <Award className="w-4 h-4" />,
  shield: <ShieldCheck className="w-4 h-4" />,
  globe: <Globe className="w-4 h-4" />,
};

const CertificationsSection = () => {
  const [certifications, setCertifications] = React.useState<any>([]);

  useEffect(() => {
    apiFetch('/certifications').then(data => {
      setCertifications(data);
    }
    ).catch(() => {
      console.log(" Failed to fetch certifications")
    })
  }, [])
  // const certifications = [
  //   {
  //     label: "Curriculum Designed By",
  //     img: "https://images.avishkaar.cc/misc/shop/microdegree/certifications-1.png",
  //     alt: "Curriculum Design Partner Logo",
  //     icon: <Award className="w-4 h-4" />
  //   },
  //   {
  //     label: "Accredited By",
  //     img: "https://images.avishkaar.cc/misc/shop/microdegree/certifications-2.png",
  //     alt: "Accreditation Partner Logo",
  //     icon: <ShieldCheck className="w-4 h-4" />
  //   },
  //   {
  //     label: "Trusted By",
  //     img: "https://images.avishkaar.cc/misc/shop/microdegree/certifications-3.png",
  //     alt: "Trusted Partner Logo",
  //     icon: <Globe className="w-4 h-4" />
  //   }
  // ];

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Verified quality</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
            Global Recognition & Accreditations
          </h2>
        </motion.div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((item: any, index: any) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="
                group relative flex flex-col items-center
                bg-slate-50/50 p-10 rounded-[2rem]
                border border-slate-100/80
                transition-all duration-500
                hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-blue-100
              "
            >
              {/* Category Indicator */}
              <div className="flex items-center gap-2 mb-8 text-slate-400 group-hover:text-blue-500 transition-colors duration-300">
                {ICONS_MAP?.[item.icon]}
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                  {item.label}
                </span>
              </div>

              {/* Logo Container */}
              <div className="w-full flex items-center justify-center min-h-[80px]">
                <img
                  loading="lazy"
                  src={IMAGE_URL+item.image}
                  alt={item.alt}
                  className="
                    max-h-14 md:max-h-16 w-auto object-contain 
                    filter grayscale brightness-125 contrast-75 opacity-60
                    transition-all duration-700 ease-in-out
                    group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:opacity-100 group-hover:scale-110
                  "
                />
              </div>

              {/* Subtle hover accent */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-slate-400 text-xs font-medium"
        >
          Our certifications are recognized by leading STEM organizations worldwide.
        </motion.p>
      </div>
    </section>
  );
};

export default CertificationsSection;
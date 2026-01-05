"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/axios';

const BenefitsSection = () => {
  const benefits = [
    {
      img: "https://images.avishkaar.cc/misc/shop/microdegree/power-1.svg",
      text: (
        <>
          Early age exposure to tech helps kids become <span className="text-blue-600 font-extrabold">future-ready</span>.
        </>
      ),
      alt: "Future Ready Kids Icon"
    },
    {
      img: "https://images.avishkaar.cc/misc/shop/microdegree/power-2.svg",
      text: (
        <>
          Fosters innovative ideas and encourages <span className="text-blue-600 font-extrabold">creative problem-solving</span>.
        </>
      ),
      alt: "Creative Problem Solving Icon"
    },
    {
      img: "https://images.avishkaar.cc/misc/shop/microdegree/power-3.svg",
      text: (
        <>
          Help build <span className="text-blue-600 font-extrabold">logical</span> and <span className="text-blue-600 font-extrabold">critical thinking abilities</span>.
        </>
      ),
      alt: "Critical Thinking Icon"
    },
    {
      img: "https://images.avishkaar.cc/misc/shop/microdegree/power-4.svg",
      text: (
        <>
          Boosts kid's <span className="text-blue-600 font-extrabold">self-esteem</span> and encourages <span className="text-blue-600 font-extrabold">independent learning</span>.
        </>
      ),
      alt: "Self Esteem Icon"
    }
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch(('/benefits')).then((res) => { setData(res) })
      .catch((err) => { console.error(err); });
  }, [])

  return (
    <section className="relative w-full py-24 bg-[#fcfcfd] overflow-hidden">
      {/* Technical Grid Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        {/* --- Header Section --- */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Cognitive Growth</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            The Power Of <span className="text-blue-600">Robotics & Coding</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Equipping young minds with more than just tech skills—we build the foundations of 21st-century intelligence.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {data.map((item: any, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="
                group relative flex flex-col items-center text-center p-10
                bg-white rounded-[2.5rem]
                border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]
                transition-all duration-300
                hover:shadow-[0_20px_60px_rgba(37,99,235,0.1)] hover:border-blue-100
              "
            >
              {/* Image Container with Dynamic Blob */}
              <div className="mb-8 relative w-28 h-28 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-blue-50/50 rounded-[2rem] opacity-0 group-hover:opacity-100"
                />

                <img
                  loading="lazy"
                  src={item.image}
                  alt={item.alt}
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <p className="text-slate-600 text-[17px] leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>

              {/* Bottom Accent Decor */}
              <div className="absolute bottom-6 w-12 h-1 bg-slate-100 rounded-full group-hover:bg-blue-200 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
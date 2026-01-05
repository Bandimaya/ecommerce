'use client';

import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { AnimatedTestimonials } from "../../AnimatedTestimonials";
import { PARENT_TESTIMONIALS } from '../../../lib/Data'
import { apiFetch } from '@/lib/axios';

// 1. Define the interface to fix the "implicitly has any type" error
interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}



// 2. Explicitly type the variants as 'Variants' to fix the ease string error
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" // TypeScript now recognizes this valid easing string
    }
  },
};

export default function ParentTestimonialsSection() {
  const [parentTestimonials, setParentTestimonials] = React.useState<Testimonial[]>([]);

  useEffect(() => {
    apiFetch('/testimonials').then((data) => setParentTestimonials(data)).catch((err) => console.error(err));
  }, [])
  return (
    <section className="py-24 bg-[#FFF0F5] overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          {/* Header Lines & Tag */}
          <motion.div variants={itemVariants} className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
            <div className="h-[2px] w-12 bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Wall of Love</span>
            <div className="h-[2px] w-12 bg-blue-600" />
          </motion.div>

          {/* Heading: Black and Blue Combination */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-black"
          >
            Hear From Our <span className="text-blue-600">Happy Parents</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg font-medium text-gray-900"
          >
            Join 100,000+ families who are shaping the innovators of tomorrow.
          </motion.p>
        </div>

        {/* Testimonials with Black/Blue text styling */}
        <motion.div
          variants={itemVariants}
          className="[&_p]:text-black [&_h3]:text-blue-600 [&_span]:text-gray-700"
        >
          <AnimatedTestimonials
            testimonials={parentTestimonials}
            autoplay
          />
        </motion.div>

      </motion.div>
    </section>
  );
}
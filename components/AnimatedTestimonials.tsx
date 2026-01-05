'use client';

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { IMAGE_URL } from "@/lib/constants";

// --- Data ---
const TESTIMONIALS = [
    {
        quote: "I didn't know where to start with robotics for my son. I got on a call with Avishkaar and they guided me perfectly. Now Aryan is building his own bots!",
        name: "Rohit Goel",
        designation: "Parent of Aryan (Age 10)",
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        quote: "The Avishkaar Team is just not selling a product, they are creating minds. The curriculum is so well structured that my daughter learns something new every day.",
        name: "Ankur Bansal",
        designation: "Parent of Riya (Age 12)",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        quote: "My son has grown significantly with Avishkaar. He has become more confident in his logic and problem-solving skills. Highly recommended for every parent.",
        name: "Neha Bindal",
        designation: "Parent of Vihaan (Age 9)",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
];

// --- Main Section Component ---
export default function ParentTestimonials() {
    return (
        <section className="py-24 bg-[#fcfcfd] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 bg-orange-50 rounded-full border border-orange-100">
                        <Quote className="w-3 h-3 fill-current" />
                        <span>Wall of Love</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Hear From Our <span className="text-orange-500">Happy Parents</span>
                    </h2>
                </motion.div>

                {/* The Animated Logic Component */}
                <AnimatedTestimonials testimonials={TESTIMONIALS} autoplay={true} />
            </div>
        </section>
    );
}

// --- Sub-component: AnimatedTestimonials Logic ---
export const AnimatedTestimonials = ({
    testimonials,
    autoplay = false,
}: {
    testimonials: typeof TESTIMONIALS;
    autoplay?: boolean;
}) => {
    const [active, setActive] = useState(0);

    const handleNext = useCallback(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index: number) => index === active;

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay, handleNext]);

    const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

    return (
        <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-10">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                    <div className="relative h-80 w-full">
                        <AnimatePresence>
                            {testimonials.map((testimonial: any, index) => (
                                <motion.div
                                    key={testimonial?.src || index}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: randomRotateY(),
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.95,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : randomRotateY(),
                                        zIndex: isActive(index)
                                            ? 999
                                            : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -80, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: randomRotateY(),
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 origin-bottom"
                                >
                                    <img
                                        src={IMAGE_URL + testimonial?.['image']}
                                        alt={testimonial?.name}
                                        draggable={false}
                                        className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex justify-between flex-col py-4">
                    <motion.div
                        key={active}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <h3 className="text-2xl font-bold dark:text-white text-black">
                            {testimonials?.[active]?.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                            {testimonials?.[active]?.designation}
                        </p>
                        <motion.p className="text-lg text-gray-500 mt-8 dark:text-neutral-300 leading-relaxed">
                            {testimonials?.[active]?.quote.split(" ").map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                        delay: 0.02 * index,
                                    }}
                                    className="inline-block"
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </motion.p>
                    </motion.div>
                    <div className="flex gap-4 pt-12 md:pt-0">
                        {/* Left Button */}
                        <button
                            onClick={handlePrev}
                            className="h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/prev hover:bg-orange-500 transition-colors duration-300"
                        >
                            <ArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/prev:text-white transition-transform duration-300 group-hover/prev:-translate-x-1" />
                        </button>

                        {/* Right Button */}
                        <button
                            onClick={handleNext}
                            className="h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/next hover:bg-orange-500 transition-colors duration-300"
                        >
                            <ArrowRight className="h-5 w-5 text-black dark:text-neutral-400 group-hover/next:text-white transition-transform duration-300 group-hover/next:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
"use client";

import React from "react";
import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const RequestCallBanner = () => {
    const phoneNumber = "+919999999999";
    const whatsappNumber = "919999999999";

    return (
        <section className="w-full bg-[var(--card)] overflow-hidden">
            {/* Themed Badge */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                // Updated: 'w-full' ensures it spans the width so 'justify-center' keeps it centered, distinct from the left-aligned text below.
                className="flex items-center justify-center gap-3 mb-6 w-full"
            >
                {/* Left Line */}
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '32px' }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="h-[2px] bg-[var(--primary)]"
                />

                <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] whitespace-nowrap">
                    Expert Support
                </span>

                {/* Right Line */}
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '32px' }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="h-[2px] bg-[var(--primary)]"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative w-full flex md:flex-row min-h-[500px]"
            >

                {/* 1. Background Image Side */}
                <div className="absolute inset-0 z-0 h-full w-full md:relative md:w-1/2 md:order-2 md:h-auto">
                    <img
                        src="https://images.avishkaar.cc/misc/home/request-call-desktop-1.png"
                        alt="Consultation Banner"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Mobile Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/90 to-[var(--card)]/40 md:hidden" />
                    {/* Desktop Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--card)] via-[var(--card)]/40 to-transparent hidden md:block" />
                </div>

                {/* 2. Content Side */}
                {/* Updated: 
            - 'items-center text-center' keeps Mobile centered.
            - 'md:items-start md:text-left' moves Desktop content to the Left. 
        */}
                <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center items-center text-center md:items-start md:text-left px-6 py-12 md:p-20 lg:p-24 md:order-1">
                    <div className="max-w-xl flex flex-col items-center md:items-start">



                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] leading-tight tracking-tight"
                        >
                            Confused on <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-purple-600">
                                How to Start?
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-10 text-lg md:text-xl text-[var(--muted-foreground)] leading-relaxed"
                        >
                            Don't worry! Our experts are here to guide you through every step of your innovation journey.
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            // Updated: 'justify-center' for mobile, 'md:justify-start' for desktop
                            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full"
                        >
                            <a
                                href={`tel:${phoneNumber}`}
                                className="group flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-[var(--primary)] text-[var(--primary-foreground)]"
                            >
                                <Phone className="h-5 w-5 fill-current" />
                                <span>Request a Call</span>
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </a>

                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold border border-[var(--border)] transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 bg-[var(--background)] text-[var(--foreground)] hover:border-[#25D366] hover:text-[#25D366]"
                            >
                                <svg
                                    className="h-5 w-5 fill-[#25D366]"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>WhatsApp Us</span>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default RequestCallBanner;
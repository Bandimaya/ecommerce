"use client"

import { Truck, Shield, Clock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import BackgroundDecorations from "./BackgroundDecorations"

interface TrustBadgesProps {
  getCSSVar: (varName: string, fallback?: string) => string
}

const TrustBadges = ({ getCSSVar }: TrustBadgesProps) => {
  const cssVars = {
    secondary: () => getCSSVar('--secondary', '#f1f5f9'),
    border: () => getCSSVar('--border', '#e2e8f0'),
    background: () => getCSSVar('--background', '#ffffff'),
    primary: () => getCSSVar('--primary', '#3b82f6'),
    foreground: () => getCSSVar('--foreground', '#020817'),
    mutedForeground: () => getCSSVar('--muted-foreground', '#64748b'),
  }

  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative py-10 sm:py-12 md:py-14 lg:py-16 border-y rounded-b-3xl mx-0 sm:mx-2 md:mx-4 mb-8 sm:mb-12 md:mb-16"
      style={{
        backgroundColor: cssVars.secondary(),
        borderColor: cssVars.border()
      }}
    >
      {/* Added Figure Lines for Trust Section */}
      <BackgroundDecorations type="trust" />

      {/* Decorative border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>

      <div className="container px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {[
            { icon: Truck, text: "Free Shipping", desc: "Orders $50+", mobileText: "Free Shipping $50+" },
            { icon: Shield, text: "1-Year Warranty", desc: "Quality guaranteed", mobileText: "Warranty" },
            { icon: Clock, text: "24/7 Support", desc: "Always here to help", mobileText: "Support" },
            { icon: Sparkles, text: "STEM Certified", desc: "Education approved", mobileText: "Certified" },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-5 py-4 sm:py-5 md:py-6 rounded-2xl hover:shadow-xl transition-all border border-gray-200/50"
              style={{
                backgroundColor: cssVars.background(),
                boxShadow: '0 4px 25px rgba(0,0,0,0.08)'
              }}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 border border-gray-200"
                style={{ backgroundColor: `${cssVars.primary()}10` }}
              >
                <badge.icon
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                  style={{ color: cssVars.primary() }}
                />
              </div>
              <div className="px-2 sm:px-4">
                <span
                  className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold block"
                  style={{ color: cssVars.foreground() }}
                >
                  <span className="hidden sm:inline">{badge.text}</span>
                  <span className="sm:hidden">{badge.mobileText}</span>
                </span>
                <span
                  className="text-xs sm:text-sm md:text-base lg:text-lg block mt-1 sm:mt-2 md:mt-3 opacity-75"
                  style={{ color: cssVars.mutedForeground() }}
                >
                  <span className="hidden sm:inline">{badge.desc}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default TrustBadges
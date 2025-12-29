"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import BackgroundDecorations from "./BackgroundDecorations"
import { useI18n } from "@/contexts/I18nContext";


interface NewsletterSectionProps {
  getCSSVar: (varName: string, fallback?: string) => string
}

const NewsletterSection = ({ getCSSVar }: NewsletterSectionProps) => {
  const cssVars = {
    secondary: () => getCSSVar('--secondary', '#f1f5f9'),
    border: () => getCSSVar('--border', '#e2e8f0'),
    accent: () => getCSSVar('--accent', '#8b5cf6'),
    foreground: () => getCSSVar('--foreground', '#020817'),
    fontDisplay: () => getCSSVar('--font-display', 'system-ui, sans-serif'),
    mutedForeground: () => getCSSVar('--muted-foreground', '#64748b'),
    background: () => getCSSVar('--background', '#ffffff'),
    primaryForeground: () => getCSSVar('--primary-foreground', '#ffffff'),
  }
  const { t } = useI18n();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden rounded-3xl mx-auto my-12 sm:my-16 md:my-20 border border-gray-200 max-w-6xl"
      style={{
        backgroundColor: cssVars.secondary(),
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}
    >
      <BackgroundDecorations type="newsletter" />

      {/* Decorative border */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>

      {/* Animated floating elements - centered */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.figure
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-8 left-1/4 opacity-10 hidden sm:block"
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="none" stroke={cssVars.border()} strokeWidth="2" strokeOpacity="0.3" />
          </svg>
        </motion.figure>
        <motion.figure
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-8 right-1/4 opacity-10 hidden sm:block"
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15" fill="none" stroke={cssVars.accent()} strokeWidth="2" strokeOpacity="0.3" />
          </svg>
        </motion.figure>
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Accent line with centered label */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px]"
              style={{ backgroundColor: cssVars.accent() }}
            />
            <span
              className="text-sm sm:text-base md:text-lg font-semibold uppercase tracking-wider"
              style={{ color: cssVars.accent() }}
            >
              {t('newsletter.label')}
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px]"
              style={{ backgroundColor: cssVars.accent() }}
            />
          </motion.div>

          {/* Title */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4 sm:px-0 tracking-tight"
            style={{
              color: cssVars.foreground(),
              fontFamily: cssVars.fontDisplay()
            }}
          >
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="block"
            >
              {t('newsletter.title.line1')}
            </motion.span>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="block"
              style={{ color: cssVars.accent() }}
            >
              {t('newsletter.title.line2')}
            </motion.span>
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed"
            style={{ color: cssVars.mutedForeground() }}
          >
            {t('newsletter.description')}          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <form className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-xl w-full px-4 sm:px-0">
              <input
                type="email"
                placeholder={t('newsletter.emailPlaceholder')}
                className="flex-1 px-6 sm:px-8 py-5 sm:py-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-300"
                style={{
                  backgroundColor: cssVars.background(),
                  color: cssVars.foreground(),
                }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  className="px-8 sm:px-10 py-5 sm:py-6 rounded-full text-base sm:text-lg md:text-xl font-semibold gap-3 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-shadow border-2"
                  style={{
                    backgroundColor: cssVars.accent(),
                    color: cssVars.primaryForeground(),
                    borderColor: 'rgba(255,255,255,0.3)'
                  }}
                >
                  <span className="flex items-center gap-2">
                    {t('newsletter.subscribe')}
                    <ArrowRight className="w-5 h-5 sm:w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base mt-6 sm:mt-8 md:mt-10"
            style={{ color: cssVars.mutedForeground() }}
          >
            {t('newsletter.privacyNote')}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
            className="w-32 h-0.5 mx-auto mt-8 sm:mt-10"
            style={{ backgroundColor: cssVars.border() }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default NewsletterSection
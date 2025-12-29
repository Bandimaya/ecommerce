"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"
import { useProducts } from "@/contexts/ProductsContext"
import Link from "next/link"
import { motion } from "framer-motion"
import BackgroundDecorations from "./BackgroundDecorations"
import { useI18n } from "@/contexts/I18nContext";

interface FeaturedProductsProps {
  getCSSVar: (varName: string, fallback?: string) => string
  isMobile: boolean
}

const FeaturedProducts = ({ getCSSVar, isMobile }: FeaturedProductsProps) => {
  const products = useProducts()
  const featuredProducts = products.filter((p: any) => p.isFeatured)
  const { t } = useI18n();

  const cssVars = {
    accent: () => getCSSVar('--accent', '#8b5cf6'),
    foreground: () => getCSSVar('--foreground', '#020817'),
    fontDisplay: () => getCSSVar('--font-display', 'system-ui, sans-serif'),
    mutedForeground: () => getCSSVar('--muted-foreground', '#64748b'),
    border: () => getCSSVar('--border', '#e2e8f0'),
    primary: () => getCSSVar('--primary', '#3b82f6'),
    background: () => getCSSVar('--background', '#ffffff'),
    card: () => getCSSVar('--card', '#ffffff'),
  }

  return (
    <motion.section
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      style={{
        backgroundColor: cssVars.background(),
      }}
    >
      {/* Theme-Aware Slant Line Background Pattern - FLIPPED DIRECTION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main slant lines pattern (Changed from 45/-45 to 135/-135) */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                135deg,
                ${cssVars.primary()},
                ${cssVars.primary()} 1px,
                transparent 1px,
                transparent 40px
              ),
              repeating-linear-gradient(
                -135deg,
                ${cssVars.accent()},
                ${cssVars.accent()} 1px,
                transparent 1px,
                transparent 40px
              )
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Thick diagonal accent lines (Changed to 135deg) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(
                135deg,
                transparent 49.5%,
                ${cssVars.primary()} 49.5%,
                ${cssVars.primary()} 50.5%,
                transparent 50.5%
              )
            `,
            backgroundSize: '120px 120px',
          }}
        />

        {/* Soft radial fade to keep content readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-transparent" />
      </div>

      {/* Background Decorations Components */}
      <BackgroundDecorations type="products" />

      <div className="container relative z-10 px-4 mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 md:mb-24"
        >
          {/* Accent line and label */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px] bg-accent"
            />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider text-accent">
              {t('featured.label')}
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px] bg-accent"
            />
          </div>

          {/* Title */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
            style={{
              color: cssVars.foreground(),
              fontFamily: cssVars.fontDisplay()
            }}
          >
            <motion.span
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="block"
            >
              {t('featured.headline.line1')}
            </motion.span>
            <motion.span
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${cssVars.accent()} 0%, ${cssVars.primary()} 100%)`,
                WebkitBackgroundClip: 'text',
              }}
            >
              {t('featured.headline.line2')}
            </motion.span>
          </h2>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: cssVars.mutedForeground() }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('featured.description')}
          </motion.p>
        </motion.div>

        {/* Product Grid */}
        <div className="flex justify-center px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-8 lg:gap-10 w-full max-w-7xl">
            {featuredProducts.map((product: any, i: number) => (
              <motion.div
                key={product.id}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -8 }}
                className="w-full flex justify-center"
              >
                <div className="w-full max-w-[280px] sm:max-w-[300px] mx-auto">
                  <ProductCard
                    product={product}
                    themeColors={{
                      primary: cssVars.primary(),
                      accent: cssVars.accent(),
                      foreground: cssVars.foreground(),
                      background: cssVars.background(),
                      card: cssVars.card(),
                      border: cssVars.border(),
                      mutedForeground: cssVars.mutedForeground()
                    }}
                    isMobile={isMobile}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-24 text-center"
        >
          <Link href="/shop">
            <Button
              className="group relative overflow-hidden rounded-full px-8 py-6 text-lg font-semibold hover:shadow-xl transition-all duration-300 border-2"
              style={{
                borderColor: cssVars.border(),
                color: cssVars.foreground(),
                backgroundColor: 'transparent'
              }}
            >
              <motion.span
                className="absolute inset-0 opacity-10"
                style={{ background: `linear-gradient(90deg, transparent, ${cssVars.primary()}, transparent)` }}
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative flex items-center gap-3">
                {t('featured.browseAll')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </Link>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium" style={{ color: cssVars.mutedForeground() }}>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              {t('featured.trust.guarantee')}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cssVars.primary() }} />
              {t('featured.trust.shipping')}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cssVars.accent() }} />
              {t('featured.trust.educator')}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-[100px]"
          style={{ backgroundColor: `${cssVars.accent()}15` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full blur-[100px]"
          style={{ backgroundColor: `${cssVars.primary()}10` }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </motion.section>
  )
}

export default FeaturedProducts
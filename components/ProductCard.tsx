"use client"

import { Plus, ShoppingCart, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useSettings } from "@/contexts/SettingsContext"
import { apiUrl, CURRENCY_OPTIONS } from "@/lib/constants"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { useI18n } from "@/contexts/I18nContext";

export default function ProductCard({ product, index = 0 }: any) {
  const { addToCart } = useCart()
  const navigate = useRouter()
  const { currencyCode } = useSettings()
  const [isHovering, setIsHovering] = useState(false)
  const hasVariants = product.variants && product.variants.length > 0
  const { t } = useI18n();

  // 1. Determine Display Media
  const displayMedia = (product.media && product.media.length > 0)
    ? product.media[0]
    : (product.images && product.images.length > 0) ? product.images[0] : null

  const isVideo = displayMedia?.type === 'video'
  const mediaUrl = displayMedia?.url
    ? `${'http://localhost:3000'}/${displayMedia.url}`
    : '/placeholder.png'

  // 2. Price Logic
  const getPriceData = (pricingArray: any[]) => {
    if (!pricingArray) return null
    return pricingArray.find((p: any) => p.currency === currencyCode) || pricingArray[0]
  }

  let currentPriceData
  if (hasVariants) {
    const variantPrices = product.variants.map((v: any) => getPriceData(v.pricing))
    currentPriceData = variantPrices.reduce((min: any, curr: any) => {
      const currVal = curr?.salePrice || curr?.originalPrice
      const minVal = min?.salePrice || min?.originalPrice
      return currVal < minVal ? curr : min
    }, variantPrices[0])
  } else {
    currentPriceData = getPriceData(product.pricing)
  }

  const price = currentPriceData?.salePrice || currentPriceData?.originalPrice || 0
  const originalPrice = currentPriceData?.originalPrice || 0
  const currencySymbol = CURRENCY_OPTIONS.find(c => c.code === currencyCode)?.symbol || "$"

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (hasVariants) {
      navigate.push(`/product/${product._id}`)
      return
    }

    addToCart({
      productId: product._id,
      variantId: null,
      name: product.name,
      price: price,
      image: displayMedia?.url,
      sku: product.productData?.sku,
      currency: currencyCode,
    }, 1)

    toast({
      title: t('product.addedTitle'),
      description: t('product.addedDesc', { name: product.name }),
      className: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
    })
  }

  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div 
          className="bg-[var(--card-bg)] rounded-[2rem] overflow-hidden border-[1.5px] border-[var(--card-border)] 
                     hover:shadow-[0_25px_50px_-12px_var(--card-shadow)] transition-all duration-500"
          style={{
            '--card-bg': 'hsl(var(--card))',
            '--card-border': 'hsl(var(--border))',
            '--card-shadow': 'hsl(var(--primary) / 0.1)',
            '--card-hover-shadow': 'hsl(var(--primary) / 0.2)',
          } as React.CSSProperties}
        >
          {/* Media Container with enhanced animations */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--media-bg-from)] to-[var(--media-bg-to)]">
            <style jsx>{`
              .media-container {
                --media-bg-from: hsl(var(--muted));
                --media-bg-to: hsl(var(--muted) / 0.5);
              }
            `}</style>
            
            {/* Animated gradient overlay */}
            {isHovering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"
              />
            )}

            {/* Media content */}
            {isVideo ? (
              <motion.video
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
                animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ) : (
              <motion.img
                src={mediaUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}

            {/* Floating badges with enhanced animations */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="relative overflow-hidden bg-gradient-to-r from-[var(--discount-from)] to-[var(--discount-to)] 
                           text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter 
                           shadow-lg shadow-[var(--discount-shadow)]"
                  style={{
                    '--discount-from': 'hsl(var(--destructive))',
                    '--discount-to': 'hsl(var(--destructive) / 0.8)',
                    '--discount-shadow': 'hsl(var(--destructive) / 0.3)',
                  } as React.CSSProperties}
                >
                  <span className="relative z-10">-{discount}% OFF</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                  />
                </motion.span>
              )}
              
              {hasVariants && (
                <motion.span
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="bg-gradient-to-r from-[var(--variant-from)] to-[var(--variant-to)] 
                           text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase 
                           tracking-tighter shadow-lg shadow-[var(--variant-shadow)]"
                  style={{
                    '--variant-from': 'hsl(var(--indigo-600))',
                    '--variant-to': 'hsl(var(--indigo-400))',
                    '--variant-shadow': 'hsl(var(--indigo) / 0.3)',
                  } as React.CSSProperties}
                >
                  {t('product.multiOption')}
                </motion.span>
              )}
            </div>

            {/* Add to cart button with enhanced animation */}
            <motion.div 
              className="absolute bottom-4 right-4 z-20"
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={isHovering ? { y: 0, opacity: 1, scale: 1 } : { y: 20, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={handleAddToCart}
                  size="icon"
                  className="relative overflow-hidden rounded-2xl w-14 h-14 shadow-2xl 
                           bg-gradient-to-br from-[var(--btn-from)] to-[var(--btn-to)] 
                           hover:shadow-[0_0_30px_var(--btn-glow)]"
                  style={{
                    '--btn-from': 'hsl(var(--primary))',
                    '--btn-to': 'hsl(var(--primary) / 0.9)',
                    '--btn-glow': 'hsl(var(--primary) / 0.4)',
                  } as React.CSSProperties}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                  />
                  
                  {/* Icon */}
                  {hasVariants ? (
                    <Plus className="w-6 h-6 relative z-10" />
                  ) : (
                    <ShoppingCart className="w-6 h-6 relative z-10" />
                  )}
                  
                  {/* Pulsing glow effect */}
                  {isHovering && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-white/30"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating particles effect on hover */}
            {isHovering && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ 
                      x: Math.random() * 100 + '%', 
                      y: '100%',
                      opacity: 0 
                    }}
                    animate={{ 
                      y: '-100%',
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section with enhanced animations */}
          <motion.div 
            className="p-6"
            animate={isHovering ? { backgroundColor: 'hsl(var(--card) / 0.98)' } : {}}
            transition={{ duration: 0.3 }}
          >
            {/* Category label */}
            <motion.p 
              className="text-[10px] font-black text-[var(--category-color)] uppercase tracking-widest mb-1"
              style={{ '--category-color': 'hsl(var(--muted-foreground))' } as React.CSSProperties}
              animate={isHovering ? { x: 5 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {product.categories?.[0]?.title || "STEM Kit"}
            </motion.p>

            {/* Product name */}
            <motion.h3 
              className="font-bold text-[var(--title-color)] mb-2 line-clamp-1"
              style={{ '--title-color': 'hsl(var(--foreground))' } as React.CSSProperties}
              animate={isHovering ? { color: 'hsl(var(--primary))' } : {}}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>

            {/* Price and shipping info */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {/* Price from label */}
                {hasVariants && (
                  <motion.span 
                    className="text-xs font-medium text-[var(--from-text)] mr-1 uppercase"
                    style={{ '--from-text': 'hsl(var(--muted-foreground))' } as React.CSSProperties}
                    animate={isHovering ? { opacity: 0.8 } : { opacity: 0.6 }}
                  >
                    {t('product.from')}
                  </motion.span>
                )}
                
                {/* Price with animation */}
                <motion.div 
                  className="flex items-baseline gap-1"
                  animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span 
                    className="text-[10px] font-bold text-[var(--currency-color)] mr-0.5"
                    style={{ '--currency-color': 'hsl(var(--muted-foreground))' } as React.CSSProperties}
                  >
                    {currencySymbol}
                  </span>
                  <span className="text-2xl font-black text-[var(--price-color)]">
                    {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  {/* Original price with strike */}
                  {discount > 0 && (
                    <motion.span 
                      className="text-sm text-[var(--original-price)] line-through decoration-[var(--strike-color)] ml-2"
                      style={{
                        '--original-price': 'hsl(var(--muted-foreground))',
                        '--strike-color': 'hsl(var(--destructive) / 0.5)',
                      } as React.CSSProperties}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {currencySymbol}{originalPrice.toFixed(2)}
                    </motion.span>
                  )}
                </motion.div>
              </div>

              {/* Shipping info with enhanced animation */}
              <motion.div 
                className="text-right"
                animate={isHovering ? { x: -5 } : { x: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="text-[8px] font-black text-[var(--shipping-label)] uppercase"
                   style={{ '--shipping-label': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                  {t('product.shippingTo')}
                </p>
                <motion.div
                  className="flex items-center gap-1 justify-end"
                  whileHover={{ scale: 1.1 }}
                >
                  <Sparkles className="w-3 h-3 text-[var(--currency-icon)]" 
                           style={{ '--currency-icon': 'hsl(var(--emerald-500))' } as React.CSSProperties} />
                  <p className="text-[10px] font-bold text-[var(--currency-code)] uppercase tracking-tighter"
                     style={{ '--currency-code': 'hsl(var(--emerald-600))' } as React.CSSProperties}>
                    {currencyCode}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Border glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isHovering ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-[2rem] border-2 border-[var(--glow-color)] shadow-[0_0_30px_var(--glow-color)]"
                 style={{ '--glow-color': 'hsl(var(--primary) / 0.2)' } as React.CSSProperties} />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
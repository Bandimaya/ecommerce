"use client"

import { Plus, ShoppingCart, Sparkles, Play, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useSettings } from "@/contexts/SettingsContext"
import { apiUrl, CURRENCY_OPTIONS, IMAGE_URL } from "@/lib/constants"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"

export default function ProductCard({ product, index = 0 }: any) {
  const { addToCart, loading: cartLoading } = useCart()
  const navigate = useRouter()
  const { currencyCode } = useSettings()
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const hasVariants = product.variants && product.variants.length > 0

  // 1. Determine Display Media (Logic Unchanged)
  const displayMedia = (product.media && product.media.length > 0)
    ? product.media[0]
    : (product.images && product.images.length > 0) ? product.images[0] : null

  const isVideo = displayMedia?.type === 'video'
  // Preserving your exact URL logic
  const mediaUrl = IMAGE_URL + (displayMedia?.url
    ? `/${displayMedia.url}`
    : '/placeholder.png')

  // 2. Price Logic (Logic Unchanged)
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
  
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // 3. Handlers (Logic Unchanged)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (hasVariants) {
      navigate.push(`/product/${product._id || product.id}`)
      return
    }

    addToCart({
      productId: product._id || product.id,
      variantId: null,
      name: product.name,
      price: price,
      image: displayMedia?.url,
      sku: product.productData?.sku,
      currency: currencyCode,
    }, 1)

    toast({
      title: 'Added to cart',
      description: `${product.name} added to cart`,
      className: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative w-full group cursor-pointer perspective-1000 min-h-[360px] md:h-[420px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/product/${product.slug}`} className="block w-full h-full">
        
        {/* --- LAYER 1: TEXT CARD BASE (Sits Behind) --- */}
        <motion.div
          className="absolute inset-0 top-8 rounded-[2rem] border overflow-hidden shadow-sm"
          style={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
          variants={{
            rest: { y: 0, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
            hover: { 
              y: -4, 
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
            }
          }}
          animate={isHovering ? "hover" : "rest"}
        >
          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
            <motion.div
              className="mt-32 space-y-2"
              animate={isHovering ? { y: -5 } : { y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Category */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                  {product.categories?.[0]?.title || "Collection"}
                </span>
                
                {/* Discount Badge (Moved here for better layout balance) */}
                {discount > 0 && (
                   <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                     -{discount}%
                   </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold line-clamp-1" style={{ color: 'hsl(var(--foreground))' }}>
                {product.name}
              </h3>
              
              {/* Price & Action Row */}
              <div className="flex items-end justify-between pt-2 border-t border-[hsl(var(--border))] mt-3">
                <div className="flex flex-col pt-3">
                   {/* Original Price */}
                  {discount > 0 && (
                    <span className="text-xs text-[hsl(var(--muted-foreground))] line-through decoration-red-400/50">
                      {currencySymbol}{originalPrice.toFixed(2)}
                    </span>
                  )}
                  {/* Current Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">{currencySymbol}</span>
                    <span className="text-xl font-black text-[hsl(var(--primary))]">
                      {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* --- ADD TO CART BUTTON (Integrated into layout) --- */}
                <motion.div
                   onClick={handleAddToCart} // Keep functionality
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="icon"
                    className="rounded-full w-10 h-10 shadow-lg relative overflow-hidden group/btn"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))'
                    }}
                    disabled={cartLoading}
                  >
                     <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                     />
                    {cartLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : hasVariants ? (
                      <Plus className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* --- LAYER 2: FLOATING IMAGE CARD (Sits on Top) --- */}
        <motion.div
          className="absolute z-20 overflow-hidden shadow-md bg-white"
          initial="rest"
          animate={isHovering ? "hover" : "rest"}
          variants={{
            rest: {
              top: 0, left: 0,
              width: "100%", height: "65%", // Initial large image
              borderRadius: "2rem", 
              y: 0, rotate: 0
            },
            hover: {
              top: -20, left: "50%", x: "-50%",
              width: "85%", height: "55%", // Shrinks and floats
              borderRadius: "1.5rem", 
              y: 0, rotate: 2,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" 
            }
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="relative w-full h-full bg-[hsl(var(--muted))]">
            
            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none"
              animate={{ opacity: isHovering ? 0 : 1 }}
            />

            {/* Media Content */}
            {isVideo ? (
              <>
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-80">
                 <div className="bg-white/30 backdrop-blur-sm p-3 rounded-full border border-white/50">
                    <Play className="w-5 h-5 text-white fill-current" />
                 </div>
              </div>
              </>
            ) : (
              <img
                src={mediaUrl}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}

            {/* Badges (Variants / Shipping) */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {hasVariants && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20"
                >
                  Options
                </motion.span>
              )}
            </div>

            {/* Shipping Info (Moved to top right of image) */}
            <div className="absolute top-4 right-4 z-20">
               <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700">{currencyCode}</span>
               </div>
            </div>

          </div>
        </motion.div>

      </Link>
    </motion.div>
  )
}
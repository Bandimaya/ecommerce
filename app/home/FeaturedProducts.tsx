"use client"

import React, { useState, useRef, useEffect } from "react"
import { ArrowRight, Star, X, ChevronRight, ShoppingCart, Brain, Package } from "lucide-react"
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  MotionValue
} from "framer-motion"

// IMPORT DATA
import { apiFetch } from "@/lib/axios"
import { useSettings } from "@/contexts/SettingsContext"
import { getDisplayPrice } from "@/lib/utils"
import { CURRENCY_OPTIONS, IMAGE_URL } from "@/lib/constants"
import { toast } from "@/hooks/useToast"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton"

// TYPES
interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  image: string;
  pricing: any[];
  category: string;
  isFeatured: boolean;
  variants: any[];
  price?: number;
  media?: any[];
}

interface FeaturedProductsProps {
  getCSSVar?: (varName: string, fallback?: string) => string
  isMobile?: boolean
}

// ----------------------------------------------------------------------
// INTERNAL COMPONENTS 
// ----------------------------------------------------------------------

const Button = ({ children, className, style, onClick }: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    style={style}
  >
    {children}
  </button>
)

const BackgroundDecorations = ({ type }: { type: string }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
    <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-green-50/30 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
  </div>
)

// ----------------------------------------------------------------------
// COMPONENT: Magnifier Lens
// ----------------------------------------------------------------------
interface MagnifierLensProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  imageSrc: string;
  containerWidth: number;
  containerHeight: number;
}

const MagnifierLens = ({ mouseX, mouseY, imageSrc, containerWidth, containerHeight }: MagnifierLensProps) => {
  const lensSize = 150;
  const zoomLevel = 2.5;

  const lensX = useTransform(mouseX, (m) => m - lensSize / 2);
  const lensY = useTransform(mouseY, (m) => m - lensSize / 2);

  const bgX = useTransform(mouseX, [0, containerWidth], ["0%", "100%"], { clamp: true });
  const bgY = useTransform(mouseY, [0, containerHeight], ["0%", "100%"], { clamp: true });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: lensSize,
        height: lensSize,
        borderRadius: '50%',
        border: '4px solid white',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.1)',
        pointerEvents: 'none',
        x: lensX,
        y: lensY,
        zIndex: 60,
        backgroundColor: 'white',
        backgroundImage: `url(${imageSrc?.startsWith?.('http') ? imageSrc : IMAGE_URL + imageSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${containerWidth * zoomLevel}px ${containerHeight * zoomLevel}px`,
        backgroundPositionX: bgX,
        backgroundPositionY: bgY
      }}
    />
  );
}

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

const FeaturedProducts = ({ getCSSVar, isMobile: isMobileProp = false }: FeaturedProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [popupContainerDims, setPopupContainerDims] = useState({ width: 0, height: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [products, setProducts] = useState<any>([])
  const [loading, setLoading] = useState(true);

  const popupImageContainerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const router = useRouter();
  const { countryCode } = useSettings();
  const { addToCart } = useCart();
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => { setIsMobileWidth(window.innerWidth < 768); };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setIsModalOpen(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      setIsModalOpen(false);
      setIsAnimating(true);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        setIsAnimating(false);
      }, 300);
    }
  }, [selectedProduct]);

  useEffect(() => {
    setLoading(true);
    apiFetch('/products')
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error))
      .finally(() => setLoading(false));
  }, [])

  const isMobile = isMobileProp || isMobileWidth;

  const handleCardMouseEnter = (e: React.MouseEvent, productId: number) => {
    if (isMobile || isModalOpen || selectedProduct || isAnimating) return;
  };

  const handleCardMouseLeave = () => {
    if (isMobile || isModalOpen || selectedProduct) return;
  };

  const handlePopupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupImageContainerRef.current || isMobile) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePopupMouseEnter = () => {
    if (isMobile || !popupImageContainerRef.current) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    setPopupContainerDims({ width: rect.width, height: rect.height });
    setIsHoveringPopup(true);
  }

  const handlePopupMouseLeave = () => { setIsHoveringPopup(false); }
  const handleCloseModal = () => { setSelectedProduct(null); setIsHoveringPopup(false); }
  const handleProductClick = (product: Product) => {
    if (!isModalOpen && !isAnimating) { setSelectedProduct(product); }
  }

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const price = product.pricing?.[0]?.salePrice || 0;
    const image = product.media?.[0]?.url;

    if (product.variants.length === 0) {
      addToCart({
        productId: product._id,
        name: product.name,
        price: price,
        image: image,
        currency: "USD",
      }, 1);

      toast({
        title: 'Added to cart',
        description: `${product.name} added to cart`,
        className: "bg-emerald-700 text-white border-none",
      });
    } else {
      router.push('/product/' + product.slug);
    }
  };

  const safeGetVar = (name: string, fallback: string) => getCSSVar ? getCSSVar(name, fallback) : fallback;

  const cssVars = {
    accent: () => safeGetVar('--accent', '#059669'),
    foreground: () => safeGetVar('--foreground', '#064e3b'),
    fontDisplay: () => safeGetVar('--font-display', 'system-ui, sans-serif'),
    mutedForeground: () => safeGetVar('--muted-foreground', '#34495e'),
    border: () => safeGetVar('--border', '#e2e8f0'),
    primary: () => safeGetVar('--primary', '#10b981'),
    background: () => safeGetVar('--background', '#f0fdf4'),
    card: () => safeGetVar('--card', '#ffffff'),
  }

  const getId = (p: any) => p?._id || p?.id || 'unknown';
  const featuredProducts = products.filter((product: any) => product.isFeatured);

  const imageVariants = {
    rest: { top: 0, left: 0, width: "100%", height: "100%", borderRadius: "10px", y: 48, scale: 1 },
    hover: isMobile
      ? { top: 0, left: "50%", x: "-50%", width: "90%", height: "auto", borderRadius: "10px", y: -20, scale: 1.02 }
      : { top: 0, left: "50%", x: "-50%", width: "240px", height: "240px", borderRadius: "10px", y: -20, scale: 1.05 }
  };

  return (
    <motion.section
      className="relative py-16 sm:py-20 lg:py-32 overflow-hidden w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
      viewport={{ once: true, amount: 0.1 }}
      style={{ backgroundColor: cssVars.background() }}
    >
      <BackgroundDecorations type="products" />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Premium STEM Collection</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-emerald-600" />
        </div>

        <div className="flex justify-center px-0 sm:px-4">
          {loading ? (
            <ProductGridSkeleton columns={3} count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-24 w-full max-w-7xl">
              {featuredProducts.map((product: any) => {
                const { displayPrice, currency }: any = getDisplayPrice(product.pricing, countryCode);

                return <motion.div
                  key={getId(product)}
                  layoutId={`product-card-container-${getId(product)}`}
                  className="relative w-full group cursor-pointer perspective-1000 min-h-[360px] md:h-[400px]"
                  initial="rest"
                  whileHover={isMobile || isModalOpen || isAnimating ? undefined : "hover"}
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={(e) => handleCardMouseEnter(e, getId(product))}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* CARD BASE - Border Radius 10px */}
                  <motion.div
                    className="absolute inset-0 top-12 rounded-[10px] border bg-white shadow-xl overflow-hidden"
                    variants={{
                      rest: { opacity: 0, y: 20 },
                      hover: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ borderColor: cssVars.border() }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                      <motion.div
                        className="mt-24 space-y-4"
                        variants={{
                          rest: { opacity: 0, y: 20 },
                          hover: { opacity: 1, y: 0, transition: { delay: 0.1 } }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 mb-1">
                              {product.category}
                            </p>
                            <h3 className="text-xl font-bold leading-tight text-slate-900">{product.name}</h3>
                          </div>
                          <span className="text-xl font-black text-slate-900">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</span>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400 flex items-center">
                            View Details <ChevronRight className="ml-1 w-3 h-3" />
                          </span>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            aria-label={`Add ${product.name} to cart`}
                            className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center"
                          >
                            <ShoppingCart className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* FLOATING IMAGE */}
                  <motion.div
                    layoutId={`product-image-container-${getId(product)}`}
                    className="absolute z-30 overflow-hidden shadow-2xl bg-white"
                    variants={imageVariants}
                    transition={{ type: "spring", stiffness: 300, damping: 25, bounce: 0.1 }}
                    style={{ willChange: 'transform, left, width, height', right: 'auto' }}
                  >
                    <div className="relative w-full h-full bg-emerald-50/50 flex items-center justify-center">
                      <img
                        src={IMAGE_URL + product.image}
                        alt={product.name}
                        className="object-cover object-center w-full h-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none"
                        variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
                      />
                      <motion.div
                        className="absolute bottom-8 left-8 text-white pointer-events-none"
                        variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 } }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">{product.category}</p>
                        <h3 className="text-2xl font-black leading-tight">{product.name}</h3>
                        <p className="text-white/80 font-bold mt-1">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              })}
            </div>
          )}
        </div>

        <div className="mt-16 sm:mt-24 text-center">
          <Button aria-label="View full catalog" className="rounded-full px-10 py-3 text-lg font-semibold border-2 bg-white/50 backdrop-blur-sm hover:bg-emerald-50 transition-colors" style={{ borderColor: '#10b981', color: '#064e3b' }}>
            <span className="flex items-center gap-3">View Full Catalog <ArrowRight className="w-5 h-5 text-emerald-600" /></span>
          </Button>
        </div>
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      <AnimatePresence mode="wait">
        {selectedProduct && (
          // WRAPPER: Fixed, inset-0, z-index high. 
          // flex items-center justify-center ENSURES CENTER ALIGNMENT on desktop
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md pointer-events-auto"
              onClick={handleCloseModal}
            />

            {/* MODAL CARD: md:rounded-[10px] */}
            <motion.div
              layoutId={`product-card-container-${selectedProduct._id || selectedProduct.id}`}
              className="relative w-full h-full md:h-[85vh] md:w-[90vw] md:max-w-6xl bg-white md:rounded-[10px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto z-[110]"
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.5 }}
            >
              {/* Close Button - positioned absolutely within the modal */}
              <button
                onClick={handleCloseModal}
                aria-label="Close product details"
                className="fixed md:absolute top-[70px] md:top-8 right-4 md:right-8 z-50 p-3 rounded-full bg-white/90 md:bg-emerald-50 hover:bg-emerald-100 transition-all shadow-lg backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-emerald-900" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side (Image) */}
                <div
                  ref={popupImageContainerRef}
                  className="w-full h-[40vh] md:h-auto md:w-3/5 bg-emerald-50/30 relative overflow-hidden flex-shrink-0 group"
                  onMouseEnter={handlePopupMouseEnter}
                  onMouseLeave={handlePopupMouseLeave}
                  onMouseMove={handlePopupMouseMove}
                >
                  <div className={`relative w-full h-full ${isMobile ? '' : 'cursor-crosshair'}`}>
                    <motion.div
                      layoutId={`product-image-container-${selectedProduct._id || selectedProduct.id}`}
                      className="relative w-full h-full z-20 pointer-events-none"
                      animate={{ width: "100%", height: "100%", borderRadius: "0rem", y: 0, scale: 1, left: 0, x: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <img
                        src={IMAGE_URL + selectedProduct.image}
                        alt={selectedProduct.name}
                        className="object-cover object-center w-full h-full"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </motion.div>

                    {!isMobile && (
                      <AnimatePresence>
                        {isHoveringPopup && popupContainerDims.width > 0 && (
                          <MagnifierLens
                            mouseX={mouseX}
                            mouseY={mouseY}
                            imageSrc={IMAGE_URL + selectedProduct.image}
                            containerWidth={popupContainerDims.width}
                            containerHeight={popupContainerDims.height}
                          />
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>

                {/* Right Side (Content) */}
                {/* PADDING-TOP (pt-14 md:pt-16) on the PARENT container. 
                    This reserves space for the close button so the scrollbar doesn't cover it. */}
                <div className="w-full md:w-2/5 flex flex-col bg-white h-full overflow-hidden relative pt-14 md:pt-16">

                  {/* SCROLL CONTAINER: min-h-0 prevents flex overflow issues. 
                      It starts AFTER the parent padding. */}
                  <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-12 lg:px-16 min-h-0">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8 mt-2">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full">
                          {selectedProduct.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-emerald-600" /> Ages 8+
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl lg:text-5xl font-black mb-4 md:mb-6 text-emerald-950 leading-tight">
                        {selectedProduct.name}
                      </h2>

                      <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-emerald-50">
                        <span className="text-2xl md:text-4xl font-black text-slate-900">
                          ${selectedProduct.price}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-50 border border-yellow-100">
                          <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                          <span className="text-yellow-700 font-bold text-base md:text-lg">4.9</span>
                        </div>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <div>
                          <h4 className="font-black text-emerald-900 mb-3 md:mb-4 flex items-center gap-2 uppercase text-xs md:text-sm tracking-widest">
                            <Brain className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" /> Learning Outcomes
                          </h4>
                          <div className="grid grid-cols-1 gap-2 md:gap-3">
                            {["Problem-solving skills", "Critical thinking", "Engineering principles", "Hands-on learning"].map((outcome, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-emerald-50/30 p-3 md:p-4 rounded-xl border border-emerald-50">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span className="text-sm md:text-base">{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h-8" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 md:p-8 lg:p-12 border-t border-emerald-50 bg-white z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <Button
                      onClick={(e: any) => handleAddToCart(e, selectedProduct)}
                      aria-label={`Add ${selectedProduct.name} to cart`}
                      className="
                          w-full
                          py-4 md:py-6 lg:py-3
                          text-base md:text-xl
                          rounded-xl md:rounded-2xl
                          font-black
                          bg-emerald-900 text-white
                          shadow-xl
                          hover:bg-emerald-700
                          transition-all
                          active:scale-[0.98]
                          flex items-center justify-center gap-3
                        "
                         >
                      <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                      <span>
                        Add to Cart — ${selectedProduct.price}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default FeaturedProducts
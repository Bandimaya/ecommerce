"use client"

import React, { useState, useRef, useEffect } from "react"
import { ArrowRight, Star, X, ChevronRight, ShoppingCart, Brain, Package } from "lucide-react"
import Image from "next/image"
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  MotionValue
} from "framer-motion"

// IMPORT DATA
import { MOCK_PRODUCTS, Product } from "../../lib/Data"
import { apiFetch } from "@/lib/axios"
import { useSettings } from "@/contexts/SettingsContext"
import { getDisplayPrice } from "@/lib/utils"
import { CURRENCY_OPTIONS } from "@/lib/constants"
import { toast } from "@/hooks/useToast"
import { useCart } from "@/contexts/CartContext"

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
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
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
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
        backgroundImage: `url(${imageSrc})`,
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
  const [products, setProducts] = useState<any>([])

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    apiFetch('/products')
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileWidth(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle body overflow when modal is open
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  const isMobile = isMobileProp || isMobileWidth;

  const popupImageContainerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Using the imported data
  const featuredProducts = products.filter((product: any) => product.isFeatured);
  const prefersReducedMotion = useReducedMotion()

  const safeGetVar = (name: string, fallback: string) => {
    return getCSSVar ? getCSSVar(name, fallback) : fallback;
  }

  const cssVars = {
    accent: () => safeGetVar('--accent', '#8b5cf6'),
    foreground: () => safeGetVar('--foreground', '#020817'),
    fontDisplay: () => safeGetVar('--font-display', 'system-ui, sans-serif'),
    mutedForeground: () => safeGetVar('--muted-foreground', '#64748b'),
    border: () => safeGetVar('--border', '#e2e8f0'),
    primary: () => safeGetVar('--primary', '#3b82f6'),
    background: () => safeGetVar('--background', '#ffffff'),
    card: () => safeGetVar('--card', '#ffffff'),
  }

  useEffect(() => {
    if (selectedProduct) {
      setIsModalOpen(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      setIsModalOpen(false);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [selectedProduct]);
  const { countryCode } = useSettings();
  const { addToCart } = useCart();


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
    if (isMobile || !popupImageContainerRef.current || isModalOpen) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    setPopupContainerDims({ width: rect.width, height: rect.height });
    setIsHoveringPopup(true);
  }

  const handlePopupMouseLeave = () => {
    setIsHoveringPopup(false);
  }

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsHoveringPopup(false);
  }

  const handleProductClick = (product: Product) => {
    if (!isModalOpen && !isAnimating) {
      setSelectedProduct(product);
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();

    const price = product.pricing?.[0]?.salePrice || 0;
    const image = product.media?.[0]?.url;

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
      className: "bg-emerald-600 text-white border-none",
    });
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

        {/* Header */}
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-16">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-blue-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Featured STEM Collection</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-blue-600" />
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="flex justify-center px-0 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-24 w-full max-w-7xl">
            {featuredProducts.map((product: any) => {
              const { displayPrice, currency }: any = getDisplayPrice(
                product.pricing,
                countryCode
              );

              return <motion.div
                key={product._id}
                layoutId={`product-card-container-${product._id}`}
                className="relative h-[400px] w-full group cursor-pointer perspective-1000"
                initial="rest"
                whileHover={isMobile || isModalOpen || isAnimating ? undefined : "hover"}
                animate={selectedProduct?.id === product._id ? "selected" : "rest"}
                variants={{
                  rest: {},
                  hover: {},
                  selected: { scale: 1 }
                }}
                onClick={() => handleProductClick(product)}
                onMouseEnter={(e) => handleCardMouseEnter(e, product.id)}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* CARD BASE (Revealed on Hover) */}
                <motion.div
                  className="absolute inset-0 top-12 rounded-[2.5rem] border bg-white shadow-lg overflow-hidden"
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
                          <p className="text-[10px] font-black uppercase tracking-tighter text-blue-600 mb-1">
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
                          className="h-10 w-10 rounded-full bg-blue-600 hover:bg-slate-900 transition-colors shadow-md flex items-center justify-center"
                        >
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* FLOATING IMAGE - Fixed to Center Top on Hover */}
                <motion.div
                  layoutId={`product-image-container-${product.id}`}
                  className="absolute z-30 overflow-hidden shadow-xl bg-white"
                  variants={{
                    rest: {
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "2rem",
                      y: 48,
                      scale: 1,
                    },
                    hover: {
                      top: 0,
                      left: "50%",
                      x: "-50%",
                      width: "240px",
                      height: "240px",
                      borderRadius: "1.5rem",
                      y: -20,
                      scale: 1.05,
                    },
                    selected: {
                      width: "100%",
                      height: "100%",
                      borderRadius: "0rem",
                      y: 0,
                      scale: 1,
                      left: 0,
                      x: 0
                    }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    bounce: 0.1
                  }}
                  style={{
                    willChange: 'transform, left, width, height',
                    right: 'auto'
                  }}
                >
                  <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      // fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Gradients and Labels (Rest State) */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent pointer-events-none"
                      variants={{
                        rest: { opacity: 1 },
                        hover: { opacity: 0 },
                        selected: { opacity: 0 }
                      }}
                    />
                    <motion.div
                      className="absolute bottom-8 left-8 text-white pointer-events-none"
                      variants={{
                        rest: { opacity: 1, y: 0 },
                        hover: { opacity: 0, y: 20 },
                        selected: { opacity: 0 }
                      }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">{product.category}</p>
                      <h3 className="text-2xl font-black leading-tight">{product.name}</h3>
                      <p className="text-white/80 font-bold mt-1">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            }
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 sm:mt-24 text-center">
          <Button className="rounded-full px-10 py-7 text-lg font-semibold border-2 bg-transparent hover:bg-gray-50 transition-colors" style={{ borderColor: cssVars.border(), color: cssVars.foreground() }}>
            <span className="flex items-center gap-3">View Full Catalog <ArrowRight className="w-5 h-5" /></span>
          </Button>
        </div>
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md pointer-events-auto"
              onClick={handleCloseModal}
            />

            {/* Modal Card */}
            <motion.div
              layoutId={`product-card-container-${selectedProduct.id}`}
              className="relative w-full h-[100dvh] sm:h-[85vh] sm:w-[90vw] md:max-w-6xl bg-white sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col pointer-events-auto z-[110]"
              onClick={(e) => e.stopPropagation()}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 0.5
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-8 right-8 z-50 p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-all shadow-sm"
              >
                <X className="w-6 h-6 text-slate-900" />
              </button>

              <div className="flex flex-col md:flex-row h-full">

                {/* --- POPUP IMAGE SECTION --- */}
                <div
                  ref={popupImageContainerRef}
                  className="w-full h-[40vh] md:h-auto md:w-3/5 bg-slate-50 relative overflow-hidden cursor-crosshair flex-shrink-0 group"
                  onMouseEnter={handlePopupMouseEnter}
                  onMouseLeave={handlePopupMouseLeave}
                  onMouseMove={handlePopupMouseMove}
                >
                  {/* Shared Layout Image */}
                  <motion.div
                    layoutId={`product-image-container-${selectedProduct.id}`}
                    className="relative w-full h-full z-20 pointer-events-none"
                    initial={false}
                    animate={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "0rem",
                      y: 0,
                      scale: 1,
                      left: 0,
                      x: 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25
                    }}
                  >
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      // fill
                      // priority
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </motion.div>

                  {/* Magnifier Lens (Desktop Only) */}
                  {!isMobile && (
                    <AnimatePresence>
                      {isHoveringPopup && popupContainerDims.width > 0 && (
                        <MagnifierLens
                          mouseX={mouseX}
                          mouseY={mouseY}
                          imageSrc={selectedProduct.image}
                          containerWidth={popupContainerDims.width}
                          containerHeight={popupContainerDims.height}
                        />
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* --- POPUP DETAILS SECTION --- */}
                <div className="w-full md:w-2/5 flex flex-col bg-white h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-8 sm:p-12 md:p-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                          {selectedProduct.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Package className="w-4 h-4" /> Ages 8+
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 leading-none tracking-tight">
                        {selectedProduct.name}
                      </h2>

                      <div className="flex items-center gap-5 mb-10 pb-10 border-b border-slate-100">
                        <span className="text-4xl font-black text-slate-900">
                          ${selectedProduct.price}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-50 border border-yellow-100">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="text-yellow-700 font-bold text-lg">4.9</span>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase text-sm tracking-widest">
                            <Brain className="w-5 h-5 text-blue-500" /> Learning Outcomes
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {["Problem-solving skills", "Critical thinking", "Engineering principles", "Hands-on learning"].map((outcome, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                {outcome}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-8 sm:p-12 border-t border-slate-100 bg-white">
                    <Button
                      onClick={() => console.log("Added to cart:", selectedProduct.name)}
                      className="w-full py-8 text-xl rounded-2xl font-black bg-slate-900 text-white shadow-2xl hover:bg-blue-600 transition-all active:scale-[0.98]"
                    >
                      Add to Cart — ${selectedProduct.price}
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
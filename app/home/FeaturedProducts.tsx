"use client"

import React, { useState, useRef, useEffect } from "react"
import { ArrowRight, Star, X, ChevronRight, ChevronLeft, ShoppingCart, Brain, Package } from "lucide-react"
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  MotionValue,
  Transition
} from "framer-motion"

// IMPORT DATA
import { apiFetch } from "@/lib/axios"
import { useSettings } from "@/contexts/SettingsContext"
import { getDisplayPrice, cn } from "@/lib/utils" // Ensure cn is imported
import { CURRENCY_OPTIONS, IMAGE_URL } from "@/lib/constants"
import { toast } from "@/hooks/useToast"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton"

// ----------------------------------------------------------------------
// CONFIG: Animation Physics
// ----------------------------------------------------------------------
const SMOOTH_SPRING: Transition = { 
  type: "spring", 
  stiffness: 380, 
  damping: 30, 
  mass: 0.8 
};

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
// COMPONENT: Horizontal Carousel Row
// ----------------------------------------------------------------------
const ProductCarouselRow = ({ children }: { children: React.ReactNode }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!rowRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        // Allow a 1px buffer for calculation errors
        const isAtStart = scrollLeft <= 1; 
        const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1;

        setCanScrollLeft(!isAtStart);
        setCanScrollRight(!isAtEnd);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Delay check to allow images/layout to settle
        const timeout = setTimeout(checkScroll, 500); 
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeout);
        };
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (!rowRef.current) return;
        const scrollAmount = rowRef.current.clientWidth * 0.75; // Scroll 75% of view
        rowRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(checkScroll, 400); 
    };

    return (
        <div className="relative group/row w-full">
            {/* Left Gradient Mask & Button */}
            <div className={`absolute left-0 top-0 bottom-0 z-40 flex items-center transition-opacity duration-300 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#f0fdf4] to-transparent w-20 pointer-events-none" />
                 <button
                    onClick={() => scroll('left')}
                    className="relative ml-4 w-10 h-10 bg-white border border-emerald-100 rounded-full shadow-lg flex items-center justify-center text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={rowRef}
                onScroll={checkScroll}
                className="flex items-stretch gap-6 overflow-x-auto overflow-y-hidden pb-12 pt-4 px-4 md:px-12 scrollbar-hide snap-x snap-mandatory"
                style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    // Create padding for the first/last items so they aren't flush with screen edge
                    scrollPaddingLeft: '2rem' 
                }}
            >
                {children}
            </div>

            {/* Right Gradient Mask & Button */}
            <div className={`absolute right-0 top-0 bottom-0 z-40 flex items-center justify-end transition-opacity duration-300 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                 <div className="absolute inset-0 bg-gradient-to-l from-[#f0fdf4] to-transparent w-20 pointer-events-none" />
                 <button
                    onClick={() => scroll('right')}
                    className="relative mr-4 w-10 h-10 bg-white border border-emerald-100 rounded-full shadow-lg flex items-center justify-center text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

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
        top: 0, left: 0,
        width: lensSize, height: lensSize,
        borderRadius: '50%',
        border: '4px solid white',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.1)',
        pointerEvents: 'none',
        x: lensX, y: lensY,
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
  
  const isModalOpen = !!selectedProduct;

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
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // Optional: Add padding-right for scrollbar if needed
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    setLoading(true);
    apiFetch('/products')
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error))
      .finally(() => setLoading(false));
  }, [])

  const isMobile = isMobileProp || isMobileWidth;

  const handlePopupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupImageContainerRef.current || isMobile) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    if (rect.width !== popupContainerDims.width || rect.height !== popupContainerDims.height) {
        setPopupContainerDims({ width: rect.width, height: rect.height });
    }
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePopupMouseEnter = () => {
    if (isMobile || !popupImageContainerRef.current) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    setPopupContainerDims({ width: rect.width, height: rect.height });
    setIsHoveringPopup(true);
  }

  const handleProductClick = (product: Product) => {
    if (!isModalOpen) { setSelectedProduct(product); }
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
    border: () => safeGetVar('--border', '#e2e8f0'),
    background: () => safeGetVar('--background', '#f0fdf4'),
  }

  const getId = (p: any) => p?._id || p?.id || 'unknown';
  const featuredProducts = products.filter((product: any) => product.isFeatured);

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

      <div className="w-full max-w-[2000px] mx-auto relative z-10">
        <div className="flex justify-center items-center gap-3 mb-10 sm:mb-12">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Premium STEM Collection</span>
          <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-emerald-600" />
        </div>

        <div className="relative w-full">
          {loading ? (
             <div className="px-4 md:px-12">
                <ProductGridSkeleton columns={3} count={3} />
             </div>
          ) : (
            <ProductCarouselRow>
              {featuredProducts.map((product: any) => {
                const { displayPrice, currency }: any = getDisplayPrice(product.pricing, countryCode);
                const isSelected = selectedProduct?._id === product._id;
                const imageUrl = product.image?.startsWith('http') ? product.image : IMAGE_URL + product.image;

                return (
                  <div 
                    key={getId(product)} 
                    // FIXED DIMENSIONS FOR HORIZONTAL SCROLL
                    className="h-[420px] w-[280px] md:w-[340px] flex-shrink-0 snap-start relative perspective-1000"
                  >
                    <motion.div
                      layoutId={`product-card-container-${getId(product)}`}
                      className={`relative h-full w-full group cursor-pointer ${isSelected ? "z-0 opacity-0" : "z-10"}`}
                      initial="rest"
                      whileHover={isMobile || isModalOpen ? undefined : "hover"}
                      animate="rest"
                      onClick={() => handleProductClick(product)}
                    >
                      {/* CARD BASE */}
                      <motion.div
                        className="absolute inset-0 top-12 rounded-[16px] border bg-white shadow-xl overflow-hidden"
                        variants={{
                            rest: { opacity: 0, y: 15 },
                            hover: { opacity: 1, y: 0 }
                        }}
                        transition={SMOOTH_SPRING}
                        style={{ borderColor: cssVars.border() }}
                      >
                        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                          <motion.div
                            className="mt-auto space-y-3"
                            variants={{
                              rest: { opacity: 0, y: 15 },
                              hover: { opacity: 1, y: 0, transition: { delay: 0.1 } }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 mb-1">
                                  {product.category}
                                </p>
                                <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2">{product.name}</h3>
                              </div>
                              <span className="text-lg font-black text-slate-900 shrink-0 ml-2">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</span>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400 flex items-center">
                                Details <ChevronRight className="ml-1 w-3 h-3" />
                              </span>
                              <Button
                                onClick={(e: any) => handleAddToCart(e, product)}
                                className="h-9 w-9 rounded-full bg-emerald-600 hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center p-0"
                              >
                                <ShoppingCart className="w-4 h-4 text-white" />
                              </Button>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* FLOATING IMAGE */}
                      <motion.div
                        layoutId={`product-image-container-${getId(product)}`}
                        className="absolute z-30 overflow-hidden shadow-md group-hover:shadow-2xl bg-white"
                        variants={{
                            rest: {
                                top: 0, left: 0, right: 0, margin: "0 auto",
                                width: "100%", height: "100%",
                                borderRadius: "16px",
                                y: 48, scale: 1
                            },
                            hover: {
                                top: -20, left: 0, right: 0, margin: "0 auto",
                                width: "220px", height: "220px",
                                borderRadius: "16px",
                                y: 0, scale: 1.05
                            }
                        }}
                        transition={SMOOTH_SPRING}
                        style={{ willChange: 'transform, width, height' }}
                      >
                        <div className="relative w-full h-full bg-emerald-50/50 flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="object-cover object-center w-full h-full"
                          />

                          {/* Overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none"
                            variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Text on Image (Rest State) */}
                          <motion.div
                            className="absolute bottom-6 left-6 right-6 text-white pointer-events-none"
                            variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 } }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">{product.category}</p>
                            <h3 className="text-xl font-black leading-tight line-clamp-2 mb-2">{product.name}</h3>
                            <p className="text-white/90 font-bold">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </ProductCarouselRow>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button onClick={() => router.push('/shop')} aria-label="View full catalog" className="rounded-full px-10 py-3 text-lg font-semibold border-2 bg-white/50 backdrop-blur-sm hover:bg-emerald-50 transition-colors" style={{ borderColor: '#10b981', color: '#064e3b' }}>
            <span className="flex items-center gap-3">View Full Catalog <ArrowRight className="w-5 h-5 text-emerald-600" /></span>
          </Button>
        </div>
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      <AnimatePresence mode="wait">
        {selectedProduct && (
          <div className="fixed inset-0 top-20 md:top-15 z-[50] flex items-center justify-center pointer-events-none px-4 pb-4 md:pt-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md pointer-events-auto"
              style={{ top: 0 }} 
              onClick={() => setSelectedProduct(null)}
            />

            {/* MODAL WRAPPER */}
            <div className="relative w-full h-full md:h-auto md:max-w-6xl flex items-center justify-center pointer-events-none">
                <motion.div
                layoutId={`product-card-container-${selectedProduct._id || selectedProduct.id}`}
                className="relative w-full h-full md:h-[85vh] bg-white rounded-[20px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                transition={SMOOTH_SPRING}
                >
                {/* Close Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-100 hover:bg-emerald-100 transition-all shadow-sm"
                >
                    <X className="w-6 h-6 text-emerald-900" />
                </motion.button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Side (Image) */}
                    <div
                    ref={popupImageContainerRef}
                    className="w-full h-[40vh] md:h-full md:w-3/5 bg-emerald-50/30 relative overflow-hidden group shrink-0"
                    onMouseEnter={handlePopupMouseEnter}
                    onMouseLeave={() => setIsHoveringPopup(false)}
                    onMouseMove={handlePopupMouseMove}
                    >
                    <motion.div
                        layoutId={`product-image-container-${selectedProduct._id || selectedProduct.id}`}
                        className="w-full h-full relative z-20"
                        transition={SMOOTH_SPRING}
                    >
                        <img
                        src={selectedProduct.image?.startsWith('http') ? selectedProduct.image : IMAGE_URL + selectedProduct.image}
                        alt={selectedProduct.name}
                        className="object-cover object-center w-full h-full"
                        />
                    </motion.div>

                    {!isMobile && (
                        <AnimatePresence>
                        {isHoveringPopup && popupContainerDims.width > 0 && (
                            <MagnifierLens
                            mouseX={mouseX}
                            mouseY={mouseY}
                            imageSrc={selectedProduct.image?.startsWith('http') ? selectedProduct.image : IMAGE_URL + selectedProduct.image}
                            containerWidth={popupContainerDims.width}
                            containerHeight={popupContainerDims.height}
                            />
                        )}
                        </AnimatePresence>
                    )}
                    </div>

                    {/* Right Side (Content) */}
                    <div className="w-full md:w-2/5 flex flex-col bg-white h-full overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                        <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        >
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full">
                            {selectedProduct.category}
                            </span>
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-emerald-600" /> Ages 8+
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 text-emerald-950 leading-tight">
                            {selectedProduct.name}
                        </h2>

                        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-emerald-50">
                            <span className="text-3xl font-black text-slate-900">
                            ${selectedProduct.price}
                            </span>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-50 border border-yellow-100">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-yellow-700 font-bold text-base">4.9</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                            <h4 className="font-black text-emerald-900 mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                                <Brain className="w-4 h-4 text-emerald-600" /> Learning Outcomes
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {["Problem-solving skills", "Critical thinking", "Engineering principles", "Hands-on learning"].map((outcome, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-emerald-50/30 p-3 rounded-xl border border-emerald-50">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                    <span>{outcome}</span>
                                </div>
                                ))}
                            </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                This STEM kit is designed to challenge and inspire. Built with high-quality components, it offers a hands-on introduction to robotics and engineering concepts.
                            </p>
                        </div>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 md:p-8 border-t border-emerald-50 bg-white z-10"
                    >
                        <Button
                        onClick={(e: any) => handleAddToCart(e, selectedProduct)}
                        className="w-full py-6 text-lg rounded-xl font-black bg-emerald-900 text-white shadow-xl hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart — ${selectedProduct.price}
                        </Button>
                    </motion.div>
                    </div>
                </div>
                </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default FeaturedProducts
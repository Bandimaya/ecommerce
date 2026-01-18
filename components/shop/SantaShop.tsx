"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  X, ChevronRight, ChevronLeft, Star, ShoppingCart,
  Package, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  MotionValue
} from "framer-motion";
import Image from "next/image";
import { apiFetch } from "@/lib/axios";
import { cn, getDisplayPrice } from "@/lib/utils";
import { Product } from "@/app/home/FeaturedProducts";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import { CURRENCY_OPTIONS } from "@/lib/constants";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// HELPER: Utilities
// ----------------------------------------------------------------------
const chunkArray = (array: any[], size: number) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

// ----------------------------------------------------------------------
// COMPONENT: Product Carousel Row (Scroll Logic)
// ----------------------------------------------------------------------
const ProductCarouselRow = ({ children, rowIndex }: { children: React.ReactNode, rowIndex: number }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;

    // 1px buffer for calculation errors
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75; // Scroll 75% of width
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 500); // Check after animation
  };

  return (
    <div className="relative group/row">
      {/* Left Navigation */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
          "flex",
          !canScrollLeft ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100 hover:bg-slate-900 hover:text-white"
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={rowRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-6 overflow-x-auto overflow-y-hidden pb-8 pt-4 px-4 md:px-12 scrollbar-hide snap-x snap-mandatory h-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Right Navigation */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
          "flex",
          !canScrollRight ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100 hover:bg-slate-900 hover:text-white"
        )}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------
// HELPER: Magnifier Lens
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
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: lensSize, height: lensSize,
        borderRadius: '50%',
        border: '4px solid white',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.1)',
        pointerEvents: 'none',
        x: lensX, y: lensY,
        zIndex: 50,
        backgroundColor: 'white',
        backgroundImage: `url(${imageSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${containerWidth * zoomLevel}px ${containerHeight * zoomLevel}px`,
        backgroundPositionX: bgX,
        backgroundPositionY: bgY
      }}
    />
  );
};

// ----------------------------------------------------------------------
// COMPONENT: Skeleton Row
// ----------------------------------------------------------------------
const SkeletonRow = () => (
  <div className="space-y-4 mb-12">
    <div className="h-8 w-48 bg-slate-200 rounded-md ml-12 animate-pulse" />
    <div className="flex gap-6 overflow-hidden px-12">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-[400px] min-w-[300px] bg-white rounded-[10px] shadow-sm animate-pulse flex flex-col p-4 border border-slate-100">
          <div className="w-full h-48 bg-slate-100 rounded-md mb-4" />
          <div className="w-2/3 h-6 bg-slate-100 rounded mb-2" />
          <div className="w-1/3 h-6 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  </div>
);


// ----------------------------------------------------------------------
// MAIN SHOP COMPONENT
// ----------------------------------------------------------------------

const SantaShop = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // UI Interaction State
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hooks
  const { addToCart, loading: cartLoading } = useCart();

  // Refs for Motion
  const popupImageContainerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const { countryCode } = useSettings();
  const mouseY = useMotionValue(0);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch('/products');
        setProducts(res);

        // Extract unique categories
        const uniqueCats = Array.from(new Set(res.map((p: Product) => p.category))).filter(Boolean) as string[];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast({ title: "Error", description: "Could not load products", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- 2. RESPONSIVENESS HANDLER ---
  useEffect(() => {
    const checkMobile = () => setIsMobileWidth(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- 3. SCROLL LOCK ---
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        setIsAnimating(false);
      }, 500);
    }
  }, [selectedProduct]);

  // --- 4. GROUPING LOGIC ---
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach(p => {
      const cat = p.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    return grouped;
  }, [products]);


  // --- HANDLERS ---
  const handleAddToCart = (e: React.MouseEvent, product: any, currency: any) => {
    e.stopPropagation();
    const price = product.pricing?.[0]?.salePrice || 0;
    const image = product.media?.[0]?.url;

    if (product.variants.length === 0) {
      addToCart({
        productId: product._id,
        name: product.name,
        price: price,
        image: image,
        currency: currency,
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

  const handlePopupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupImageContainerRef.current || isMobileWidth) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="h-auto bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="w-full mx-auto pt-24 pb-12 md:py-20 relative z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col items-center mb-16 px-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">STEM Curriculum</span>
            <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-center text-slate-900">
            Our DIY <span className="text-blue-600">KITS</span>
          </h1>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="space-y-16">

          {/* SKELETON LOADER */}
          {isLoading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {/* PRODUCT ROWS */}
          {!isLoading && Object.entries(productsByCategory).map(([category, items]) => {

            // Split items into chunks of 10
            const chunks = chunkArray(items, 10);

            return (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="px-4 md:px-12 flex items-center gap-4">
                  <h3 className="text-2xl font-black text-slate-900">{category}</h3>
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-sm font-bold text-slate-400">{items.length} Items</span>
                </div>

                {/* Render Chunk Rows */}
                {chunks.map((chunk, chunkIndex) => (
                  <ProductCarouselRow key={`${category}-${chunkIndex}`} rowIndex={chunkIndex}>
                    {chunk.map((product) => {
                      const { displayPrice, currency, countryCodeValue }: any = getDisplayPrice(product.pricing, countryCode);

                      return <motion.div
                        key={product._id + "santa-shop-card"}
                        layoutId={`product-card-container-santa-${product._id}`}
                        className="relative h-[400px] w-[280px] md:w-[320px] flex-shrink-0 snap-start group cursor-pointer perspective-1000"
                        initial="rest"
                        whileHover={isMobileWidth || selectedProduct || isAnimating ? undefined : "hover"}
                        onClick={() => !selectedProduct && !isAnimating && setSelectedProduct(product)}
                      >
                        {/* CARD BASE */}
                        <motion.div
                          className="absolute inset-0 top-12 rounded-[10px] border bg-white shadow-sm group-hover:shadow-lg overflow-hidden transition-all"
                          variants={{
                            rest: { opacity: 0, y: 20 },
                            hover: { opacity: 1, y: 0 }
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                            <motion.div
                              className="space-y-3"
                              variants={{
                                rest: { opacity: 0, y: 20 },
                                hover: { opacity: 1, y: 0, transition: { delay: 0.1 } }
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-tighter text-blue-600 mb-1">
                                    {product.category || 'STEM'}
                                  </p>
                                  <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2">{product.name}</h3>
                                </div>
                                <span className="text-lg font-black text-slate-900 whitespace-nowrap ml-2">
                                  {currency}{displayPrice}
                                </span>
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 flex items-center">
                                  Details <ChevronRight className="ml-1 w-3 h-3" />
                                </span>
                                <Button
                                  size="icon"
                                  className="h-9 w-9 rounded-[8px] bg-blue-600 hover:bg-slate-900 transition-colors shadow-md"
                                  onClick={(e) => handleAddToCart(e, product, '')}
                                  disabled={cartLoading}
                                >
                                  {cartLoading ? <Skeleton className="w-3.5 h-3.5 rounded-full bg-white/50" /> : <ShoppingCart className="w-3.5 h-3.5 text-white" />}
                                </Button>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* FLOATING IMAGE */}
                        <motion.div
                          layoutId={`product-image-container-santa-${product._id}`}
                          className="absolute z-30 overflow-hidden shadow-md bg-white border border-slate-100"
                          variants={{
                            rest: {
                              top: 0, left: 0, right: 0,
                              margin: "0 auto", width: "100%", height: "100%",
                              borderRadius: "10px", y: 48, scale: 1,
                            },
                            hover: {
                              top: -20, left: 0, right: 0,
                              margin: "0 auto", width: "220px", height: "220px",
                              borderRadius: "10px", y: 0, scale: 1.05,
                            }
                          }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          style={{ willChange: 'transform, width, height' }}
                        >
                          <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                            <Image
                              src={product.image || '/placeholder.png'}
                              alt={product.title || 'product'}
                              fill
                              className="object-cover object-center"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />

                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
                              variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
                            />

                            <motion.div
                              className="absolute bottom-6 left-6 right-6 text-white pointer-events-none z-10"
                              variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 } }}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-1">{product.category}</p>
                              <h3 className="text-xl font-black leading-tight mb-1 truncate">{product.title}</h3>
                              <p className="text-white/90 font-bold">
                                {currency}{displayPrice}
                              </p>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    }
                    )}
                  </ProductCarouselRow>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center items-center md:px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div
              layoutId={`product-card-container-santa-${selectedProduct._id}`}
              className="relative w-full h-[85vh] md:h-[85vh] md:w-[90vw] md:max-w-6xl bg-white rounded-t-[20px] md:rounded-[10px] overflow-hidden shadow-2xl flex flex-col z-[110]"
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm transition-all shadow-sm"
              >
                <X className="w-6 h-6 text-slate-900" />
              </button>

              {(() => {
                const { displayPrice, currency, countryCodeValue }: any = getDisplayPrice(selectedProduct.pricing, countryCode);

                return <>
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image Section */}
                    <div
                      ref={popupImageContainerRef}
                      className="w-full h-[35vh] md:h-auto md:w-3/5 bg-slate-100 relative overflow-hidden cursor-crosshair group shrink-0"
                      onMouseEnter={() => !isMobileWidth && setIsHoveringPopup(true)}
                      onMouseLeave={() => setIsHoveringPopup(false)}
                      onMouseMove={handlePopupMouseMove}
                    >
                      <motion.div
                        layoutId={`product-image-container-santa-${selectedProduct._id}`}
                        className="relative w-full h-full"
                        style={{ borderRadius: "0px" }}
                      >
                        <Image
                          src={selectedProduct.image || '/placeholder.png'}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      </motion.div>

                      {!isMobileWidth && isHoveringPopup && (
                        <MagnifierLens
                          mouseX={mouseX} mouseY={mouseY}
                          imageSrc={selectedProduct.image}
                          containerWidth={popupImageContainerRef.current?.offsetWidth || 0}
                          containerHeight={popupImageContainerRef.current?.offsetHeight || 0}
                        />
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/5 flex flex-col bg-white h-full p-6 md:p-12 overflow-y-auto">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-[10px]">
                          {selectedProduct.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          {/* <Package className="w-4 h-4" /> Ages {selectedProduct.age || '8'}+ */}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 text-slate-900 leading-tight">
                        {selectedProduct.name}
                      </h2>

                      <div className="flex items-center gap-5 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-slate-100">
                        <span className="text-3xl md:text-4xl font-black text-slate-900">
                          {currency}{displayPrice}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-yellow-50 border border-yellow-100">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          {/* <span className="text-yellow-700 font-bold text-lg">{selectedProduct.rating || '4.8'}</span> */}
                        </div>
                      </div>

                      <div className="space-y-6 flex-1">
                        <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm tracking-widest">
                          <Brain className="w-5 h-5 text-blue-500" /> Learning Outcomes
                        </h4>
                        {/* {(selectedProduct.outcomes || ["Critical Thinking", "Problem Solving", "Creativity"]).map((outcome, idx) => (
                          <div key={idx + 'outcome'} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-[10px] border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            {outcome}
                          </div> */}
                        {/* ))} */}
                      </div>

                      <Button
                        className="w-full py-6 md:py-8 mt-6 md:mt-8 text-lg md:text-xl rounded-[10px] font-black bg-slate-900 text-white hover:bg-blue-600 shadow-xl transition-all"
                        onClick={(e) => handleAddToCart(e, selectedProduct, '')}
                        disabled={cartLoading}
                      >
                        Add to Cart — {currency}{displayPrice}
                      </Button>
                    </div>
                  </div>
                </>
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SantaShop;
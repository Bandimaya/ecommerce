"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X, ChevronRight, Star, ShoppingCart,
  Package, Brain, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  MotionValue
} from "framer-motion";
import Image from "next/image";
import {apiFetch} from "@/lib/axios";

// --- DATA IMPORT ---
import { stemResults, StemProduct } from "../../lib/Data";

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
// MAIN SHOP COMPONENT
// ----------------------------------------------------------------------

const SantaShop = () => {
  const [selectedProduct, setSelectedProduct] = useState<StemProduct | null>(null);
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [data, setData] = useState([])

  useEffect(() => {
    apiFetch('/products')
    // .then((res)=> setData(res.filter((item: any) => item.is_stemp===true)) )
    .then((res)=> setData(res) )
    .catch((err)=> console.log(err) )
  }, [])

  const popupImageContainerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobileWidth(window.innerWidth < 768);
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

  const { addToCart, loading: cartLoading } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: StemProduct) => {
    e.stopPropagation();
    addToCart({
      productId: String(product.id),
      name: product.title,
      price: Number(product.price || 0),
      image: product.image,
      currency: 'USD',
    }, 1);
    toast({ title: 'Added to cart', description: `${product.title} added to cart` });
  };

  const handlePopupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupImageContainerRef.current || isMobileWidth) return;
    const rect = popupImageContainerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 md:py-20 relative z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-4">
            <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">STEM Curriculum</span>
            <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-center text-slate-900">
            Our DIY <span className="text-blue-600">KITS</span>
          </h1>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-24">
          {data.map((product) => (
            <motion.div
              key={product._id+'stempark'}
              layoutId={`product-card-container-${product._id}+stempark`}
              className="relative h-[400px] w-full group cursor-pointer perspective-1000"
              initial="rest"
              whileHover={isMobileWidth || isModalOpen || isAnimating ? undefined : "hover"}
              onClick={() => !isModalOpen && !isAnimating && setSelectedProduct(product)}
            >
              {/* CARD BASE (Fixed 10px radius) */}
              <motion.div
                className="absolute inset-0 top-12 rounded-[10px] border bg-white shadow-lg overflow-hidden"
                variants={{
                  rest: { opacity: 0, y: 20 },
                  hover: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  <motion.div
                    className="space-y-4"
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
                        <h3 className="text-xl font-bold leading-tight text-slate-900">{product.title}</h3>
                      </div>
                      <span className="text-xl font-black text-slate-900">{product.price}</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 flex items-center">
                        View Details <ChevronRight className="ml-1 w-3 h-3" />
                      </span>
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-[10px] bg-blue-600 hover:bg-slate-900 transition-colors shadow-md"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={cartLoading}
                      >
                        {cartLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ShoppingCart className="w-4 h-4 text-white" />}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* FLOATING IMAGE (Fixed Centering logic + 10px Radius) */}
              <motion.div
                layoutId={`product-image-container-${product._id}`}
                key={product._id+'image+stempark'}
                className="absolute z-30 overflow-hidden shadow-xl bg-white"
                variants={{
                  rest: {
                    top: 0,
                    left: 0,
                    right: 0,
                    margin: "0 auto", // Center without transforms
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px", // 10px Radius
                    y: 48,
                    scale: 1,
                  },
                  hover: {
                    top: -20, // Gentle pop up
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                    width: "240px",
                    height: "240px",
                    borderRadius: "10px", // 10px Radius
                    y: 0,
                    scale: 1.05,
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 260, // Smoother physics
                  damping: 20
                }}
                style={{ willChange: 'transform, width, height' }}
              >
                <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                  {/* <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover object-center"
                  /> */}

                  {/* Overlay Gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent pointer-events-none"
                    variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
                  />

                  {/* Initial Card Text (Visible only on rest) */}
                  <motion.div
                    className="absolute bottom-8 left-8 text-white pointer-events-none"
                    variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 } }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">{product.category}</p>
                    <h3 className="text-2xl font-black">{product.title}</h3>
                    <p className="text-white/80 font-bold">{product.price}</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-start items-center pt-24 md:pt-0 md:justify-center">
            
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
              onClick={() => setSelectedProduct(null)}
            />

            {/* MODAL CONTENT CARD */}
            <motion.div
              layoutId={`product-card-container-${selectedProduct.id}`}
              className="relative w-full h-full md:h-[85vh] sm:w-[90vw] md:max-w-6xl bg-white rounded-t-[10px] md:rounded-[10px] overflow-hidden shadow-2xl flex flex-col z-[110]"
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-8 right-8 z-50 p-3 rounded-[10px] bg-slate-100 hover:bg-slate-200 transition-all shadow-sm"
              >
                <X className="w-6 h-6 text-slate-900" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div
                  ref={popupImageContainerRef}
                  className="w-full h-[40vh] md:h-auto md:w-3/5 bg-slate-50 relative overflow-hidden cursor-crosshair group"
                  onMouseEnter={() => !isMobileWidth && setIsHoveringPopup(true)}
                  onMouseLeave={() => setIsHoveringPopup(false)}
                  onMouseMove={handlePopupMouseMove}
                >
                  <motion.div
                    layoutId={`product-image-container-${selectedProduct.id}`}
                    className="relative w-full h-full"
                    style={{ 
                        borderRadius: "0px", // Reset for full bleed inside modal
                        width: "100%", 
                        height: "100%", 
                        top: 0, 
                        left: 0,
                        right: 0,
                        margin: "0",
                        y: 0 
                    }}
                  >
                    <Image src={selectedProduct.image} alt={selectedProduct.title} fill className="object-cover" />
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
                <div className="w-full md:w-2/5 flex flex-col bg-white h-full p-8 sm:p-12 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-[10px]">
                      {selectedProduct.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Package className="w-4 h-4" /> Ages {selectedProduct.age}+
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">{selectedProduct.title}</h2>
                  <div className="flex items-center gap-5 mb-10 pb-10 border-b border-slate-100">
                    <span className="text-4xl font-black text-slate-900">{selectedProduct.price}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-yellow-50 border border-yellow-100">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-yellow-700 font-bold text-lg">{selectedProduct.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-6 flex-1">
                    <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm tracking-widest">
                      <Brain className="w-5 h-5 text-blue-500" /> Learning Outcomes
                    </h4>
                    {selectedProduct.outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-[10px] border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full py-8 mt-8 text-xl rounded-[10px] font-black bg-slate-900 text-white hover:bg-blue-600 shadow-xl transition-all">
                    Add to Cart — {selectedProduct.price}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SantaShop;
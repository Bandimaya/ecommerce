"use client"

import { useState, useMemo, useEffect, useRef } from "react";
import {
    Search, X, ChevronRight, ChevronLeft,
    PackageSearch, ShoppingCart, Loader2,
    Package, Brain, Star, ArrowRight,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getDisplayPrice } from "@/lib/utils";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    useSpring,
    MotionValue,
    Transition
} from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { useSettings } from "@/contexts/SettingsContext";
import { CURRENCY_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------
// CONFIG: Animation Physics
// ----------------------------------------------------------------------
const SMOOTH_SPRING: Transition = {
    type: "spring",
    stiffness: 160,
    damping: 25,
    mass: 1
};

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
    const lensSize = 160;
    const zoomLevel = 2.5;

    const smoothX = useSpring(mouseX, { stiffness: 200, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 200, damping: 30 });

    const lensX = useTransform(smoothX, (m) => m - lensSize / 2);
    const lensY = useTransform(smoothY, (m) => m - lensSize / 2);

    const bgX = useTransform(smoothX, [0, containerWidth], ["0%", "100%"], { clamp: true });
    const bgY = useTransform(smoothY, [0, containerHeight], ["0%", "100%"], { clamp: true });

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
                boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
                x: lensX, y: lensY,
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
};

// ----------------------------------------------------------------------
// COMPONENT: Product Carousel Row (Handles 10 items per row + Navigation)
// ----------------------------------------------------------------------
const ProductCarouselRow = ({ children, rowIndex }: { children: React.ReactNode, rowIndex: number }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!rowRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        
        // Use Math.ceil to handle fractional pixels from browser zooming
        const isAtStart = scrollLeft <= 1; // 1px buffer
        const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1;

        setCanScrollLeft(!isAtStart);
        setCanScrollRight(!isAtEnd);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Check after a short delay to allow images/layout to settle
        const timeout = setTimeout(checkScroll, 500);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeout);
        };
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (!rowRef.current) return;
        const scrollAmount = rowRef.current.clientWidth * 0.75; // Scroll 75% of view width
        rowRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        // Check scroll buttons after animation
        setTimeout(checkScroll, 400); 
    };

    return (
        <div className="relative group/row">
            {/* Row Label (Optional) */}
            {rowIndex > 0 && (
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 pl-1">Page {rowIndex + 1}</div>
            )}

            {/* Left Button - High Z-Index & Disabled Logic */}
            <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 z-50 w-12 h-12 -ml-6", // Positioned half-out
                    "bg-white border border-slate-200 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
                    "flex",
                    !canScrollLeft ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100 hover:bg-slate-900 hover:text-white"
                )}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scroll Container */}
            <div
                ref={rowRef}
                onScroll={checkScroll}
                className="flex items-stretch gap-4 md:gap-6 overflow-x-auto overflow-y-hidden pb-8 pt-4 -mx-4 px-4 md:-mx-12 md:px-12 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>

            {/* Right Button - High Z-Index & Disabled Logic */}
            <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 z-50 w-12 h-12 -mr-6", // Positioned half-out
                    "bg-white border border-slate-200 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
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
// MAIN SHOP COMPONENT
// ----------------------------------------------------------------------

const Shop = () => {
    // --- STATE ---
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Category Menu State
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    // Animation/Modal State
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useRouter();

    const [popupDims, setPopupDims] = useState({ width: 0, height: 0 });
    const [isMobileWidth, setIsMobileWidth] = useState(false);
    const { addToCart, loading: cartLoading } = useCart();

    // Refs & Motion Values
    const popupImageContainerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const { countryCode } = useSettings();

    useEffect(() => {
        setLoading(true);
        apiFetch('/categories').then(setCategories).catch(() => { });
        apiFetch('/products').then(setProducts).catch(() => { }).finally(() => setLoading(false));
    }, [])

    useEffect(() => {
        const checkMobile = () => setIsMobileWidth(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
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

    useEffect(() => {
        if (selectedProduct) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }, [selectedProduct]);

    const isMobile = isMobileWidth;

    // --- HANDLERS ---
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
            toast({ title: 'Added to cart', description: `${product.name} added to cart`, className: "bg-emerald-600 text-white border-none" });
        } else {
            navigate.push(`/product/${product.slug}`);
        }
    };

    const handlePopupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!popupImageContainerRef.current || isMobile) return;
        const rect = popupImageContainerRef.current.getBoundingClientRect();
        if (rect.width !== popupDims.width || rect.height !== popupDims.height) {
            setPopupDims({ width: rect.width, height: rect.height });
        }
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handlePopupMouseEnter = () => {
        if (isMobile || !popupImageContainerRef.current || isModalOpen) return;
        const rect = popupImageContainerRef.current.getBoundingClientRect();
        setPopupDims({ width: rect.width, height: rect.height });
        setIsHoveringPopup(true);
    };

    // --- FILTERING ---
    const filteredProducts = useMemo(() => {
        return products.filter((product: any) => {
            const matchesCategory = selectedCategory === "all" || product?.categories?.some((cat: any) => cat._id === selectedCategory);
            const matchesSearch = product?.name?.toLowerCase().includes(searchQuery?.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);


    return (
        <div className="h-auto bg-[var(--background)] text-[var(--foreground)] font-sans relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

            <div className="w-full max-w-[2000px] mx-auto px-4 md:px-12 py-8 relative z-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="sticky top-[60px] md:top-[80px] z-40 mb-6 md:mb-10 -mx-4 px-4 md:-mx-12 md:px-12 py-2 md:py-4 bg-[var(--background)]/95 backdrop-blur-md transition-all rounded-b-2xl md:rounded-none shadow-sm md:shadow-none">
                    
                    {/* Search & Controls */}
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                        <div className="bg-[var(--background)] border border-[var(--border)] p-1.5 md:p-2 rounded-[12px] shadow-sm flex items-center gap-2 md:gap-4 w-full">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[var(--muted-foreground)]" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent pl-10 pr-4 py-2 md:py-3 text-sm md:text-base outline-none text-[var(--foreground)] placeholder:text-slate-400"
                                />
                            </div>
                            
                            {/* Product Count Separator (Desktop) */}
                            <div className="hidden md:flex items-center gap-2 px-6 border-l border-[var(--border)] h-8 shrink-0">
                                <span className="text-sm font-bold text-[var(--muted-foreground)]">{filteredProducts.length} Products</span>
                            </div>
                            
                            {/* Filter Toggle Button (Desktop & Mobile) */}
                            <button 
                                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-[8px] transition-colors shrink-0",
                                    "md:ml-0", // No extra margin needed due to flex gap
                                    isCategoryMenuOpen ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                )}
                            >
                                {isCategoryMenuOpen ? <X className="w-5 h-5"/> : <Filter className="w-5 h-5"/>}
                            </button>
                        </div>

                        {/* Collapsible Menu Container */}
                        <AnimatePresence>
                            {isCategoryMenuOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    {/* DESKTOP LAYOUT (Flex Wrap) */}
                                    <div className="hidden md:block">
                                        <div className="w-full h-px bg-[var(--border)] my-4 opacity-50" />
                                        <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
                                            <CategoryButton
                                                active={selectedCategory === "all"}
                                                onClick={() => setSelectedCategory("all")}
                                                label="All Products"
                                                count={products.length}
                                            />
                                            {categories.map((category: any) => (
                                                <CategoryButton
                                                    key={category._id}
                                                    active={selectedCategory === category._id}
                                                    onClick={() => setSelectedCategory(category._id)}
                                                    label={category.title}
                                                    count={products.filter((p: any) => p.categories?.some((c: any) => c._id === category._id)).length}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* MOBILE LAYOUT (Grid) */}
                                    <div className="md:hidden">
                                        <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                                            <CategoryButtonMobile
                                                active={selectedCategory === "all"}
                                                onClick={() => { setSelectedCategory("all"); setIsCategoryMenuOpen(false); }}
                                                label="All"
                                                count={products.length}
                                            />
                                            {categories.map((category: any) => (
                                                <CategoryButtonMobile
                                                    key={category._id}
                                                    active={selectedCategory === category._id}
                                                    onClick={() => { setSelectedCategory(category._id); setIsCategoryMenuOpen(false); }}
                                                    label={category.title}
                                                    count={products.filter((p: any) => p.categories?.some((c: any) => c._id === category._id)).length}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-center text-xs text-slate-400 pb-2 border-b border-dashed border-slate-200">
                                            Showing {filteredProducts.length} results
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <main className="min-w-0 pb-20">
                    <div className="space-y-16">
                        {loading ? (
                             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" /></div>
                        ) : filteredProducts.length > 0 ? (
                            categories.map((category: any) => {
                                // Filter products for this specific category section
                                const categoryProducts = filteredProducts.filter(product => product.categories?.some((c: any) => c._id === category._id));
                                
                                // Don't render empty category sections
                                if (categoryProducts.length === 0) return null;

                                // Only render this section if "All" is selected OR this specific category is selected
                                if(selectedCategory !== "all" && selectedCategory !== category._id) return null;

                                // --- CHUNK THE PRODUCTS INTO GROUPS OF 10 ---
                                const productChunks = chunkArray(categoryProducts, 10);

                                return (
                                    <div key={category._id + 'maincategoryproduct'} className="space-y-6 md:space-y-8">
                                            
                                            {/* SECTION HEADER */}
                                            <div className="flex items-center justify-between border-b border-dashed border-[var(--border)] pb-4 md:pb-6">
                                                <h3 className="text-xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">{category.title}</h3>
                                                
                                                {selectedCategory === "all" && (
                                                     <Button 
                                                        variant="ghost" 
                                                        onClick={() => { setSelectedCategory(category._id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        className="group flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold text-[var(--muted-foreground)] hover:text-blue-600 hover:bg-blue-50 transition-all rounded-[10px] px-2 md:px-4"
                                                     >
                                                        <span className="hidden md:inline">View all</span> {categoryProducts.length}
                                                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                                                     </Button>
                                                )}
                                            </div>

                                            {/* ITERATE OVER CHUNKS (ROWS OF 10) */}
                                            <div className="space-y-12 px-10">
                                                {productChunks.map((chunk: any[], chunkIndex: number) => (
                                                    <ProductCarouselRow key={`${category._id}-chunk-${chunkIndex}`} rowIndex={chunkIndex}>
                                                        {chunk.map((product: any) => {
                                                            const displayImage = product.media?.[0]?.url || '/placeholder.png';
                                                            const { displayPrice, currency }: any = getDisplayPrice(product.pricing, countryCode);
                                                            const displayCategory = product.categories?.[0]?.title || "Item";

                                                            return (
                                                                <motion.div
                                                                    key={product._id + "sub" + category._id}
                                                                    layoutId={`product-card-container-${product._id}`}
                                                                    className="relative group cursor-pointer perspective-1000 flex-shrink-0 w-[260px] md:w-[320px] snap-start"
                                                                    initial="rest"
                                                                    whileHover={isMobile || isModalOpen ? undefined : "hover"}
                                                                    animate={selectedProduct?._id === product._id ? "selected" : "rest"}
                                                                    variants={{ rest: {}, hover: {}, selected: { scale: 1 } }}
                                                                    onClick={() => !isModalOpen && setSelectedProduct(product)}
                                                                >
                                                                    <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full">
                                                                        
                                                                        <motion.div
                                                                            className="absolute inset-0 top-0 md:top-12 rounded-[12px] border bg-white shadow-sm group-hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                                                                            variants={{ rest: { opacity: 0, y: 15 }, hover: { opacity: 1, y: 0 } }}
                                                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                                                        >
                                                                            <div className="mt-auto p-4 md:p-6 space-y-2 md:space-y-4 z-10 bg-white">
                                                                                 <motion.div
                                                                                    initial={false}
                                                                                    variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                                                                                 >
                                                                                     <div className="flex justify-between items-start">
                                                                                        <div>
                                                                                            <p className="text-[9px] md:text-[10px] font-black uppercase text-blue-600 mb-0.5 md:mb-1">{displayCategory}</p>
                                                                                            <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-2">{product.name}</h3>
                                                                                        </div>
                                                                                        <span className="text-lg font-black text-slate-900 ml-2">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</span>
                                                                                     </div>
                                                                                     
                                                                                     <div className="pt-3 md:pt-4 border-t border-slate-100 flex justify-between items-center mt-2">
                                                                                        <span className="text-xs font-bold text-slate-400 flex items-center">Details <ChevronRight className="ml-1 w-3 h-3" /></span>
                                                                                        <Button size="icon" className="h-8 w-8 rounded-[10px] bg-blue-600 hover:bg-slate-900 shadow-md" onClick={(e) => handleAddToCart(e, product)} disabled={cartLoading}>
                                                                                                {cartLoading ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <ShoppingCart className="w-3 h-3 text-white" />}
                                                                                        </Button>
                                                                                     </div>
                                                                                 </motion.div>
                                                                            </div>
                                                                        </motion.div>

                                                                        <motion.div
                                                                            layoutId={`product-image-container-${product._id}`}
                                                                            className="absolute z-30 overflow-hidden shadow-md group-hover:shadow-2xl bg-white"
                                                                            variants={{
                                                                                rest: {
                                                                                    top: 0, left: 0, right: 0, margin: "0 auto",
                                                                                    width: "100%", height: "100%",
                                                                                    borderRadius: "12px",
                                                                                    y: isMobile ? 0 : 48,
                                                                                    scale: 1,
                                                                                },
                                                                                hover: {
                                                                                    top: -20, left: 0, right: 0, margin: "0 auto",
                                                                                    width: "200px", height: "200px",
                                                                                    borderRadius: "12px",
                                                                                    y: 0, scale: 1.05,
                                                                                },
                                                                                selected: {
                                                                                    width: "100%", height: "100%",
                                                                                    borderRadius: "0px",
                                                                                    y: 0, scale: 1,
                                                                                    left: 0, right: 0, margin: "0"
                                                                                }
                                                                            }}
                                                                            transition={SMOOTH_SPRING}
                                                                            style={{ willChange: 'transform, width, height' }}
                                                                        >
                                                                            <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                                                                                <img src={displayImage} alt={product.name} className="object-cover object-center w-full h-full" />
                                                                                
                                                                                <motion.div
                                                                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none md:from-black/70 md:via-black/0"
                                                                                    variants={{ rest: { opacity: 1 }, hover: { opacity: 0 }, selected: { opacity: 0 } }}
                                                                                />
                                                                                
                                                                                <motion.div
                                                                                    className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white pointer-events-none pr-4"
                                                                                    variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 }, selected: { opacity: 0 } }}
                                                                                >
                                                                                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-0.5 md:mb-1">{displayCategory}</p>
                                                                                    <h3 className="text-lg md:text-xl font-black leading-tight line-clamp-2">{product.name}</h3>
                                                                                    <p className="text-white/80 font-bold mt-1 text-sm">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</p>
                                                                                </motion.div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </div>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </ProductCarouselRow>
                                                ))}
                                            </div>
                                    </div>
                                )
                            })
                        ) : (
                            <EmptyState resetFilters={() => { setSearchQuery(""); setSelectedCategory("all"); }} />
                        )}
                    </div>
                </main>
            </div>

            {/* --- PRODUCT DETAIL MODAL --- */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-start justify-center pointer-events-none pt-0 md:pt-24 pb-0 md:pb-4 px-0 md:px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md pointer-events-auto"
                            onClick={() => setSelectedProduct(null)}
                        />

                        <motion.div
                            key="modal-card"
                            layoutId={`product-card-container-${selectedProduct._id}`}
                            className="relative w-full h-[90vh] md:h-full md:max-h-full sm:w-[90vw] md:max-w-6xl bg-white rounded-t-[20px] md:rounded-[10px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto z-[110]"
                            onClick={(e) => e.stopPropagation()}
                            transition={SMOOTH_SPRING}
                            drag={isMobile ? "y" : false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                if (offset.y > 100 || velocity.y > 500) {
                                    setSelectedProduct(null);
                                }
                            }}
                        >
                            {/* Mobile Drag Handle */}
                            <div className="md:hidden absolute top-0 left-0 right-0 h-6 z-50 flex justify-center items-center pointer-events-none">
                                <div className="w-12 h-1.5 rounded-full bg-slate-300/50 mt-2" />
                            </div>

                            <button onClick={() => setSelectedProduct(null)} className="hidden md:block absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 rounded-[10px] bg-slate-100 hover:bg-slate-200 transition-all shadow-sm">
                                <X className="w-6 h-6 text-slate-900" />
                            </button>
                             
                            {/* Mobile Close Button */}
                             <button onClick={() => setSelectedProduct(null)} className="md:hidden absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
                                <div
                                    ref={popupImageContainerRef}
                                    className="w-full h-[40vh] md:h-auto md:w-3/5 bg-slate-50 relative overflow-hidden cursor-crosshair flex-shrink-0 group"
                                    onMouseEnter={handlePopupMouseEnter} onMouseLeave={() => setIsHoveringPopup(false)} onMouseMove={handlePopupMouseMove}
                                >
                                    <motion.div
                                        layoutId={`product-image-container-${selectedProduct._id}`}
                                        className="relative w-full h-full z-20 pointer-events-none"
                                        initial={false}
                                        animate={{ width: "100%", height: "100%", borderRadius: "0px", y: 0, scale: 1, left: 0, right: 0, margin: "0" }}
                                        transition={SMOOTH_SPRING}
                                    >
                                        <img src={selectedProduct.media?.[0]?.url || '/placeholder.png'} alt={selectedProduct.name} className="object-cover object-center w-full h-full" />
                                    </motion.div>
                                    {!isMobile && (
                                        <AnimatePresence>
                                            {isHoveringPopup && popupDims.width > 0 && (
                                                <MagnifierLens mouseX={mouseX} mouseY={mouseY} imageSrc={selectedProduct.media?.[0]?.url || '/placeholder.png'} containerWidth={popupDims.width} containerHeight={popupDims.height} />
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>

                                <div className="w-full md:w-2/5 flex flex-col bg-white min-h-[50vh] md:h-full">
                                    <div className="flex-1 overflow-y-auto p-6 md:p-12">
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                            <div className="flex items-center gap-3 mb-4 md:mb-8">
                                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 md:px-4 py-1.5 rounded-[10px]">{selectedProduct.categories?.[0]?.title || "Product"}</span>
                                                <span className="text-[10px] md:text-xs font-bold text-slate-500 flex items-center gap-1.5"><Package className="w-4 h-4" /> Ages 8+</span>
                                            </div>
                                            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-6 text-slate-900 leading-none tracking-tight">{selectedProduct.name}</h2>
                                            <div className="flex items-center gap-5 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-slate-100">
                                                <span className="text-3xl md:text-4xl font-black text-slate-900">${selectedProduct.pricing?.[0]?.salePrice || 0}</span>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-yellow-50 border border-yellow-100">
                                                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                                                    <span className="text-yellow-700 font-bold text-base md:text-lg">4.9</span>
                                                </div>
                                            </div>
                                            <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
                                                <div>
                                                    <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase text-xs md:text-sm tracking-widest"><Brain className="w-5 h-5 text-blue-500" /> Learning Outcomes</h4>
                                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                                        {["Problem-solving skills", "Critical thinking", "Engineering principles", "Hands-on learning"].map((outcome, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 text-xs md:text-sm font-bold text-slate-600 bg-slate-50 p-3 md:p-4 rounded-[10px] border border-slate-100">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />{outcome}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="p-4 md:p-12 border-t border-slate-100 bg-white z-10 sticky bottom-0 md:relative shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none">
                                        <Button onClick={(e) => handleAddToCart(e, selectedProduct)} className="w-full py-6 md:py-8 text-lg md:text-xl rounded-[10px] font-black bg-slate-900 text-white shadow-2xl hover:bg-blue-600 transition-all active:scale-[0.98]">
                                            Add to Cart — ${selectedProduct.pricing?.[0]?.salePrice || 0}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- SUB COMPONENTS ---

const CategoryButton = ({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-[12px] text-sm font-bold transition-all whitespace-nowrap border active:scale-95",
            active 
                ? "bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-slate-900 ring-offset-2" 
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
        )}
    >
        {label}
        <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-[6px] transition-colors font-extrabold", 
            active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-500"
        )}>
            {count}
        </span>
    </button>
);

const CategoryButtonMobile = ({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-col items-center justify-center gap-1 p-3 rounded-[10px] text-xs font-bold transition-all border active:scale-95",
            active 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-600 border-slate-200"
        )}
    >
        <span>{label}</span>
        <span className={cn(
            "text-[9px] px-1.5 py-0.5 rounded-[4px] font-extrabold opacity-80", 
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        )}>
            {count}
        </span>
    </button>
);

const EmptyState = ({ resetFilters }: { resetFilters: () => void }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--card)]/50 rounded-[10px] border border-dashed border-[var(--border)] col-span-full h-[300px] md:h-[400px]">
        <div className="w-16 h-16 rounded-[10px] bg-[var(--muted)] flex items-center justify-center mb-6"><PackageSearch className="w-8 h-8 text-[var(--muted-foreground)]" /></div>
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No products found</h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs mb-8">We couldn't find any products matching your current filters.</p>
        <Button onClick={resetFilters} variant="outline" className="rounded-[10px] border-[var(--border)] hover:bg-[var(--muted)] px-8">Clear Filters</Button>
    </motion.div>
);

export default Shop;
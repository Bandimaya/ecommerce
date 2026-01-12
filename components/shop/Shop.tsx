"use client"

import { useState, useMemo, useEffect, useRef } from "react";
import {
    Search, LayoutGrid, X, SlidersHorizontal, ChevronRight,
    PackageSearch, Sparkles, Filter, Star, ShoppingCart, Loader2,
    Tag, CheckCircle2, Package, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getDisplayPrice, returnWhatsappLink } from "@/lib/utils";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    useSpring,
    MotionValue,
    Transition // 1. IMPORT TRANSITION TYPE
} from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { useSettings } from "@/contexts/SettingsContext";
import { CURRENCY_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

// ----------------------------------------------------------------------
// CONFIG: Animation Physics
// ----------------------------------------------------------------------
// 2. FIXED TYPESCRIPT ERROR by strictly typing the object
const SMOOTH_SPRING: Transition = {
    type: "spring",
    stiffness: 160,
    damping: 25,
    mass: 1
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
// MAIN SHOP COMPONENT
// ----------------------------------------------------------------------

const Shop = () => {
    // --- STATE ---
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Animation/Modal State
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Removed isAnimating state usage for preventing clicks as it caused issues, 
    // relying on AnimatePresence mode="wait" instead.

    const navigate = useRouter();

    const [popupDims, setPopupDims] = useState({ width: 0, height: 0 });
    const [isMobileWidth, setIsMobileWidth] = useState(false);
    const { addToCart, loading: cartLoading } = useCart();

    // Refs & Motion Values
    const popupImageContainerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
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
        if (isMobileFiltersOpen || selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('resize', checkMobile);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileFiltersOpen, selectedProduct]);

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
    const { contact } = useSettings();

    const FilterContent = () => (
        <div className="space-y-10 pr-2">
            <div>
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-[var(--primary)]" /> Categories
                </h3>
                <div className="space-y-2">
                    <CategoryButton
                        active={selectedCategory === "all"}
                        onClick={() => { setSelectedCategory("all"); setIsMobileFiltersOpen(false); }}
                        label="All Products"
                        count={products.length}
                    />
                    {categories.map((category: any) => (
                        <CategoryButton
                            key={category._id}
                            active={selectedCategory === category._id}
                            onClick={() => { setSelectedCategory(category._id); setIsMobileFiltersOpen(false); }}
                            label={category.title}
                            count={products.filter((p: any) => p.categories?.some((c: any) => c._id === category._id)).length}
                        />
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[var(--primary)]" /> Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {["Arduino", "Raspberry Pi", "Motors", "Sensors", "IoT"].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-[var(--muted)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] text-[var(--muted-foreground)] text-[11px] font-semibold rounded-[10px] cursor-pointer transition-colors border border-transparent hover:border-[var(--primary)]/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="p-6 rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Bulk Orders</span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed mb-4">Equipping a classroom? Get specific curriculum kits.</p>
                    <Button
                        onClick={() => window.open(returnWhatsappLink(contact?.whatsapp_number, `Hello! I would like to buy bulk orders.`), "_blank", "noopener,noreferrer")}
                        size="sm" variant="secondary" className="w-full text-xs font-bold h-8 rounded-[10px]">Contact Sales</Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

            <div className="w-full max-w-[2000px] mx-auto px-6 md:px-12 py-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 2xl:gap-20">
                    <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-28">
                        <FilterContent />
                    </aside>

                    <main className="flex-1 min-w-0">
                        {/* Search Bar */}
                        <div className="sticky top-[70px] z-40 mb-10">
                            <div className="bg-[var(--background)]/80 backdrop-blur-2xl border border-[var(--border)] p-2 rounded-[10px] shadow-xl shadow-black/5 flex items-center gap-4">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                                    <input
                                        type="text"
                                        placeholder="Search components..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent pl-12 pr-4 py-3 text-base outline-none text-[var(--foreground)]"
                                    />
                                </div>
                                <Button onClick={() => setIsMobileFiltersOpen(true)} variant="ghost" size="sm" className="lg:hidden h-12 w-12 p-0 rounded-[10px]">
                                    <SlidersHorizontal className="w-6 h-6" />
                                </Button>
                                <div className="hidden sm:flex items-center gap-2 px-6 border-l border-[var(--border)] h-8">
                                    <span className="text-sm font-bold text-[var(--muted-foreground)]">{filteredProducts.length} Products</span>
                                </div>
                            </div>
                        </div>

                         <div className="space-y-2">
                    <CategoryButton
                        active={selectedCategory === "all"}
                        onClick={() => { setSelectedCategory("all"); setIsMobileFiltersOpen(false); }}
                        label="All Products"
                        count={products.length}
                    />
                    {categories.map((category: any) => (
                        <div key={category._id+'maincategoryproduct'}>
                            <CategoryButton
                                key={category._id}
                                active={selectedCategory === category._id}
                                onClick={() => { setSelectedCategory(category._id); setIsMobileFiltersOpen(false); }}
                                label={category.title}
                                count={products.filter((p: any) => p.categories?.some((c: any) => c._id === category._id)).length}
                            />
                            {filteredProducts.filter(product => product.categories?.some((c: any) => c._id === category._id)).map((product: any) => {
                                        const displayImage = product.media?.[0]?.url || '/placeholder.png';
                                        const { displayPrice, currency }: any = getDisplayPrice(product.pricing, countryCode);
                                        const displayCategory = product.categories?.[0]?.title || "Item";

                                        return (
                                            <motion.div
                                                key={product._id+"sub"+category._id}
                                                layoutId={`product-card-container-${product._id}`}
                                                className="relative h-[400px] w-full group cursor-pointer perspective-1000"
                                                initial="rest"
                                                whileHover={isMobile || isModalOpen ? undefined : "hover"}
                                                animate={selectedProduct?._id === product._id ? "selected" : "rest"}
                                                variants={{ rest: {}, hover: {}, selected: { scale: 1 } }}
                                                onClick={() => !isModalOpen && setSelectedProduct(product)}
                                            >
                                                {/* CARD BASE */}
                                                <motion.div
                                                    className="absolute inset-0 top-12 rounded-[10px] border bg-white shadow-lg overflow-hidden"
                                                    variants={{ rest: { opacity: 0, y: 15 }, hover: { opacity: 1, y: 0 } }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                >
                                                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                                                        <motion.div
                                                            className="mt-24 space-y-4"
                                                            variants={{ rest: { opacity: 0, y: 15 }, hover: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } } }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase text-blue-600 mb-1">{displayCategory}</p>
                                                                    <h3 className="text-xl font-bold leading-tight text-slate-900">{product.name}</h3>
                                                                </div>
                                                                <span className="text-xl font-black text-slate-900">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</span>
                                                            </div>
                                                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                                                <span className="text-xs font-bold text-slate-400 flex items-center">View Details <ChevronRight className="ml-1 w-3 h-3" /></span>
                                                                <Button size="icon" className="h-10 w-10 rounded-[10px] bg-blue-600 hover:bg-slate-900 shadow-md" onClick={(e) => handleAddToCart(e, product)} disabled={cartLoading}>
                                                                    {cartLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ShoppingCart className="w-4 h-4 text-white" />}
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>

                                                {/* FLOATING IMAGE */}
                                                <motion.div
                                                    layoutId={`product-image-container-${product._id}`}
                                                    className="absolute z-30 overflow-hidden shadow-xl bg-white"
                                                    variants={{
                                                        rest: {
                                                            top: 0, left: 0, right: 0, margin: "0 auto",
                                                            width: "100%", height: "100%",
                                                            borderRadius: "10px",
                                                            y: 48, scale: 1,
                                                        },
                                                        hover: {
                                                            top: -20, left: 0, right: 0, margin: "0 auto",
                                                            width: "240px", height: "240px",
                                                            borderRadius: "10px",
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
                                                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent pointer-events-none"
                                                            variants={{ rest: { opacity: 1 }, hover: { opacity: 0 }, selected: { opacity: 0 } }}
                                                        />
                                                        <motion.div
                                                            className="absolute bottom-8 left-8 text-white pointer-events-none"
                                                            variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 }, selected: { opacity: 0 } }}
                                                        >
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">{displayCategory}</p>
                                                            <h3 className="text-2xl font-black leading-tight">{product.name}</h3>
                                                            <p className="text-white/80 font-bold mt-1">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</p>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}

                        </div>
                    ))}
                </div>

                        {/* --- PRODUCT GRID --- */}
                        {/* <div className="min-h-[60vh]">
                            {loading ? (
                                <ProductGridSkeleton columns={3} count={9} />
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-24">
                                    {filteredProducts.map((product: any) => {
                                        const displayImage = product.media?.[0]?.url || '/placeholder.png';
                                        const { displayPrice, currency }: any = getDisplayPrice(product.pricing, countryCode);
                                        const displayCategory = product.categories?.[0]?.title || "Item";

                                        return (
                                            <motion.div
                                                key={product._id}
                                                layoutId={`product-card-container-${product._id}`}
                                                className="relative h-[400px] w-full group cursor-pointer perspective-1000"
                                                initial="rest"
                                                whileHover={isMobile || isModalOpen ? undefined : "hover"}
                                                animate={selectedProduct?._id === product._id ? "selected" : "rest"}
                                                variants={{ rest: {}, hover: {}, selected: { scale: 1 } }}
                                                onClick={() => !isModalOpen && setSelectedProduct(product)}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 top-12 rounded-[10px] border bg-white shadow-lg overflow-hidden"
                                                    variants={{ rest: { opacity: 0, y: 15 }, hover: { opacity: 1, y: 0 } }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                >
                                                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                                                        <motion.div
                                                            className="mt-24 space-y-4"
                                                            variants={{ rest: { opacity: 0, y: 15 }, hover: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } } }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase text-blue-600 mb-1">{displayCategory}</p>
                                                                    <h3 className="text-xl font-bold leading-tight text-slate-900">{product.name}</h3>
                                                                </div>
                                                                <span className="text-xl font-black text-slate-900">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</span>
                                                            </div>
                                                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                                                <span className="text-xs font-bold text-slate-400 flex items-center">View Details <ChevronRight className="ml-1 w-3 h-3" /></span>
                                                                <Button size="icon" className="h-10 w-10 rounded-[10px] bg-blue-600 hover:bg-slate-900 shadow-md" onClick={(e) => handleAddToCart(e, product)} disabled={cartLoading}>
                                                                    {cartLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ShoppingCart className="w-4 h-4 text-white" />}
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    layoutId={`product-image-container-${product._id}`}
                                                    className="absolute z-30 overflow-hidden shadow-xl bg-white"
                                                    variants={{
                                                        rest: {
                                                            top: 0, left: 0, right: 0, margin: "0 auto",
                                                            width: "100%", height: "100%",
                                                            borderRadius: "10px",
                                                            y: 48, scale: 1,
                                                        },
                                                        hover: {
                                                            top: -20, left: 0, right: 0, margin: "0 auto",
                                                            width: "240px", height: "240px",
                                                            borderRadius: "10px",
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
                                                            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent pointer-events-none"
                                                            variants={{ rest: { opacity: 1 }, hover: { opacity: 0 }, selected: { opacity: 0 } }}
                                                        />
                                                        <motion.div
                                                            className="absolute bottom-8 left-8 text-white pointer-events-none"
                                                            variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 20 }, selected: { opacity: 0 } }}
                                                        >
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">{displayCategory}</p>
                                                            <h3 className="text-2xl font-black leading-tight">{product.name}</h3>
                                                            <p className="text-white/80 font-bold mt-1">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</p>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyState resetFilters={() => { setSearchQuery(""); setSelectedCategory("all"); }} />
                            )}
                        </div> */}
                    </main>
                </div>
            </div>

            {/* --- FILTER DRAWER --- */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFiltersOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={SMOOTH_SPRING}
                            className="fixed inset-y-0 right-0 w-[85vw] max-w-[360px] bg-[var(--background)] border-l border-[var(--border)] z-[60] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                                <h2 className="font-bold text-lg flex items-center gap-2"><Filter className="w-5 h-5" /> Filters</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)} className="h-9 w-9 rounded-[10px] hover:bg-[var(--muted)]"><X className="w-5 h-5" /></Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6"><FilterContent /></div>
                            <div className="p-6 border-t border-[var(--border)] bg-[var(--muted)]/20">
                                <Button className="w-full rounded-[10px] py-6 font-bold text-sm shadow-lg" onClick={() => setIsMobileFiltersOpen(false)}>Show {filteredProducts.length} Results</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- PRODUCT DETAIL MODAL --- */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pointer-events-none pt-24 pb-4 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md pointer-events-auto"
                            onClick={() => setSelectedProduct(null)}
                        />

                        <motion.div
                            // 3. FIXED: ADDED KEY to prevent instant disappearing / confusing Framer
                            key="modal-card"
                            layoutId={`product-card-container-${selectedProduct._id}`}
                            className="relative w-full h-full max-h-full sm:w-[90vw] md:max-w-6xl bg-white rounded-[10px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto z-[110]"
                            onClick={(e) => e.stopPropagation()}
                            transition={SMOOTH_SPRING}
                        >
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 rounded-[10px] bg-slate-100 hover:bg-slate-200 transition-all shadow-sm">
                                <X className="w-6 h-6 text-slate-900" />
                            </button>

                            <div className="flex flex-col md:flex-row h-full">
                                <div
                                    ref={popupImageContainerRef}
                                    className="w-full h-[35vh] md:h-auto md:w-3/5 bg-slate-50 relative overflow-hidden cursor-crosshair flex-shrink-0 group"
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

                                <div className="w-full md:w-2/5 flex flex-col bg-white h-full overflow-hidden">
                                    <div className="flex-1 overflow-y-auto p-6 md:p-12">
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                                <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-[10px]">{selectedProduct.categories?.[0]?.title || "Product"}</span>
                                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Package className="w-4 h-4" /> Ages 8+</span>
                                            </div>
                                            <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 text-slate-900 leading-none tracking-tight">{selectedProduct.name}</h2>
                                            <div className="flex items-center gap-5 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-slate-100">
                                                <span className="text-3xl md:text-4xl font-black text-slate-900">${selectedProduct.pricing?.[0]?.salePrice || 0}</span>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-yellow-50 border border-yellow-100">
                                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                                    <span className="text-yellow-700 font-bold text-lg">4.9</span>
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <div>
                                                    <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 uppercase text-sm tracking-widest"><Brain className="w-5 h-5 text-blue-500" /> Learning Outcomes</h4>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {["Problem-solving skills", "Critical thinking", "Engineering principles", "Hands-on learning"].map((outcome, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-3 md:p-4 rounded-[10px] border border-slate-100">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />{outcome}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="p-6 md:p-12 border-t border-slate-100 bg-white z-10">
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
            "w-full text-left px-4 py-3.5 rounded-[10px] text-sm transition-all duration-200 flex items-center justify-between group",
            active ? "bg-[var(--foreground)] text-[var(--background)] font-bold shadow-lg" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
        )}
    >
        <span className="truncate pr-2">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
            <span className={cn("text-[10px] px-2 py-0.5 rounded-[5px] transition-colors font-bold", active ? "bg-[var(--background)]/20 text-[var(--background)]" : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--background)]")}>{count}</span>
            {active && <CheckCircle2 className="w-4 h-4 animate-in slide-in-from-left-2 fade-in" />}
        </div>
    </button>
);

const EmptyState = ({ resetFilters }: { resetFilters: () => void }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--card)]/50 rounded-[10px] border border-dashed border-[var(--border)] col-span-full h-[400px]">
        <div className="w-16 h-16 rounded-[10px] bg-[var(--muted)] flex items-center justify-center mb-6"><PackageSearch className="w-8 h-8 text-[var(--muted-foreground)]" /></div>
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No products found</h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs mb-8">We couldn't find any products matching your current filters.</p>
        <Button onClick={resetFilters} variant="outline" className="rounded-[10px] border-[var(--border)] hover:bg-[var(--muted)] px-8">Clear Filters</Button>
    </motion.div>
);

export default Shop;
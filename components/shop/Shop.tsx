"use client"

import { useState, useMemo, useEffect, useRef, use } from "react";
import {
    Search, LayoutGrid, X, SlidersHorizontal, ChevronRight,
    PackageSearch, Sparkles, Filter, Star, ShoppingCart, Loader2,
    Tag, CheckCircle2, Package, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getDisplayPrice } from "@/lib/utils";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    MotionValue
} from "framer-motion";
// --- Context Imports ---
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { MOCK_PRODUCTS_SHOP, MOCK_CATEGORIES } from "../../lib/Data";
import { apiFetch } from "@/lib/axios";
import { useSettings } from "@/contexts/SettingsContext";
import { CURRENCY_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

// ----------------------------------------------------------------------
// HELPER: Magnifier Lens (Fixed & Robust)
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
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useRouter();

    // Store exact dimensions for the lens
    const [popupDims, setPopupDims] = useState({ width: 0, height: 0 });

    const [isMobileWidth, setIsMobileWidth] = useState(false);

    // Contexts
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
        apiFetch('/categories')
            .then((res) => setCategories(res))
            .catch(() => { console.log("Categories fetch failed") })
        apiFetch('/products')
            .then((res) => setProducts(res))
            .catch(() => { console.log("Products fetch failed") })
            .finally(() => setLoading(false))
    }, [])

    // --- EFFECT: Mobile Check & Scroll Lock ---
    useEffect(() => {
        const checkMobile = () => setIsMobileWidth(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (isMobileFiltersOpen || selectedProduct) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isMobileFiltersOpen, selectedProduct]);

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

            toast({
                title: 'Added to cart',
                description: `${product.name} added to cart`,
                className: "bg-emerald-600 text-white border-none",
            });
        }
        else {
            navigate.push(`/shop/product/${product.slug}`);
        }
    };

    const handlePopupMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!popupImageContainerRef.current || isMobile) return;

        // Recalculate rect continuously for accuracy
        const rect = popupImageContainerRef.current.getBoundingClientRect();

        // Update state if dims change (rare, but good for safety)
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

    const handleCardMouseEnter = (e: React.MouseEvent, productId: string) => {
        if (isMobile || isModalOpen || selectedProduct || isAnimating) return;
    };

    const handleCardMouseLeave = () => {
        if (isMobile || isModalOpen || selectedProduct) return;
    };

    // --- FILTERING LOGIC ---
    const filteredProducts = useMemo(() => {
        return products.filter((product: any) => {
            const matchesCategory =
                selectedCategory === "all" ||
                product?.categories?.some((cat: any) => cat._id === selectedCategory);

            const matchesSearch = product?.name
                ?.toLowerCase()
                .includes(searchQuery?.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    // --- SIDEBAR COMPONENT ---
    const FilterContent = () => (
        <div className="space-y-10 pr-2">
            {/* 1. Categories */}
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
                            count={products.filter((p: any) => p.categories?.some((c: any) => {
                                console.log(products.filter((p: any) => p.categories?.some((c: any) => {
                                    console.log
                                    return c._id === category._id
                                })), category)
                                return c._id === category._id
                            })).length}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Visual Price Range */}
            <div>
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">
                    Price Range
                </h3>
                <div className="px-1">
                    <div className="h-1.5 w-full bg-[var(--muted)] rounded-full relative mb-4">
                        <div className="absolute left-[10%] right-[30%] top-0 bottom-0 bg-[var(--primary)] rounded-full"></div>
                        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[var(--primary)] rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                        <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[var(--primary)] rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-[var(--foreground)]">
                        <span>$10</span>
                        <span>$500+</span>
                    </div>
                </div>
            </div>

            {/* 3. Popular Tags */}
            <div>
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[var(--primary)]" /> Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {["Arduino", "Raspberry Pi", "Motors", "Sensors", "IoT", "Wheels"].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-[var(--muted)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] text-[var(--muted-foreground)] text-[11px] font-semibold rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[var(--primary)]/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 4. Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Bulk Orders</span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed mb-4">
                        Equipping a classroom? Get specific curriculum kits.
                    </p>
                    <Button size="sm" variant="secondary" className="w-full text-xs font-bold h-8 rounded-lg">
                        Contact Sales
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans relative">

            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

            <div className="flex flex-col items-center mb-10 sm:mb-16">

                {/* TOP ROW: Lines and Title */}
                <div className="flex justify-center items-center gap-3">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] tracking-tight leading-[0.9] mb-0 text-center">
                            Engineering <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">The Future</span>
                        </h1>
                    </motion.div>

                    <motion.div initial={{ width: 0 }} whileInView={{ width: '48px' }} className="h-[2px] bg-primary" />
                </div>

                {/* BOTTOM ROW: Paragraph (Now on a new line with margin-top) */}
                <div className="mt-6 md:mt-8">
                    <p className="text-sm md:text-lg text-[var(--muted-foreground)] max-w-sm leading-relaxed border-l-2 border-[var(--primary)]/30 pl-4">
                        Premium robotics & drone components designed for the next generation of inventors.
                    </p>
                </div>

            </div>

            {/* --- MAIN LAYOUT --- */}
            <div className="w-full max-w-[2000px] mx-auto px-6 md:px-12 py-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 2xl:gap-20">

                    {/* --- SIDEBAR --- */}
                    <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-28">
                        <FilterContent />
                    </aside>

                    {/* --- CONTENT AREA --- */}
                    <main className="flex-1 min-w-0">
                        {/* Search Bar */}
                        <div className="sticky top-[70px] z-40 mb-10">
                            <div className="bg-[var(--background)]/80 backdrop-blur-2xl border border-[var(--border)] p-2 rounded-2xl shadow-xl shadow-black/5 flex items-center gap-4">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search components..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent pl-12 pr-4 py-3 text-base outline-none placeholder:text-[var(--muted-foreground)]/60 text-[var(--foreground)]"
                                    />
                                </div>
                                <Button
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden h-12 w-12 p-0 rounded-xl hover:bg-[var(--muted)]"
                                >
                                    <SlidersHorizontal className="w-6 h-6 text-[var(--foreground)]" />
                                </Button>
                                <div className="hidden sm:flex items-center gap-2 px-6 border-l border-[var(--border)] h-8">
                                    <span className="text-sm font-bold text-[var(--muted-foreground)] whitespace-nowrap">
                                        {filteredProducts.length} Products
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* --- PRODUCT GRID --- */}
                        <div className="min-h-[60vh]">
                            {loading ? (
                                <ProductGridSkeleton columns={3} count={9} />
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-24">
                                    {filteredProducts.map((product: any) => {
                                        const displayImage = product.media?.[0]?.url || '/placeholder.png';
                                        const { displayPrice, currency }: any = getDisplayPrice(
                                            product.pricing,
                                            countryCode
                                        );
                                        const displayCategory = product.categories?.[0]?.title || "Item";
                                        const outcomes = product.outcomes || [
                                            "Problem-solving skills",
                                            "Critical thinking",
                                            "Engineering principles",
                                            "Hands-on learning"
                                        ];

                                        return (
                                            <motion.div
                                                key={product._id}
                                                layoutId={`product-card-container-${product._id}`}
                                                className="relative h-[400px] w-full group cursor-pointer perspective-1000"
                                                initial="rest"
                                                whileHover={isMobile || isModalOpen || isAnimating ? undefined : "hover"}
                                                animate={selectedProduct?._id === product._id ? "selected" : "rest"}
                                                variants={{
                                                    rest: {},
                                                    hover: {},
                                                    selected: { scale: 1 }
                                                }}
                                                onClick={() => {
                                                    if (!isModalOpen && !isAnimating) {
                                                        setSelectedProduct(product);
                                                    }
                                                }}
                                                onMouseEnter={(e) => handleCardMouseEnter(e, product._id)}
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
                                                                        {displayCategory}
                                                                    </p>
                                                                    <h3 className="text-xl font-bold leading-tight text-slate-900">{product.name}</h3>
                                                                </div>
                                                                <span className="text-xl font-black text-slate-900">{CURRENCY_OPTIONS.find(c => c.code === currency)?.symbol}{displayPrice}</span>
                                                            </div>

                                                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                                                <span className="text-xs font-bold text-slate-400 flex items-center">
                                                                    View Details <ChevronRight className="ml-1 w-3 h-3" />
                                                                </span>
                                                                <Button
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-full bg-blue-600 hover:bg-slate-900 transition-colors shadow-md"
                                                                    onClick={(e) => handleAddToCart(e, product)}
                                                                    disabled={cartLoading}
                                                                >
                                                                    {cartLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ShoppingCart className="w-4 h-4 text-white" />}
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>

                                                {/* FLOATING IMAGE - Fixed to Center Top on Hover */}
                                                <motion.div
                                                    layoutId={`product-image-container-${product._id}`}
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
                                                            src={displayImage}
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
                        </div>
                    </main>
                </div>
            </div>

            {/* --- FILTER DRAWER --- */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85vw] max-w-[360px] bg-[var(--background)] border-l border-[var(--border)] z-[60] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <Filter className="w-5 h-5" /> Filters
                                </h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)} className="h-9 w-9 rounded-full hover:bg-[var(--muted)]">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6"><FilterContent /></div>
                            <div className="p-6 border-t border-[var(--border)] bg-[var(--muted)]/20">
                                <Button className="w-full rounded-xl py-6 font-bold text-sm shadow-lg" onClick={() => setIsMobileFiltersOpen(false)}>
                                    Show {filteredProducts.length} Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- PRODUCT DETAIL MODAL --- */}
            <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md pointer-events-auto"
                            onClick={() => setSelectedProduct(null)}
                        />

                        <motion.div
                            layoutId={`product-card-container-${selectedProduct._id}`}
                            className="relative w-full h-[100dvh] sm:h-[85vh] sm:w-[90vw] md:max-w-6xl bg-white sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col pointer-events-auto z-[110]"
                            onClick={(e) => e.stopPropagation()}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 20,
                                mass: 0.5
                            }}
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-8 right-8 z-50 p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-all shadow-sm"
                            >
                                <X className="w-6 h-6 text-slate-900" />
                            </button>

                            <div className="flex flex-col md:flex-row h-full">
                                {/* Image Section */}
                                <div
                                    ref={popupImageContainerRef}
                                    className="w-full h-[40vh] md:h-auto md:w-3/5 bg-slate-50 relative overflow-hidden cursor-crosshair flex-shrink-0 group"
                                    onMouseEnter={handlePopupMouseEnter}
                                    onMouseLeave={() => setIsHoveringPopup(false)}
                                    onMouseMove={handlePopupMouseMove}
                                >
                                    <motion.div
                                        layoutId={`product-image-container-${selectedProduct._id}`}
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
                                            src={selectedProduct.media?.[0]?.url || '/placeholder.png'}
                                            alt={selectedProduct.name}
                                            // fill
                                            // priority
                                            className="object-cover object-center"
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />
                                    </motion.div>

                                    {!isMobile && (
                                        <AnimatePresence>
                                            {isHoveringPopup && popupDims.width > 0 && (
                                                <MagnifierLens
                                                    mouseX={mouseX}
                                                    mouseY={mouseY}
                                                    imageSrc={selectedProduct.media?.[0]?.url || '/placeholder.png'}
                                                    containerWidth={popupDims.width}
                                                    containerHeight={popupDims.height}
                                                />
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="w-full md:w-2/5 flex flex-col bg-white h-full overflow-hidden">
                                    <div className="flex-1 overflow-y-auto p-8 sm:p-12 md:p-16">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex items-center gap-3 mb-8">
                                                <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                                                    {selectedProduct.categories?.[0]?.title || "Product"}
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
                                                    ${selectedProduct.pricing?.[0]?.salePrice || 0}
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
                                            onClick={(e) => handleAddToCart(e, selectedProduct)}
                                            className="w-full py-8 text-xl rounded-2xl font-black bg-slate-900 text-white shadow-2xl hover:bg-blue-600 transition-all active:scale-[0.98]"
                                        >
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
            "w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group",
            active
                ? "bg-[var(--foreground)] text-[var(--background)] font-bold shadow-lg"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
        )}
    >
        <span className="truncate pr-2">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
            <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-md transition-colors font-bold",
                active
                    ? "bg-[var(--background)]/20 text-[var(--background)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--background)]"
            )}>
                {count}
            </span>
            {active && <CheckCircle2 className="w-4 h-4 animate-in slide-in-from-left-2 fade-in" />}
        </div>
    </button>
);

const EmptyState = ({ resetFilters }: { resetFilters: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[var(--card)]/50 rounded-[2rem] border border-dashed border-[var(--border)] col-span-full h-[400px]"
    >
        <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-6">
            <PackageSearch className="w-8 h-8 text-[var(--muted-foreground)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No products found</h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs mb-8">
            We couldn't find any products matching your current filters.
        </p>
        <Button onClick={resetFilters} variant="outline" className="rounded-xl border-[var(--border)] hover:bg-[var(--muted)] px-8">
            Clear Filters
        </Button>
    </motion.div>
);

export default Shop;
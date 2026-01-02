"use client"
import { useState, useMemo, useEffect } from "react";
import { Search, LayoutGrid, X, SlidersHorizontal, ChevronRight, PackageSearch, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Shop = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    
    const products = useProducts();
    const categories = useCategories();

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isMobileFiltersOpen]);

    // Filtering Logic
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

    // Reusable Filter Content
    const FilterContent = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-[var(--primary)]" /> Categories
                </h3>
                <div className="space-y-1">
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

            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 border border-[var(--primary)]/10">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="text-[10px] font-bold text-[var(--accent)] uppercase">Did you know?</span>
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                    Our STEM kits are used in over 50 schools. Check out the bulk section.
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans relative">
            
            {/* Background Texture */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

            {/* --- COMPACT HERO SECTION --- */}
            {/* Reduced pt-24 to pt-20, pb-12 to pb-6 */}
            <section className="relative pt-20 pb-6 overflow-hidden border-b border-[var(--border)] bg-[var(--card)]/30">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider mb-2">
                                        <PackageSearch className="w-3 h-3" /> Catalog 2026
                                    </span>
                                    {/* Reduced text sizes: text-4xl -> text-3xl, md:text-6xl -> md:text-5xl */}
                                    <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tight leading-none mb-2 md:mb-0">
                                        Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">The Future</span>
                                    </h1>
                                </div>
                                {/* Moved description to align bottom for compact look */}
                                <p className="text-sm md:text-base text-[var(--muted-foreground)] max-w-sm leading-snug md:pb-1">
                                    Premium robotics & drone components for the next generation.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">

                    {/* --- Sidebar --- */}
                    <aside className="hidden lg:block w-60 shrink-0 space-y-6">
                        <div className="sticky top-20">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* --- Main Content --- */}
                    <main className="flex-1 min-w-0">
                        
                        {/* Compact Control Bar */}
                        <div className="sticky top-2 z-30 mb-6">
                            <div className="bg-[var(--background)]/80 backdrop-blur-xl border border-[var(--border)] p-1.5 rounded-xl shadow-sm flex items-center gap-2">
                                
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search catalog..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent pl-9 pr-4 py-2 text-sm outline-none placeholder:text-[var(--muted-foreground)]/70 text-[var(--foreground)]"
                                    />
                                </div>

                                <Button 
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    variant="ghost" 
                                    size="sm"
                                    className="lg:hidden h-9 w-9 p-0 rounded-lg hover:bg-[var(--muted)]"
                                >
                                    <SlidersHorizontal className="w-4 h-4 text-[var(--foreground)]" />
                                </Button>

                                <div className="hidden sm:flex items-center gap-2 px-3 border-l border-[var(--border)]">
                                    <span className="text-[11px] font-bold text-[var(--muted-foreground)] whitespace-nowrap">
                                        {filteredProducts.length} Results
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="min-h-[400px]">
                            {filteredProducts.length > 0 ? (
                                <motion.div 
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {filteredProducts.map((product: any) => (
                                            <motion.div
                                                layout
                                                key={product._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <EmptyState resetFilters={() => { setSearchQuery(""); setSelectedCategory("all"); }} />
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* --- Mobile Drawer (Unchanged Logic) --- */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[300px] sm:w-[360px] bg-[var(--background)] border-l border-[var(--border)] z-50 shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                                <h2 className="font-bold text-base flex items-center gap-2">
                                    <Filter className="w-4 h-4" /> Filters
                                </h2>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="h-8 w-8 rounded-full hover:bg-[var(--muted)]"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4">
                                <FilterContent />
                            </div>

                            <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]/20">
                                <Button 
                                    className="w-full rounded-lg py-5 font-bold text-sm"
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                >
                                    Show {filteredProducts.length} Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub Components ---

const CategoryButton = ({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group",
            active
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-md shadow-[var(--primary)]/20"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        )}
    >
        <span className="truncate pr-2">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
            <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md transition-colors",
                active
                    ? "bg-[var(--primary-foreground)]/20 text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--background)]"
            )}>
                {count}
            </span>
            {active && <ChevronRight className="w-3 h-3 animate-in slide-in-from-left-1" />}
        </div>
    </button>
);

const EmptyState = ({ resetFilters }: { resetFilters: () => void }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[var(--card)]/50 rounded-2xl border border-dashed border-[var(--border)]"
    >
        <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-4">
            <PackageSearch className="w-6 h-6 text-[var(--muted-foreground)]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">No products found</h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs mb-6">
            Try adjusting your search or category filters.
        </p>
        <Button onClick={resetFilters} variant="outline" size="sm" className="rounded-lg border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
            Clear All Filters
        </Button>
    </motion.div>
);

export default Shop;
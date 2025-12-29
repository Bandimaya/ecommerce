"use client"
import { useState, useMemo } from "react";
import { Search, Filter, XCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/contexts/ProductsContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { cn } from "@/lib/utils";

const Shop = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const products = useProducts();
    const categories = useCategories();

    // Optimized Filtering using useMemo
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

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Dynamic Header */}
            <section className="bg-white py-12 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <LayoutGrid className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">STEM Catalog</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        Explore STEM Kits
                    </h1>
                    <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
                        Curated robotics, drones, and electronics designed to spark curiosity and innovation.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Enhanced Sidebar */}
                    <aside className="lg:w-72 shrink-0">
                        <div className="sticky top-28 space-y-8">

                            {/* Search Group */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Search Catalog</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Type to search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>

                            {/* Category Group */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categories</label>
                                    {selectedCategory !== "all" && (
                                        <button
                                            onClick={() => setSelectedCategory("all")}
                                            className="text-[10px] font-bold text-primary hover:underline"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => setSelectedCategory("all")}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                            selectedCategory === "all"
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        All Products
                                    </button>

                                    {categories.map((category: any) => (
                                        <button
                                            key={category._id}
                                            onClick={() => setSelectedCategory(category._id)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                                                selectedCategory === category._id
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                    : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {category.title}
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full border",
                                                selectedCategory === category._id
                                                    ? "border-white/30 bg-white/20"
                                                    : "border-slate-100 bg-slate-50 group-hover:bg-white"
                                            )}>
                                                {products.filter((p: any) => p.categories?.some((c: any) => c._id === category._id)).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-slate-400 text-sm font-medium">
                                Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> results
                            </h2>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {filteredProducts.map((product: any) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <XCircle className="w-16 h-16 text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900">No matches found</h3>
                                <p className="text-slate-400 mt-1 mb-8">Try adjusting your filters or search terms.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                                    className="rounded-2xl px-8"
                                >
                                    Reset All Filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
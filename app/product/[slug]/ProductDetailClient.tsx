"use client"
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductsContext";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";
import { apiUrl } from "@/lib/constants";
import { useI18n } from "@/contexts/I18nContext";

const ProductDetailClient = ({ product }: any) => {
    const { t } = useI18n();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] = useState<any>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [mainImage, setMainImage] = useState<any>("");
    const { isIndia, currencyCode } = useSettings()

    // 1. Get variants safely
    const productVariants = useMemo(() => {
        if (!product) return [];
        return product.isOnlyProduct ? [] : product.variants || [];
    }, [product]);

    // Helper to find the correct price object from the pricing array
    const getActivePriceData = (pricingArray: any) => {
        if (!pricingArray || !Array.isArray(pricingArray)) return null;
        return pricingArray.find(p => p.currency === currencyCode) || pricingArray[0];
    };

    const currentPriceData = useMemo(() => {
        const source = selectedVariant || product;
        return getActivePriceData(source.pricing);
    }, [selectedVariant, product, currencyCode]);

    const displayPrice = useMemo(() => {
        if (!currentPriceData) return 0;
        return currentPriceData.salePrice || currentPriceData.originalPrice;
    }, [currentPriceData]);

    const originalPrice = useMemo(() => {
        if (!currentPriceData || !currentPriceData.salePrice) return null;
        return currentPriceData.originalPrice;
    }, [currentPriceData]);

    // 2. Identify all possible Attribute Levels dynamically (Level_1, Level_2, etc.)
    const attributeLevels = useMemo(() => {
        if (productVariants.length === 0) return [];
        // Get keys from the first variant's attributes (e.g., ["Level_1", "Level_2"])
        const keys = Object.keys(productVariants[0].attributes || {}).sort();
        return keys;
    }, [productVariants]);

    // 3. Initialize selection and main image
    useEffect(() => {
        if (product) {
            if (productVariants.length > 0) {
                // Default selection: use the first variant
                setSelectedVariant(productVariants[0]);
                setSelectedAttributes(productVariants[0].attributes);
                setMainImage(productVariants[0].images?.[0]?.url || product.images?.[0]?.url || "");
            } else {
                setMainImage(product.images?.[0]?.url || "");
            }
        }
    }, [product, productVariants]);

    // 4. Handle Attribute Selection logic
    const handleAttributeClick = (level: any, value: any) => {
        const newSelection = { ...selectedAttributes, [level]: value };
        setSelectedAttributes(newSelection);

        // Find the variant that matches this new set of attributes
        const match = productVariants.find((v: any) =>
            attributeLevels.every(key => v.attributes[key] === newSelection[key])
        );

        if (match) {
            setSelectedVariant(match);
            if (match.images?.[0]?.url) setMainImage(match.images[0].url);
        }
    };

    // Add this near your other useMemo hooks
    const allMedia = useMemo(() => {
        if (!product) return [];

        // Combine product-level media and selected variant media
        const baseMedia = product.media || product.images || [];
        const variantMedia = selectedVariant?.media || selectedVariant?.images || [];

        // Combine and remove duplicates based on URL
        const combined = [...variantMedia, ...baseMedia];
        const uniqueMedia = Array.from(new Map(combined.map(m => [m.url, m])).values());

        return uniqueMedia;
    }, [product, selectedVariant]);

    console.log(product)

    // Update initial image effect to handle media objects
    useEffect(() => {
        if (product) {
            const initialMedia = selectedVariant?.media?.[0] || product.media?.[0] || product.images?.[0];
            if (initialMedia) setMainImage(initialMedia); // Store the whole object, not just the string
        }
    }, [product, selectedVariant]);

    if (!product) return <div className="text-center py-20">{t('products.not_found')}</div>; 

    // // Pricing & Stock display logic
    // const displayPrice = selectedVariant
    //   ? selectedVariant.price?.sale || selectedVariant.price?.regular
    //   : product.basePrice?.sale || product.basePrice?.regular;

    const displayStock = selectedVariant
        ? selectedVariant.inventory?.stock
        : product.isOnlyProduct ? product.productData?.inventory?.stock : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        // 1. Ensure we have the selected variant data
        // Assuming 'selectedVariant' is the leaf node from your variant tree selection
        if (!selectedVariant && product.variants?.length > 0) {
            return toast({
                title: t('message.selection_required_title'),
                description: t('message.selection_required_desc'),
                variant: "destructive",
            });
        }

        // 2. Call the context function with the specific Variant ID
        addToCart(
            {
                productId: product._id,
                variantId: selectedVariant?._id || null, // Critical: Send the flat Variant ID
                name: product.name,
                price: displayPrice,
                image: selectedVariant?.media?.[0]?.url || product.media?.[0]?.url,
                sku: selectedVariant?.sku || product.productData?.sku,
                currency: currencyCode,
            },
            1 // Quantity
        );

        toast({
            title: t('message.added_to_cart_title'),
            description: t('message.added_to_cart_desc', { name: product.name, attrs: selectedVariant ? `(${Object.values(selectedVariant.attributes).join(' / ')})` : '' }),
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
                    <ArrowLeft className="w-4 h-4" /> {t('products.back_to_shop')}
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* LEFT: IMAGES & VIDEOS */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-muted border relative">
                            {/* check if mainImage is a video type */}
                            {mainImage?.type === 'video' ? (
                                <video
                                    src={`${apiUrl.replace("api", "")}${mainImage.url}`}
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    muted
                                />
                            ) : (
                                <img
                                    src={`${apiUrl.replace("api", "")}${mainImage?.url || mainImage}`} // Fallback for string-only legacy URLs
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            )}
                        </div>

                        {/* Thumbnails Grid */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {allMedia.map((m: any, idx) => {
                                const isVideo = m.type === 'video';
                                const isActive = mainImage?.url === m.url;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(m)}
                                        className={cn(
                                            "w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all relative",
                                            isActive ? "border-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        {isVideo ? (
                                            <div className="w-full h-full bg-black flex items-center justify-center">
                                                <video
                                                    src={`${apiUrl.replace("api", "")}${m.url}`}
                                                    className="w-full h-full object-cover opacity-60"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full">
                                                        <Plus className="w-4 h-4 text-white fill-current" /> {/* Using Plus as a play icon placeholder or actual Play icon */}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={`${apiUrl.replace("api", "")}${m.url}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-warning">
                                    {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4", i < product.rating ? "fill-current" : "text-muted")} />)}
                                </div>
                                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold">
                                    {isIndia ? "₹" : "$"}{displayPrice?.toFixed(2)}
                                </span>

                                {originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {isIndia ? "₹" : (currencyCode === 'QAR' ? 'ر.ق' : '$')}{originalPrice?.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {/* {selectedVariant?.price?.sale && (
                <span className="text-xl text-muted-foreground line-through">${selectedVariant.price.regular.toFixed(2)}</span>
              )} */}
                        </div>

                        {/* UNLIMITED ATTRIBUTE SELECTORS */}
                        {!product.isOnlyProduct && attributeLevels.length > 0 && (
                            <div className="space-y-6 py-4 border-y border-border">
                                {attributeLevels.map((level) => {
                                    // Get unique values for this specific level (e.g., all Colors)
                                    const uniqueValues = [...new Set(productVariants.map((v: any) => v.attributes[level]))];

                                    return (
                                        <div key={level} className="space-y-3">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                                {level.replace("_", " ")}: <span className="text-foreground">{selectedAttributes[level]}</span>
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {uniqueValues.map((value: any) => {
                                                    const isSelected = selectedAttributes[level] === value;
                                                    return (
                                                        <button
                                                            key={value}
                                                            onClick={() => handleAttributeClick(level, value)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-md border text-sm font-medium transition-all flex items-center gap-2",
                                                                isSelected
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                    : "bg-background hover:border-primary/50"
                                                            )}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3" />}
                                                            {value}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="space-y-1 text-sm">
                            <p className={cn("font-medium", displayStock > 0 ? "text-green-600" : "text-red-500")}>
                                {displayStock > 0 ? t('products.in_stock_with_count', { count: displayStock }) : t('products.out_of_stock')}
                            </p>
                            <p className="text-muted-foreground">SKU: {selectedVariant?.sku || product.productData?.sku}</p>
                        </div>

                        {/* QUANTITY & ACTIONS */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border rounded-lg h-12">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 h-full hover:bg-muted"><Minus className="w-4 h-4" /></button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(displayStock, q + 1))} className="px-4 h-full hover:bg-muted"><Plus className="w-4 h-4" /></button>
                            </div>

                            <Button
                                size="lg"
                                className="flex-1 h-12 gap-2"
                                disabled={displayStock <= 0}
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="w-5 h-5" /> {t('products.add_to_cart')}
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            <TrustBadge icon={Truck} title={t('trust.fastDelivery.title')} subtitle={t('trust.fastDelivery.subtitle')} />
                            <TrustBadge icon={Shield} title={t('trust.secure.title')} subtitle={t('trust.secure.subtitle')} />
                            <TrustBadge icon={RotateCcw} title={t('trust.returns.title')} subtitle={t('trust.returns.subtitle')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrustBadge = ({ icon: Icon, title, subtitle }: any) => (
    <div className="text-center space-y-1">
        <Icon className="w-5 h-5 mx-auto text-primary" />
        <p className="text-xs font-bold">{title}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>
    </div>
);

export default ProductDetailClient;
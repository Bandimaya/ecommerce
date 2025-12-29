"use client"

import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, Truck, CreditCard, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useSettings } from "@/contexts/SettingsContext"
import { Input } from "@/components/ui/input"
import { useUser } from "@/contexts/UserContext"
import { apiFetch } from "@/lib/axios"
import Link from "next/link"
import { apiUrl } from "@/lib/constants"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const { isIndia, currencyCode } = useSettings()
    const { user }: any = useUser()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [shippingMethod, setShippingMethod] = useState("standard")
    
    const currencySymbol = isIndia ? "₹" : "$"
    const shippingCost = total >= 50 ? 0 : 5.99
    const grandTotal = total + shippingCost

    const [address, setAddress] = useState({
        firstName: user?.name?.split(' ')[0] || "",
        lastName: user?.name?.split(' ')[1] || "",
        phone: user?.phone || "",
        email: user?.email || "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        country: isIndia ? "India" : "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }

    const handleCheckout = async () => {
        if (!address.addressLine || !address.phone || !address.city || !address.pincode) {
            return toast({
                title: "Missing Details",
                description: "Please fill in all required shipping fields.",
                variant: "destructive",
                className: "bg-gradient-to-r from-destructive/90 to-destructive"
            })
        }

        setLoading(true)
        try {
            const res = await apiFetch(`/orders`, {
                method: "POST",
                data: {
                    isIndia: isIndia,
                    shippingAddress: address,
                    shippingMethod: shippingMethod,
                },
            })

            toast({
                title: "🎉 Order Placed Successfully!",
                description: "Your order is being processed.",
                className: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            })
            
            clearCart()
            setIsCheckingOut(false)
            // Could redirect to order confirmation page
        } catch (err: any) {
            toast({
                title: "Order Failed",
                description: err.response?.data?.message || "Please check your details and try again",
                variant: "destructive",
                className: "bg-gradient-to-r from-destructive/90 to-destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    }

    if (cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] to-[var(--bg-gradient-to)] flex items-center justify-center"
                style={{
                    '--bg-gradient-from': 'hsl(var(--background))',
                    '--bg-gradient-to': 'hsl(var(--muted) / 0.3)',
                } as React.CSSProperties}
            >
                <div className="text-center max-w-md px-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--empty-icon-from)] to-[var(--empty-icon-to)] 
                                 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--empty-icon-shadow)]"
                        style={{
                            '--empty-icon-from': 'hsl(var(--primary) / 0.1)',
                            '--empty-icon-to': 'hsl(var(--primary) / 0.05)',
                            '--empty-icon-shadow': 'hsl(var(--primary) / 0.1)',
                        } as React.CSSProperties}
                    >
                        <ShoppingBag className="w-12 h-12 text-[var(--empty-icon-color)]" 
                                   style={{ '--empty-icon-color': 'hsl(var(--primary))' } as React.CSSProperties} />
                    </motion.div>
                    
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-3xl font-bold mb-4 text-[var(--title-color)]"
                        style={{ '--title-color': 'hsl(var(--foreground))' } as React.CSSProperties}
                    >
                        Your cart is empty
                    </motion.h1>
                    
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--text-muted)] mb-8"
                        style={{ '--text-muted': 'hsl(var(--muted-foreground))' } as React.CSSProperties}
                    >
                        Looks like you haven't added any items yet.
                    </motion.p>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/shop">
                            <Button variant="cta" className="gap-2 group px-8 rounded-xl">
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] to-[var(--bg-gradient-to)]"
            style={{
                '--bg-gradient-from': 'hsl(var(--background))',
                '--bg-gradient-to': 'hsl(var(--muted) / 0.1)',
            } as React.CSSProperties}
        >
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-12"
                >
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-[var(--link-color)] hover:text-[var(--link-hover)] 
                                 transition-all duration-300 group mb-8"
                        style={{
                            '--link-color': 'hsl(var(--muted-foreground))',
                            '--link-hover': 'hsl(var(--primary))',
                        } as React.CSSProperties}
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Continue Shopping
                    </Link>

                    <div className="flex items-center justify-between">
                        <h1 className="font-display text-4xl font-bold text-[var(--title-color)]"
                            style={{ '--title-color': 'hsl(var(--foreground))' } as React.CSSProperties}>
                            {isCheckingOut ? "Shipping Details" : "Your Cart"}
                        </h1>
                        
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--badge-from)] 
                                     to-[var(--badge-to)] text-[var(--badge-text)] text-sm font-medium"
                            style={{
                                '--badge-from': 'hsl(var(--primary) / 0.1)',
                                '--badge-to': 'hsl(var(--primary) / 0.05)',
                                '--badge-text': 'hsl(var(--primary))',
                            } as React.CSSProperties}>
                            <ShieldCheck className="w-4 h-4" />
                            Secure Checkout
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Cart Items or Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {!isCheckingOut ? (
                                <motion.div
                                    key="cart"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {cartItems.map((item: any, index: number) => (
                                        <motion.div
                                            key={item?._id}
                                            variants={itemVariants}
                                            className="group relative"
                                        >
                                            <div className="flex gap-6 bg-[var(--card-bg)] rounded-2xl p-6 border-[1.5px] 
                                                         border-[var(--card-border)] hover:shadow-[0_20px_40px_var(--card-shadow)] 
                                                         transition-all duration-500"
                                                style={{
                                                    '--card-bg': 'hsl(var(--card))',
                                                    '--card-border': 'hsl(var(--border))',
                                                    '--card-shadow': 'hsl(var(--primary) / 0.05)',
                                                } as React.CSSProperties}>
                                                
                                                {/* Image Container */}
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="relative w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br 
                                                             from-[var(--image-bg-from)] to-[var(--image-bg-to)] flex-shrink-0"
                                                    style={{
                                                        '--image-bg-from': 'hsl(var(--muted))',
                                                        '--image-bg-to': 'hsl(var(--muted) / 0.5)',
                                                    } as React.CSSProperties}
                                                >
                                                    <img
                                                        src={apiUrl.replace('api', '') + item.productId?.media?.[0]?.url || item.image}
                                                        alt={item.productId?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Shine effect */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                                        initial={{ x: "-100%" }}
                                                        whileHover={{ x: "100%" }}
                                                        transition={{ duration: 0.8 }}
                                                    />
                                                </motion.div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <p className="text-[10px] text-[var(--category-color)] font-black uppercase 
                                                                       tracking-widest mb-1"
                                                               style={{ '--category-color': 'hsl(var(--primary))' } as React.CSSProperties}>
                                                                {item.productId?.category?.name || "STEM Kit"}
                                                            </p>
                                                            <h3 className="font-bold text-[var(--product-title)] text-lg mb-1"
                                                                style={{ '--product-title': 'hsl(var(--foreground))' } as React.CSSProperties}>
                                                                {item.productId?.name}
                                                            </h3>
                                                            {item.variantId?.attributes && (
                                                                <p className="text-sm text-[var(--variant-text)]"
                                                                   style={{ '--variant-text': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                                                                    {Object.values(item.variantId.attributes).join(" / ")}
                                                                </p>
                                                            )}
                                                        </div>
                                                        
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeFromCart(item._id)}
                                                            className="p-2 rounded-lg text-[var(--delete-icon)] hover:bg-[var(--delete-bg)] 
                                                                     transition-colors"
                                                            style={{
                                                                '--delete-icon': 'hsl(var(--muted-foreground))',
                                                                '--delete-bg': 'hsl(var(--destructive) / 0.1)',
                                                            } as React.CSSProperties}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-6">
                                                        {/* Quantity Controls */}
                                                        <motion.div 
                                                            className="flex items-center border border-[var(--quantity-border)] 
                                                                     rounded-xl bg-[var(--quantity-bg)] overflow-hidden"
                                                            style={{
                                                                '--quantity-border': 'hsl(var(--border))',
                                                                '--quantity-bg': 'hsl(var(--muted))',
                                                            } as React.CSSProperties}
                                                        >
                                                            <motion.button
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="p-3 hover:bg-[var(--quantity-hover)] disabled:opacity-30 
                                                                         transition-colors"
                                                                style={{ '--quantity-hover': 'hsl(var(--background))' } as React.CSSProperties}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </motion.button>
                                                            <span className="px-6 font-bold text-[var(--quantity-text)] text-sm min-w-[3rem] text-center"
                                                                  style={{ '--quantity-text': 'hsl(var(--foreground))' } as React.CSSProperties}>
                                                                {item.quantity}
                                                            </span>
                                                            <motion.button
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                className="p-3 hover:bg-[var(--quantity-hover)] transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </motion.button>
                                                        </motion.div>

                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <motion.p 
                                                                className="font-black text-2xl text-[var(--price-color)] mb-1"
                                                                style={{ '--price-color': 'hsl(var(--foreground))' } as React.CSSProperties}
                                                                animate={{ scale: item.quantity > 1 ? 1.05 : 1 }}
                                                                transition={{ type: "spring" }}
                                                            >
                                                                {currencySymbol}
                                                                {(item.livePrice * item.quantity).toLocaleString(isIndia ? "en-IN" : "en-US", {
                                                                    minimumFractionDigits: 2,
                                                                })}
                                                            </motion.p>
                                                            <p className="text-xs text-[var(--unit-price)] font-medium"
                                                               style={{ '--unit-price': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                                                                {currencySymbol}{item.livePrice.toFixed(2)} each
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Hover Border Effect */}
                                                <motion.div
                                                    className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none"
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{ borderColor: 'hsl(var(--primary) / 0.1)' }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="checkout"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <div className="bg-[var(--card-bg)] rounded-2xl p-8 border-[1.5px] border-[var(--card-border)] 
                                                  shadow-[0_20px_40px_var(--card-shadow)]"
                                        style={{
                                            '--card-bg': 'hsl(var(--card))',
                                            '--card-border': 'hsl(var(--border))',
                                            '--card-shadow': 'hsl(var(--primary) / 0.05)',
                                        } as React.CSSProperties}>
                                        <h2 className="font-display text-2xl font-bold mb-6 text-[var(--title-color)]"
                                            style={{ '--title-color': 'hsl(var(--foreground))' } as React.CSSProperties}>
                                            Shipping Information
                                        </h2>
                                        
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--label-color)] mb-2 block"
                                                           style={{ '--label-color': 'hsl(var(--foreground))' } as React.CSSProperties}>
                                                        First Name
                                                    </label>
                                                    <Input 
                                                        name="firstName" 
                                                        value={address.firstName} 
                                                        placeholder="John" 
                                                        onChange={handleInputChange}
                                                        className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                        style={{
                                                            '--input-bg': 'hsl(var(--background))',
                                                            '--input-border': 'hsl(var(--border))',
                                                            '--input-focus': 'hsl(var(--primary))',
                                                        } as React.CSSProperties}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                        Last Name
                                                    </label>
                                                    <Input 
                                                        name="lastName" 
                                                        value={address.lastName} 
                                                        placeholder="Doe" 
                                                        onChange={handleInputChange}
                                                        className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                    Email Address
                                                </label>
                                                <Input 
                                                    name="email" 
                                                    value={address.email} 
                                                    placeholder="john@example.com" 
                                                    onChange={handleInputChange}
                                                    className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                    Phone Number
                                                </label>
                                                <Input 
                                                    name="phone" 
                                                    value={address.phone} 
                                                    placeholder="+1 234 567 8900" 
                                                    onChange={handleInputChange}
                                                    className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                    Street Address
                                                </label>
                                                <Input 
                                                    name="addressLine" 
                                                    value={address.addressLine} 
                                                    placeholder="123 Main St, Apt 4B" 
                                                    onChange={handleInputChange}
                                                    className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                        City
                                                    </label>
                                                    <Input 
                                                        value={address.city} 
                                                        name="city" 
                                                        placeholder="New York" 
                                                        onChange={handleInputChange}
                                                        className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                        Postal Code
                                                    </label>
                                                    <Input 
                                                        name="pincode" 
                                                        value={address.pincode} 
                                                        placeholder="10001" 
                                                        onChange={handleInputChange}
                                                        className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                    State / Province
                                                </label>
                                                <Input 
                                                    name="state" 
                                                    placeholder="New York" 
                                                    value={address.state} 
                                                    onChange={handleInputChange}
                                                    className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                />
                                            </div>
                                            
                                            {!isIndia && (
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--label-color)] mb-2 block">
                                                        Country
                                                    </label>
                                                    <Input 
                                                        name="country" 
                                                        placeholder="United States" 
                                                        value={address.country} 
                                                        onChange={handleInputChange}
                                                        className="bg-[var(--input-bg)] border-[var(--input-border)] focus:border-[var(--input-focus)]"
                                                    />
                                                </div>
                                            )}

                                            {/* Shipping Method */}
                                            <div className="pt-6 border-t border-[var(--border-divider)]"
                                                 style={{ '--border-divider': 'hsl(var(--border))' } as React.CSSProperties}>
                                                <h3 className="text-lg font-semibold text-[var(--title-color)] mb-4">
                                                    Shipping Method
                                                </h3>
                                                <RadioGroup 
                                                    value={shippingMethod} 
                                                    onValueChange={setShippingMethod}
                                                    className="space-y-3"
                                                >
                                                    <div className="flex items-center space-x-3 rounded-xl border-2 border-[var(--radio-border)] 
                                                                 p-4 hover:border-[var(--radio-hover)] transition-colors cursor-pointer"
                                                         style={{
                                                            '--radio-border': shippingMethod === 'standard' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                                            '--radio-hover': 'hsl(var(--primary) / 0.3)',
                                                         } as React.CSSProperties}>
                                                        <RadioGroupItem value="standard" id="standard" />
                                                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="font-medium">Standard Shipping</span>
                                                                    <p className="text-sm text-[var(--text-muted)]">5-7 business days</p>
                                                                </div>
                                                                <span className="font-bold">{currencySymbol}5.99</span>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3 rounded-xl border-2 border-[var(--radio-border)] 
                                                                 p-4 hover:border-[var(--radio-hover)] transition-colors cursor-pointer"
                                                         style={{
                                                            '--radio-border': shippingMethod === 'express' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                                         } as React.CSSProperties}>
                                                        <RadioGroupItem value="express" id="express" />
                                                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="font-medium">Express Shipping</span>
                                                                    <p className="text-sm text-[var(--text-muted)]">2-3 business days</p>
                                                                </div>
                                                                <span className="font-bold">{currencySymbol}14.99</span>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <Button 
                                                variant="ghost" 
                                                onClick={() => setIsCheckingOut(false)} 
                                                className="w-full mt-4 gap-2 group"
                                            >
                                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                                Back to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[var(--card-bg)] rounded-2xl p-8 border-[1.5px] border-[var(--card-border)] 
                                     shadow-[0_20px_40px_var(--card-shadow)] sticky top-24"
                            style={{
                                '--card-bg': 'hsl(var(--card))',
                                '--card-border': 'hsl(var(--border))',
                                '--card-shadow': 'hsl(var(--primary) / 0.05)',
                            } as React.CSSProperties}
                        >
                            <h2 className="font-display text-2xl font-bold mb-8 text-[var(--title-color)]"
                                style={{ '--title-color': 'hsl(var(--foreground))' } as React.CSSProperties}>
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-muted)]"
                                          style={{ '--text-muted': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                                        Subtotal ({cartItems.length} items)
                                    </span>
                                    <span className="font-medium">{currencySymbol}{total.toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-muted)]">Shipping</span>
                                    <span className={`font-medium ${shippingCost === 0 ? 'text-[var(--success)]' : ''}`}
                                          style={{ '--success': 'hsl(var(--success))' } as React.CSSProperties}>
                                        {shippingCost === 0 ? "FREE" : `${currencySymbol}${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>

                                {shippingCost > 0 && total < 50 && (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="p-3 rounded-lg bg-gradient-to-r from-[var(--warning-bg-from)] to-[var(--warning-bg-to)] 
                                                 border border-[var(--warning-border)]"
                                        style={{
                                            '--warning-bg-from': 'hsl(var(--primary) / 0.05)',
                                            '--warning-bg-to': 'hsl(var(--primary) / 0.02)',
                                            '--warning-border': 'hsl(var(--primary) / 0.1)',
                                        } as React.CSSProperties}
                                    >
                                        <p className="text-sm text-[var(--warning-text)] font-medium text-center"
                                           style={{ '--warning-text': 'hsl(var(--primary))' } as React.CSSProperties}>
                                            <Sparkles className="w-3 h-3 inline mr-2" />
                                            Add {currencySymbol}{(50 - total).toFixed(2)} more for free shipping!
                                        </p>
                                    </motion.div>
                                )}

                                <div className="border-t border-[var(--border-divider)] pt-4">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span className="text-[var(--total-label)]"
                                              style={{ '--total-label': 'hsl(var(--foreground))' } as React.CSSProperties}>
                                            Total
                                        </span>
                                        <motion.span 
                                            key={grandTotal}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="text-2xl text-[var(--total-amount)]"
                                            style={{ '--total-amount': 'hsl(var(--primary))' } as React.CSSProperties}
                                        >
                                            {currencySymbol}{grandTotal.toFixed(2)}
                                        </motion.span>
                                    </div>
                                    <p className="text-xs text-[var(--tax-text)] mt-2"
                                       style={{ '--tax-text': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                                        Includes all applicable taxes
                                    </p>
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="cta"
                                    size="lg"
                                    className="w-full rounded-xl py-7 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                                    onClick={isCheckingOut ? handleCheckout : () => setIsCheckingOut(true)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                    ) : null}
                                    {loading ? "Processing..." : isCheckingOut ? "Place Order" : "Proceed to Checkout"}
                                </Button>
                            </motion.div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-muted)]">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Secure & Encrypted Checkout</span>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                                    <CreditCard className="w-3 h-3" />
                                    <span>Powered by Stripe</span>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                                    <Truck className="w-3 h-3" />
                                    <span>Free shipping over {currencySymbol}50</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Cart
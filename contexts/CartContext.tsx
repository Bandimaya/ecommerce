"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "./UserContext";
import { useSettings } from "./SettingsContext";
import { apiFetch } from "@/lib/axios";
import { useRouter } from "next/navigation";

export interface CartItem {
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  variant?: Record<string, string>; // store selected variant info
  sku?: string;
  currency?: string;
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  total: number;
  loading: boolean;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const { isIndia } = useSettings()

  // Replace with your actual auth logic
  const refreshCart = async () => {
    if (!user) return
    setLoading(true);
    try {
      const res = await apiFetch(`/cart`, {});
      setCartItems(res.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  console.log(user)

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (!user) {
      router.push("/login");
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/cart/add`, {
        method: "POST",
        data: { ...item, quantity, isIndia },
      });
      refreshCart()
      // setCartItems(data.items || []);
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/cart/update`, {
        method: "PUT",
        data: { cartItemId: productId, quantity },
      });
      refreshCart()
    } catch (err) {
      console.error("Update quantity failed", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/cart/remove/${productId}`, {
        method: "DELETE",
      });
      refreshCart()
    } catch (err) {
      console.error("Remove from cart failed", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiFetch(`/cart/clear`, {
        method: "DELETE",
      });
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed", err);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item: any) => sum + (item?.livePrice || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

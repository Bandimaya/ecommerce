"use client"
import { apiFetch } from "@/lib/axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const ProductsContext = createContext<any | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiFetch(`/products`);
                setProducts(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    console.log(products)


    return (
        <ProductsContext.Provider
            value={[products, setProducts]}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const [context] = useContext(ProductsContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

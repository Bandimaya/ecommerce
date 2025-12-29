"use client"
import { apiFetch } from "@/lib/axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const CategoriesContext = createContext<any | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiFetch(`/categories`);
                setCategories(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);



    return (
        <CategoriesContext.Provider
            value={[categories, setCategories]}
        >
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => {
    const [context] = useContext(CategoriesContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

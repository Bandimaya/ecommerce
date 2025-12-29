"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { UserProvider } from "@/contexts/UserContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { ThemeProvider } from "@/contexts/ThemeContext";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { I18nProvider } from "@/contexts/I18nContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
          <UserProvider>
            <CategoriesProvider>
              <ProductsProvider>
                <CartProvider>
                  <LanguageProvider>
                    <I18nProvider>
                      <Toaster />
                      <Sonner />
                      {children}
                    </I18nProvider>
                  </LanguageProvider>
                </CartProvider>
              </ProductsProvider>
            </CategoriesProvider>
          </UserProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

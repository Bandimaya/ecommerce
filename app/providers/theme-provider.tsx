// app/providers/theme-provider.tsx

"use client";

import { useEffect } from "react";
import { fetchThemeFromBackend, applyTheme } from "@/lib/theme-utils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeTheme = async () => {
      const root = document.documentElement;
      
      // Remove any existing preview mode
      root.removeAttribute("data-preview-mode");
      
      try {
        // Try to fetch theme from backend
        const backendTheme = await fetchThemeFromBackend();
        
        if (backendTheme) {
          // Apply the theme from backend
          await applyTheme(backendTheme);
        } else {
          // Fallback to default theme
          await applyTheme({
            color: "teal",
            gradient: null,
            font: "'Inter', ui-sans-serif, system-ui, sans-serif",
            fontSizes: {
              sm: 0.875,
              base: 1,
              lg: 1.125,
              xl: 1.25,
              xl2: 1.5,
              xl3: 1.875,
              xl4: 2.25,
              xl5: 3,
            },
          });
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
        // Fallback to localStorage or default
      }
      
      // Set a class to enable theme transitions after initial load
      setTimeout(() => {
        document.body.classList.add("theme-transitions-enabled");
      }, 100);
    };

    initializeTheme();
  }, []);

  return <>{children}</>;
}
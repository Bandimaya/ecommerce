"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie: npm install js-cookie
import { 
  ThemeConfig, 
  DEFAULT_THEME_CONFIG,
  applyTheme as applyThemeUtil,
  resetTheme as resetThemeUtil,
  getCurrentTheme,
  saveThemeToBackend,
} from '@/lib/theme-utils';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => Promise<void>;
  resetTheme: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to get cookie name
const THEME_COOKIE_NAME = 'app-theme-config';

export function ThemeProvider({ 
  children, 
  initialTheme 
}: { 
  children: ReactNode;
  initialTheme?: ThemeConfig; // Allow passing theme from layout.tsx
}) {
  // Use initialTheme (from Server) as the first state to prevent flashing
  const [theme, setThemeState] = useState<ThemeConfig>(initialTheme || DEFAULT_THEME_CONFIG);
  const [isLoading, setIsLoading] = useState(!initialTheme);
  const [isSaving, setIsSaving] = useState(false);

  // Apply theme variables to the document immediately on change
  useEffect(() => {
    applyThemeUtil(theme);
  }, [theme]);

  // Sync with LocalStorage/Cookies if no initialTheme was provided
  useEffect(() => {
    if (!initialTheme) {
      const savedTheme = getCurrentTheme();
      setThemeState(savedTheme);
      setIsLoading(false);
    }
  }, [initialTheme]);

  const setTheme = useCallback(async (newConfig: Partial<ThemeConfig>) => {
    try {
      setIsSaving(true);
      
      const updatedTheme = { ...theme, ...newConfig };

      // 1. Update React State (Instant UI feedback)
      setThemeState(updatedTheme);

      // 2. Persist to Cookies (For Server-Side Rendering)
      // Expires in 365 days, available globally on the domain
      Cookies.set(THEME_COOKIE_NAME, JSON.stringify(updatedTheme), { expires: 365, path: '/' });

      // 3. Persist to LocalStorage (Legacy fallback)
      localStorage.setItem('theme-customization', JSON.stringify(updatedTheme));

      // 4. Persist to Backend (Database/Permanent Storage)
      // This ensures the theme follows the user across devices
      await saveThemeToBackend(updatedTheme);

    } catch (error) {
      console.error('Error saving permanent theme:', error);
      // Optional: Add toast notification for error
    } finally {
      setIsSaving(false);
    }
  }, [theme]);

  const resetTheme = async () => {
    try {
      setIsSaving(true);
      
      // Clear all persistence layers
      Cookies.remove(THEME_COOKIE_NAME);
      await resetThemeUtil(); // Clears localStorage
      
      // Update state to default
      setThemeState(DEFAULT_THEME_CONFIG);
      
      // Sync default back to backend
      await saveThemeToBackend(DEFAULT_THEME_CONFIG);
    } catch (error) {
      console.error('Error resetting theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme, isLoading, isSaving }}>
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
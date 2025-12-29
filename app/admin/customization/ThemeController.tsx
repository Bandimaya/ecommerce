"use client";

import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';

/**
 * Standard default theme values
 */
export const defaultTheme = {
  colors: {
    primary: {
      50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
      500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
      DEFAULT: '#4f46e5', foreground: '#ffffff'
    },
    neutral: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
      500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a',
      DEFAULT: '#ffffff', foreground: '#0f172a'
    },
    destructive: {
      50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
      500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d',
      DEFAULT: '#ef4444', foreground: '#ffffff'
    },
    success: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
      500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
      DEFAULT: '#22c55e', foreground: '#ffffff'
    },
    warning: {
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
      500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f',
      DEFAULT: '#f59e0b', foreground: '#ffffff'
    },
    info: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a',
      DEFAULT: '#3b82f6', foreground: '#ffffff'
    },
    secondary: { DEFAULT: '#f1f5f9', foreground: '#0f172a' },
    accent: { DEFAULT: '#f1f5f9', foreground: '#0f172a' },
    card: { DEFAULT: '#ffffff', foreground: '#0f172a' },
    background: { DEFAULT: '#ffffff', foreground: '#0f172a' },
    muted: { DEFAULT: '#f1f5f9', foreground: '#64748b' },
    border: { DEFAULT: '#e2e8f0' },
    input: { DEFAULT: '#e2e8f0' },
    ring: { DEFAULT: '#4f46e5' },
  },
  gradients: {
    hero: 'linear-gradient(to right, #4f46e5, #818cf8)',
    primary: 'linear-gradient(to right, #4f46e5, #6366f1)',
  },
  fonts: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    display: 'ui-sans-serif, system-ui, sans-serif',
  }
};

export default function ThemeController() {
  const [theme, setTheme] = useState(defaultTheme);

  const applyThemeToDOM = useCallback((currentTheme: typeof defaultTheme) => {
    const root = document.documentElement;
    let cssVariables = '';

    const setVar = (name: string, value: string) => {
      root.style.setProperty(name, value);
      cssVariables += `${name}: ${value}; `;
    };

    // 1. Map Colors to CSS Variables
    Object.entries(currentTheme.colors).forEach(([key, shades]: [string, any]) => {
      if (typeof shades === 'string') {
        setVar(`--${key}`, shades);
      } else {
        Object.entries(shades).forEach(([shade, value]: [string, any]) => {
          const varName = shade === 'DEFAULT' ? `--${key}` : `--${key}-${shade}`;
          setVar(varName, value);
        });
      }
    });

    // 2. Map Gradients
    Object.entries(currentTheme.gradients).forEach(([key, value]) => {
      setVar(`--gradient-${key}`, value as string);
    });

    // 3. Map Fonts
    Object.entries(currentTheme.fonts).forEach(([key, value]) => {
      setVar(`--font-${key}`, value as string);
    });

    // 4. Inject Dynamic Style Tag for Tailwind Utility Overrides
    const styleId = 'theme-permanent-overrides';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      :root { ${cssVariables} }
      .bg-primary { background-color: var(--primary) !important; }
      .text-primary { color: var(--primary) !important; }
      .border-primary { border-color: var(--primary) !important; }
      .bg-secondary { background-color: var(--secondary) !important; }
      .text-secondary { color: var(--secondary) !important; }
      .font-display { font-family: var(--font-display) !important; }
      .font-sans { font-family: var(--font-sans) !important; }
    `;
  }, []);

  const loadAndApply = useCallback(() => {
    // Priority: Cookies (Permanent/Server-Synced) -> LocalStorage -> Default
    const cookieData = Cookies.get('app-theme-config');
    const localData = localStorage.getItem('app-theme');
    const saved = cookieData || localData;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedTheme = { ...defaultTheme, ...parsed };
        setTheme(mergedTheme);
        applyThemeToDOM(mergedTheme);
      } catch (e) {
        console.error("Theme Load Error:", e);
      }
    } else {
      applyThemeToDOM(defaultTheme);
    }
  }, [applyThemeToDOM]);

  useEffect(() => {
    // Initial Load
    loadAndApply();

    // Listen for cross-tab changes or manual theme trigger events
    window.addEventListener('storage', loadAndApply);
    window.addEventListener('theme-change', loadAndApply);

    return () => {
      window.removeEventListener('storage', loadAndApply);
      window.removeEventListener('theme-change', loadAndApply);
    };
  }, [loadAndApply]);

  return null;
}
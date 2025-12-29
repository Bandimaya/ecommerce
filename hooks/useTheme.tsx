"use client";
import { useContext } from "react";
import {
  ThemeContext,
  ThemeContextValue,
} from "@/contexts/ThemeContext";

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a NewThemeProvider");
  }
  return context;
};

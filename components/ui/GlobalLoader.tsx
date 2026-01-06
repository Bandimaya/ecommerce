"use client";

import React from "react";
import Loader from "@/app/loader/Loader";
import { useUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function GlobalLoader() {
  const userContext = useUser();
  const settingsContext = useSettings();
  const cartContext = useCart();
  const themeContext = useTheme();

  const anyLoading = !!(
    userContext?.loading ||
    settingsContext?.loading ||
    cartContext?.loading ||
    themeContext?.isLoading
  );

  if (!anyLoading) return null;

  return <Loader />;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { countryToCurrency } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDisplayPrice(pricing: any[], userCountryCode: string) {
  const currency = countryToCurrency[userCountryCode] || "USD";

  // Try exact currency match first
  let priceObj = (pricing ?? []).find(p => p.currency === currency);

  // Fallbacks
  if (!priceObj && currency === "INR") {
    priceObj = (pricing ?? []).find(p => p.region === "Domestic");
  }

  if (!priceObj) {
    priceObj = (pricing ?? []).find(p => p.region === "Overseas");
  }

  if (!priceObj) return 0;

  return { displayPrice: priceObj.salePrice ?? priceObj.originalPrice ?? 0, currency: priceObj.currency || "USD" };
}

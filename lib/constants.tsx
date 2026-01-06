export const apiUrl = "/api";


export const CURRENCY_OPTIONS = [
  { code: "SAR", label: "SAR - Saudi Riyal", symbol: "﷼" },
  { code: "INR", label: "INR - Indian Rupee", symbol: "₹" },
  { code: "OMR", label: "OMR - Omani Rial", symbol: "﷼" },
  { code: "BHD", label: "BHD - Bahraini Dinar", symbol: ".د.ب" },
  { code: "AED", label: "AED - UAE Dirham", symbol: "د.إ" },
];

export const countryToCurrency: Record<string, string> = {
  SA: "SAR", // Saudi Arabia
  IN: "INR", // India
  OM: "OMR", // Oman
  BH: "BHD", // Bahrain
  AE: "AED", // UAE
};

export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGES_BASE_URL;
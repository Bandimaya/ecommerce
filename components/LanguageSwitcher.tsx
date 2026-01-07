"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "ar";

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check the actual Google Cookie to determine state
    // We prefer the cookie over localStorage because the cookie is what actually controls the translation.
    const match = document.cookie.match(new RegExp("(^| )googtrans=([^;]+)"));
    if (match) {
      const cookieValue = match[2]; // e.g., "/en/ar"
      const currentLang = cookieValue.split("/")[2] as Lang; // Extract 'ar'
      
      if (currentLang === "ar") {
        setLang("ar");
        document.documentElement.dir = "rtl";
      } else {
        setLang("en");
        document.documentElement.dir = "ltr";
      }
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    const cookieValue = `/en/${nextLang}`;
    const domain = window.location.hostname;

    // 2. Set Cookie (Google Translate requires this)
    // We set it twice to cover subdomains and localhost scenarios
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`; // Fallback

    // 3. Update State
    setLang(nextLang);
    localStorage.setItem("lang", nextLang);

    // 4. Reload page to trigger the Google Translate Script
    window.location.reload();
  };

  // Prevent Hydration Mismatch:
  // Don't render the button text until we know which language is active on the client
  if (!mounted) {
    return (
      <button className="px-4 py-2 rounded-full border text-sm font-semibold opacity-0">
        EN
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-full border text-sm font-semibold
                 hover:bg-gray-100 transition"
    >
      {lang === "en" ? "AR" : "EN"}
    </button>
  );
}
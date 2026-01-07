"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type Lang = "en" | "ar";

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      // 1. Check the actual Google Cookie to determine state
      // We prefer the cookie over localStorage because the cookie is what actually controls the translation.
      const match = document.cookie.match(new RegExp("(^| )googtrans=([^;]+)"));
      if (match) {
        const cookieValue = match[2]; // e.g., "/en/ar"
        const currentLang = (cookieValue.split("/")[2] as Lang) || "en"; // Extract 'ar' or fallback

        setLang(currentLang);
        document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
        return;
      }
    } catch (e) {
      // Don't let cookie parsing errors crash the app
      console.warn("Error reading googtrans cookie", e);
    }

    // Fallback: ensure page direction at least matches our state
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  const initGoogleTranslate = () => {
    try {
      const g = (window as any).google;
      if (!g || !g.translate || !g.translate.TranslateElement) return false;

      const container = document.getElementById("google_translate_element");
      if (container) container.innerHTML = "";

      new g.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,ar", autoDisplay: false },
        "google_translate_element"
      );

      // ensure correct direction after init
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      return true;
    } catch (e) {
      console.warn("Google Translate init failed", e);
      return false;
    }
  };

  useEffect(() => {
    if (scriptLoaded) {
      if (!initGoogleTranslate()) setTimeout(initGoogleTranslate, 250);
    }
  }, [scriptLoaded]);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    const cookieValue = `/en/${nextLang}`;

    try {
      const hostname = window.location.hostname;
      const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";

      // Set cookie for root domain (with leading dot) and hostname, plus fallback.
      if (hostname && hostname !== "localhost") {
        try {
          document.cookie = `googtrans=${cookieValue}; path=/; ${expires}; domain=.${hostname};`;
        } catch (e) {
          // ignore and continue
        }
        try {
          document.cookie = `googtrans=${cookieValue}; path=/; ${expires}; domain=${hostname};`;
        } catch (e) {
          // ignore and continue
        }
      }

      // Always set a path-only cookie as well so both scopes are covered.
      document.cookie = `googtrans=${cookieValue}; path=/; ${expires};`;
    } catch (e) {
      console.warn("Failed to set googtrans cookie", e);
    }

    setLang(nextLang);
    try { localStorage.setItem("lang", nextLang); } catch (e) { /* ignore */ }

    // Re-init the translate element to apply the new cookie immediately.
    if (initGoogleTranslate()) {
      document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";

      // Some versions of the translate widget re-apply a previous state asynchronously.
      // Re-run init shortly after to ensure the new cookie is respected.
      setTimeout(() => {
        try { initGoogleTranslate(); } catch (e) { /* ignore */ }
      }, 300);

      return;
    }

    try { window.location.reload(); } catch (e) { try { window.location.href = window.location.href; } catch {} }
  };

  // Prevent Hydration Mismatch:
  if (!mounted) {
    return (
      <button className="px-4 py-2 rounded-full border text-sm font-semibold opacity-0">EN</button>
    );
  }

  return (
    <>
      {/* Hidden container required by Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }} />

      <Script
        src="https://translate.google.com/translate_a/element.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
          if (!initGoogleTranslate()) setTimeout(initGoogleTranslate, 250);
        }}
        onError={(e) => {
          setScriptError(true);
          console.warn("Google Translate script failed to load", e);
        }}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-full border text-sm font-semibold hover:bg-gray-100 transition"
        >
          {lang === "en" ? "AR" : "EN"}
        </button>

        {scriptError && (
          <span className="text-xs text-red-600" title="Translation script failed to load">⚠️ Translation unavailable</span>
        )}
      </div>
    </>
  );
}
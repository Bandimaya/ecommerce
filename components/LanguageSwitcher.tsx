"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "ar";

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const w = window as any;
      if (w.google && w.google.translate && w.google.translate.TranslateElement) {
        resolve();
        return;
      }

      // If script already present (but not ready) listen for onload
      const existing = document.querySelector("script[src*='translate_a/element.js']");
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject());
        return;
      }

      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js";
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject();
      document.head.appendChild(s);
    } catch (e) { reject(e); }
  });
}

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      // Read cookie to reflect current state in UI (but we do NOT auto-init translation on mount)
      const match = document.cookie.match(new RegExp("(^| )googtrans=([^;]+)"));
      if (match) {
        const cookieValue = match[2]; // e.g., "/en/ar"
        const currentLang = (cookieValue.split("/")[2] as Lang) || "en"; // Extract 'ar' or fallback

        setLang(currentLang);
        document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
        return;
      }
    } catch (e) {
      console.warn("Error reading googtrans cookie", e);
    }

    // fallback
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

      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      return true;
    } catch (e) {
      console.warn("Google Translate init failed", e);
      return false;
    }
  };

  const toggleLanguage = async () => {
    const nextLang = lang === "en" ? "ar" : "en";
    const cookieValue = `/en/${nextLang}`;
    const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";

    try {
      const hostname = window.location.hostname;

      if (hostname && hostname !== "localhost") {
        try { document.cookie = `googtrans=${cookieValue}; path=/; ${expires}; domain=.${hostname};`; } catch (e) { /* ignore */ }
        try { document.cookie = `googtrans=${cookieValue}; path=/; ${expires}; domain=${hostname};`; } catch (e) { /* ignore */ }
      }

      // path-only fallback
      try { document.cookie = `googtrans=${cookieValue}; path=/; ${expires};`; } catch (e) { /* ignore */ }
    } catch (e) {
      console.warn("Failed to set googtrans cookie", e);
    }

    setLang(nextLang);
    try { localStorage.setItem("lang", nextLang); } catch (e) { /* ignore */ }

    // Lazy load script and init only on user action (prevents auto-translate on page load)
    try {
      await loadGoogleScript();
      if (!initGoogleTranslate()) {
        // allow some time for the widget to become ready, then try again
        setTimeout(() => { try { initGoogleTranslate(); } catch (e) {} }, 250);
      }
    } catch (e) {
      setScriptError(true);
      console.warn("Failed to load Google Translate script", e);

      // If script cannot be loaded, fallback to page reload so server-side or other logic can handle it.
      try { window.location.reload(); } catch (e) { try { window.location.href = window.location.href; } catch {} }
    }
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
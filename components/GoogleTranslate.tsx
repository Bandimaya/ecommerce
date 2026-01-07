"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Initialize the specific cookie logic when the component mounts
  useEffect(() => {
    // Check current cookie to set active state
    const match = document.cookie.match(new RegExp("(^| )googtrans=([^;]+)"));
    if (match) {
      const lang = match[2].split("/")[2]; // Extract 'ar' from '/en/ar'
      setSelectedLanguage(lang || "en");
    }
  }, []);

  const changeLanguage = (lang: string) => {
    // 1. Set the cookie that Google Translate looks for
    // Format: /source_lang/target_lang
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${lang}; path=/;`; // Fallback for localhost

    // 2. Set the state
    setSelectedLanguage(lang);

    // 3. Reload the page to apply the translation immediately
    window.location.reload();
  };

  return (
    <>
      {/* --- CUSTOM UI --- */}
      {/* <div className="flex gap-4 p-4">
        <button
          onClick={() => changeLanguage("en")}
          className={`px-4 py-2 rounded ${
            selectedLanguage === "en"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          English
        </button>

        <button
          onClick={() => changeLanguage("ar")}
          className={`px-4 py-2 rounded ${
            selectedLanguage === "ar"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Arabic
        </button>
      </div> */}

      {/* --- HIDDEN GOOGLE ELEMENTS --- */}
      
      {/* The container must exist, but we hide it via CSS logic below */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Initialize Google Translate */}
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'en,ar',
                  autoDisplay: false,
                },
                'google_translate_element'
              );
            }
          `,
        }}
      />
      
      {/* Load the API */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
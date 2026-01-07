// components/GTranslate.tsx
"use client";

import Script from "next/script";

const GTranslate = () => {
  return (
    <>
      <div className="gtranslate_wrapper"></div>
      
      {/* 1. Set the settings first */}
      <Script 
        id="gtranslate-settings" 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.gtranslateSettings = {
              default_language: "en",
              native_language_names: true,
              detect_browser_language: true,
              wrapper_selector: ".gtranslate_wrapper",
              flag_style: "3d",
              alt_flags: { "en": "usa", "pt": "brazil", "es": "mexico" }, // Optional: Use specific flags
              languages: ["en", "ar", "es", "fr", "hi", "kn"]
            };
          `
        }}
      />

      {/* 2. Load the script second */}
      <Script 
        src="https://cdn.gtranslate.net/widgets/latest/float.js" 
        strategy="afterInteractive" 
      />
    </>
  );
};

export default GTranslate;
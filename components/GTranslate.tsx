// components/GTranslate.tsx
"use client";

import { useEffect, useRef } from "react";

const GTranslate = () => {
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (scriptAdded.current) return;
    scriptAdded.current = true;

    // 1. Define the GTranslate Settings
    // You can add or remove language codes in the 'languages' array.
    // 'ar' is Arabic, 'en' is English.
    (window as any).gtranslateSettings = {
      default_language: "en",
      native_language_names: true,
      detect_browser_language: true,
      wrapper_selector: ".gtranslate_wrapper",
      flag_style: "3d", // Styles: '2d', '3d'
      languages: ["en", "ar", "es", "fr", "hi", "kn"], // Add languages here
    };

    // 2. Load the GTranslate Script (Float style)
    // This creates a nice floating widget (usually bottom right or customizable)
    // Alternatively, use 'dropdown.js' for a simple select box.
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js"; 
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div className="gtranslate_wrapper"></div>;
};

export default GTranslate;
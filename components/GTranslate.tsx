"use client";

import Script from "next/script";
import { useEffect } from "react";

const GTranslate = () => {
  useEffect(() => {
    const forceFix = () => {
      document
        .querySelectorAll(".gt_black_overlay, .gt_cover")
        .forEach(el => el.remove());

      const wrapper = document.getElementById("gt_float_wrapper");
      if (wrapper) {
        const w = wrapper as HTMLElement;
        w.style.pointerEvents = "none";
        w.style.width = "auto";
        w.style.height = "auto";
      }

      const switcher = document.querySelector(".gt_float_switcher");
      if (switcher) {
        (switcher as HTMLElement).style.pointerEvents = "auto";
      }
    };

    const interval = setInterval(forceFix, 800);
    window.addEventListener("load", forceFix);

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", forceFix);
    };
  }, []);

  return (
    <>
      <div className="gtranslate_wrapper" />

      <style>{`
        /* ===============================
           POSITIONING
        =============================== */
        .gtranslate_wrapper,
        #gt_float_wrapper {
          position: fixed !important;
          top: 70px !important;
          right: 10px !important;
          z-index: 1000 !important;
          border-radius: 48px !important;
          width: 80px !important;
          pointer-events: none !important;
        }

        /* ===============================
           CLICK SAFETY
        =============================== */
        .gt_black_overlay,
        .gt_cover {
          display: none !important;
          pointer-events: none !important;
        }

        .gt_float_switcher,
        .gt_float_switcher * {
          pointer-events: auto !important;
        }

        /* ===============================
           BUTTON STYLE
        =============================== */
        .gt_float_switcher .gt_selected,
        .gt_float_switcher .gt_current {
          width: 50px !important;
          height: 30px !important;
          border-radius: 50px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 4px !important;
          background: #fff !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
          color: #333 !important;
          text-transform: uppercase !important;
        }

        /* 🔑 SHOW label ONLY in button */
        .gt_float_switcher .gt_selected span,
        .gt_float_switcher .gt_current span {
          display: inline !important;
        }

        /* Hide flags */
        .gt_float_switcher img {
          display: none !important;
        }

        /* ===============================
           ARROW
        =============================== */
        .gt_float_switcher .gt_selected::after {
          content: "▼";
          font-size: 8px;
          margin-left: 2px;
          transition: transform 0.3s ease;
        }

        .gt_float_switcher:hover .gt_selected::after {
          transform: rotate(180deg);
        }

        /* ===============================
           DROPDOWN
        =============================== */
        .gt_float_switcher .gt_options {
          top: 100% !important;
          margin-top: 6px !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
          background: #fff !important;
          width: 120px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }

        .gt_float_switcher .gt_options a {
          padding: 10px 12px !important;
          font-size: 17px !important;
          text-align: center !important;
          border-bottom: 1px solid rgba(0,0,0,0.08) !important;
        }

        .gt_float_switcher .gt_options a:last-child {
          border-bottom: none !important;
        }


        /* 🚫 HIDE CURRENT LANGUAGE FROM LIST */
        .gt_float_switcher .gt_options a.gt_current,
        .gt_float_switcher .gt_options a.selected {
          display: none !important;
        }
      `}</style>

      <Script
        id="gtranslate-settings"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.gtranslateSettings = {
              default_language: "en",
              detect_browser_language: true,
              wrapper_selector: ".gtranslate_wrapper",
              native_language_names: true,
              float_switcher_open_direction: "bottom",
              languages: ["en", "ar", "hi", "fr", "es", "kn"]
            };
          `,
        }}
      />

      <Script
        src="https://cdn.gtranslate.net/widgets/latest/float.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default GTranslate;

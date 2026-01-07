"use client";

import Script from "next/script";
import { useEffect } from 'react';

const GTranslate = () => {
  useEffect(() => {
    // This will run after GTranslate loads
    const overrideDropdown = () => {
      // Find and modify the dropdown elements
      const observer = new MutationObserver(() => {
        const switcher = document.querySelector('.gt_float_switcher');
        if (switcher) {
          // Remove any classes that might indicate bottom positioning
          switcher.classList.remove('gt_bottom', 'gt_upward');
          switcher.classList.add('gt_top', 'gt_downward');
          
          // Force inline styles
          const options = switcher.querySelector('.gt_options');
          if (options) {
            (options as HTMLElement).style.top = '100%';
            (options as HTMLElement).style.bottom = 'auto';
            (options as HTMLElement).style.transform = 'none';
          }
          
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Run after a delay to ensure GTranslate is loaded
    setTimeout(overrideDropdown, 2000);
    
    // Also run when window loads
    window.addEventListener('load', overrideDropdown);
    
    return () => {
      window.removeEventListener('load', overrideDropdown);
    };
  }, []);

  return (
    <>
      <div className="gtranslate_wrapper"></div>
      
      <style>{`
        /* Base positioning */
        .gtranslate_wrapper, #gt_float_wrapper {
          position: fixed !important;
          top: 70px !important;
          right: 10px !important;
          z-index: 99999 !important;
          width: auto !important;
          display: inline-block !important;
          float: right !important;
        }

        /* Reduce button width and font size */
        .gt_float_switcher {
          float: right !important;
          width: auto !important;
          min-width: 120px !important;
          max-width: 150px !important;
          font-size: 12px !important;
        }

        /* Button styling - 50px width with 10px border radius */
        .gt_float_switcher .gt_selected,
        .gt_float_switcher .gt_current {
          width: 50px !important;
          max-width: 50px !important;
          min-width: 50px !important;
          height: 30px !important;
          padding: 6px 10px !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          border-radius: 50px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          box-sizing: border-box !important;
        }

        /* Dropdown items styling */
        .gt_float_switcher .gt_options {
          width: 100% !important;
          min-width: 120px !important;
          max-width: 150px !important;
          font-size: 12px !important;
          right: 0 !important;
          left: auto !important;
          border-radius: 10px !important;
          overflow: hidden !important;
          margin-top: 5px !important;
        }

        /* Dropdown items */
        .gt_float_switcher .gt_options a {
          padding: 6px 10px !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        /* Dropdown items hover */
        .gt_float_switcher .gt_options a:hover {
          background-color: #f5f5f5 !important;
        }

        /* Force dropdown direction */
        .gt_float_switcher .gt_options {
          top: 100% !important;
          bottom: auto !important;
          transform-origin: top center !important;
          animation-name: dropdown !important;
        }

        /* Override any upward animations */
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hide upward indicators */
        .gt_float_switcher .gt_options:before {
          border-bottom-color: #333 !important;
          border-top: none !important;
          top: -10px !important;
          bottom: auto !important;
          right: 10px !important;
          left: auto !important;
        }

        /* Flag image sizing - hide flag to save space */
        .gt_float_switcher .gt_selected img,
        .gt_float_switcher .gt_current img {
          display: none !important;
        }

        /* Keep flags in dropdown */
        .gt_float_switcher .gt_options img {
          width: 20px !important;
          height: 14px !important;
          margin-right: 6px !important;
          display: inline-block !important;
        }

        /* Arrow icon size */
        .gt_float_switcher .gt_selected .gt_arrow,
        .gt_float_switcher .gt_current .gt_arrow {
          width: 10px !important;
          height: 10px !important;
          margin-left: 2px !important;
        }

        /* Ensure dropdown aligns to the right */
        .gt_float_switcher {
          text-align: left !important;
          direction: ltr !important;
        }

        /* First dropdown item (selected language) styling */
        .gt_float_switcher .gt_options a.gt_current {
          width: auto !important;
          min-width: auto !important;
          max-width: none !important;
          border-radius: 0 !important;
          background-color: #e8e8e8 !important;
        }

        /* Hide text in main button, show only flag */
        .gt_float_switcher .gt_selected span,
        .gt_float_switcher .gt_current span {
          display: none !important;
        }

        /* Alternative: Show abbreviated text (e.g., "EN") */
        .gt_float_switcher .gt_selected span,
        .gt_float_switcher .gt_current span {
          font-size: 10px !important;
          font-weight: bold !important;
          display: block !important;
          width: 100% !important;
          text-align: center !important;
        }
      `}</style>

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
              alt_flags: { 
                "en": "usa", 
                "pt": "brazil", 
                "es": "mexico" 
              },
              languages: ["en", "ar", "es", "fr", "hi", "kn"],
              float_switcher_open_direction: "bottom"
            };
          `
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
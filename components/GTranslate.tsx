"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GTranslate = () => {
  // We keep the state to handle dragging within the CURRENT session.
  // When the page reloads, this resets to { x: 0, y: 0 } automatically.
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // ==========================================================
    // 1. SAFETY PATCH: Fix React Crash with Google Translate
    // ==========================================================
    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      try {
        return originalRemoveChild.call(this, child) as T;
      } catch (error) {
        console.warn("Google Translate crashed React (fixed by patch).");
        if (child.parentNode) {
          child.parentNode.removeChild(child);
        }
        return child;
      }
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null
    ): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      } catch (error) {
        console.warn("Google Translate insertion error (fixed by patch).");
        return newNode;
      }
    };

    // ==========================================================
    // 2. UI FIXES: Force Styling & Remove Overlays
    // ==========================================================
    const forceFix = () => {
      document
        .querySelectorAll(".gt_black_overlay, .gt_cover")
        .forEach((el) => el.remove());

      const wrapper = document.getElementById("gt_float_wrapper");
      if (wrapper) {
        wrapper.style.pointerEvents = "none";
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
      <motion.div
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.1 }}
        // update position state so it stays put while the user is on the page
        onDragEnd={(event, info) => {
          setPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="gt-draggable-container"
      >
        <div className="gtranslate_wrapper notranslate" />
      </motion.div>

      <style>{`
        /* ===============================
           DRAGGABLE CONTAINER
        =============================== */
        .gt-draggable-container {
          position: fixed !important;
          z-index: 1000 !important;
          
          /* DEFAULT POSITION (Where it resets to on reload) */
          top: 150px !important; 
          left: 20px !important;
          
          width: 85px !important;
          height: auto !important;
          border-radius: 48px !important;
          cursor: grab;
          touch-action: none; 
        }

        .gt-draggable-container:active {
          cursor: grabbing;
        }

        @media (min-width: 1024px) {
          .gt-draggable-container {
            top: 160px !important;
          }
        }

        /* ===============================
           OLD WRAPPER OVERRIDES
        =============================== */
        .gtranslate_wrapper,
        #gt_float_wrapper {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          width: 100% !important;
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

        .gt_float_switcher .gt_selected span,
        .gt_float_switcher .gt_current span {
          display: inline !important;
        }

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
          transform-origin: center center; 
        }

        .gt_float_switcher:hover .gt_selected::after {
          transform: rotate(180deg);
        }

        /* ===============================
           DROPDOWN
        =============================== */
        .gt_float_switcher .gt_options {
          top: 100% !important;
          margin-top: 0px !important;
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

"use client";

import Script from "next/script";
import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Languages } from "lucide-react";

const GTranslateWrapper = memo(() => (
  <div className="gtranslate_wrapper notranslate" />
));
GTranslateWrapper.displayName = "GTranslateWrapper";

const GTranslate = ({ inline = false }: { inline?: boolean }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isRightSide, setIsRightSide] = useState(false);

  useEffect(() => {
    /* =========================================
       1. REACT SAFETY PATCH
    ========================================= */
    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      try {
        return originalRemoveChild.call(this, child) as T;
      } catch {
        return child;
      }
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null
    ): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      } catch {
        return newNode;
      }
    };

    /* =========================================
       2. DOM CLEANER
    ========================================= */
    const brutalFix = () => {
      // Remove overlays
      document
        .querySelectorAll(".gt_black_overlay, .gt_cover")
        .forEach((el) => el.remove());

      // Note: We handle hiding arrows/flags via CSS now to prevent blinking/layout thrashing

      // Force pointer events so we can click
      // const wrapper = document.getElementById("gt_float_wrapper");
      // if (wrapper) wrapper.style.pointerEvents = "none";

      const switcher = document.querySelector(".gt_float_switcher");
      if (switcher) (switcher as HTMLElement).style.pointerEvents = "auto";
    };

    brutalFix();
    const interval = setInterval(brutalFix, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        drag={!inline}
        dragMomentum={false}
        animate={inline ? undefined : { x: position.x, y: position.y }}
        onDragEnd={(e, info) => {
          if (inline) return;
          const newX = position.x + info.offset.x;
          const newY = position.y + info.offset.y;
          setPosition({ x: newX, y: newY });

          if (typeof window !== "undefined") {
            const absoluteX = 20 + newX; // 20px is initial left
            setIsRightSide(absoluteX > window.innerWidth / 2);
          }
        }}
        onTap={() => setIsOpen(!isOpen)}
        className={`gt-drag ${isOpen ? "gt-open" : ""} ${isRightSide ? "gt-right" : ""} ${inline ? "gt-inline" : ""}`}
      >
        <GTranslateWrapper />
        {/* FAUX CIRCLE: restores white circle when injected widget forces transparency */}
        <div className="gt-faux-circle" aria-hidden="true">
          <Languages size={25} strokeWidth={2} />
          <ChevronDown className={`gt-arrow-icon ${isOpen ? "gt-rotate" : ""}`} size={16} />
        </div>
      </motion.div>

      <style>{`
        /* 1. THE DRAGGABLE WRAPPER */
        .gt-drag {
          position: fixed !important;
          top: 150px !important;
          left: 20px !important;
          width: 44px !important;
          height: 44px !important;
          z-index: 99999 !important;
          cursor: grab;
          touch-action: none; /* Prevents scrolling on mobile while dragging */
          border-radius: 50% !important;

          /* Hide outer square and allow internal elements to show */
          background: transparent !important;
          box-shadow: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: visible !important;
        }
        
        /* Hide overlays immediately to prevent blinking */
        .gt_black_overlay, .gt_cover {
          display: none !important;
        }

        .gt-drag:active {
          cursor: grabbing;
        }

        /* 1.a Force injected wrappers inside the draggable area to be transparent,
           but exclude our faux circle so it remains visible */
        .gt-drag *:not(.gt-faux-circle),
        .gt-drag *:not(.gt-faux-circle)::before,
        .gt-drag *:not(.gt-faux-circle)::after {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* FAUX CIRCLE: sits on top and restores the white circle if injected styles are transparent */
        .gt-faux-circle {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          background: var(--primary, #000) !important;
          color: var(--primary-foreground, #fff) !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
          z-index: 100000 !important;
          pointer-events: none !important; /* allow clicks to pass through to the real widget */
          
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .gt-label {
          font-family: sans-serif !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: inherit !important;
        }

        .gt-arrow-icon {
          margin-left: 2px;
          transition: transform 0.2s ease;
        }
        .gt-rotate {
          transform: rotate(180deg);
        }

        /* 2. RESET GTRANSLATE WRAPPER */
        #gt_float_wrapper,
        .gtranslate_wrapper {
          position: relative !important;
          inset: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          width: auto !important;
          height: auto !important;
          background: transparent !important;
          box-shadow: none !important;
          pointer-events: none !important;
        }

        /* remove pseudo elements that sometimes create a square */
        #gt_float_wrapper::before,
        #gt_float_wrapper::after,
        .gtranslate_wrapper::before,
        .gtranslate_wrapper::after {
          display: none !important;
          content: none !important;
        }

        /* 3. THE SWITCHER CONTAINER (Must NOT have overflow: hidden) */
        .gt_float_switcher {
          position: relative !important;
          width: 44px !important;
          height: 44px !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 50% !important;
          overflow: visible !important; /* CRITICAL: Allows dropdown to show */
          pointer-events: auto !important;
        }

        /* 4. THE VISIBLE BUTTON (CURRENT LANGUAGE) - the actual circle */
        .gt_float_switcher .gt_selected,
        .gt_float_switcher .gt_current {
          position: relative !important;
          z-index: 20 !important; /* Above the dropdown */
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important; /* The circle shape */
          background: #fff !important;   /* ensure the real widget button stays white */
          color: #222 !important;
          /* keep the visual shadow on the circle only */
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
          
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important; /* Clips the background inside the button */
        }

        /* ensure pseudo elements for the selected/current are removed */
        .gt_float_switcher .gt_selected::before,
        .gt_float_switcher .gt_selected::after,
        .gt_float_switcher .gt_current::before,
        .gt_float_switcher .gt_current::after {
          display: none !important;
          content: none !important;
        }

        /* 5. TEXT STYLING */
        .gt_float_switcher span {
          all: unset !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          color: #222 !important;
          font-family: sans-serif !important;
          background: transparent !important;
        }

        /* 6. THE DROPDOWN MENU */
        .gt_float_switcher .gt_options {
          position: absolute !important;
          z-index: 10 !important; /* Below the button slightly */
          top: 48px !important;   /* Pushes it below the circle */
          transform: none !important;
          
          width: 100px !important;
          height: auto !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          
          background: #fff !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
          
          /* Smooth Fade In (Optional) */
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          display: block !important;
          transition: opacity 0.2s linear, visibility 0.2s linear !important;
        }

        /* Left alignment (default) */
        .gt-drag:not(.gt-right) .gt_float_switcher .gt_options {
          left: 0 !important;
          right: auto !important;
        }
        /* Right alignment */
        .gt-drag.gt-right .gt_float_switcher .gt_options {
          left: auto !important;
          right: 0 !important;
        }

        /* Show dropdown when open */
        .gt-open .gt_float_switcher .gt_options {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }

        /* Hide current language in dropdown */
        .gt_float_switcher .gt_options a.gt_current {
          display: none !important;
        }

        /* 7. DROPDOWN LINKS */
        .gt_float_switcher .gt_options a {
          display: block !important;
          padding: 10px 0 !important;
          text-align: center !important;
          font-size: 14px !important;
          color: #444 !important;
          text-decoration: none !important;
          font-weight: 500 !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          transition: background 0.2s !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        .gt_float_switcher .gt_options a:hover {
          background: #f5f5f5 !important;
          color: #000 !important;
        }
        
        .gt_float_switcher .gt_options a:last-child {
          border-bottom: none !important;
        }

        /* 8. REMOVE UNWANTED ELEMENTS */
        .gt_arrow,
        .gt_float_switcher img,
        .gt_float_switcher .gt_selected > span:not(:first-child),
        .gt_float_switcher svg,
        .gt_float_switcher::after,
        .gt_float_switcher::before {
          display: none !important;
        }
        
        /* HIDE SCROLLBAR BUT ALLOW SCROLLING */
        .gt_float_switcher .gt_options::-webkit-scrollbar {
          width: 4px;
        }
        .gt_float_switcher .gt_options::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }

        /* INLINE MODE OVERRIDES */
        .gt-drag.gt-inline {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          margin: 0 !important;
          z-index: 50 !important;
          cursor: pointer !important;
          transform: none !important;
        }
        
        .gt-drag.gt-inline .gt_float_switcher .gt_options {
           /* Ensure dropdown appears below */
           top: 50px !important;
           left: 0 !important; 
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
              languages: ["en","ar","hi","fr","es","kn"],
              alt_flags: {} /* Disable default flags */
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
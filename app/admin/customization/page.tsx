// app/admin/customization/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  applyTheme,
  setPreviewMode,
  clearPreviewMode,
  resetTheme,
  type ThemeColor,
  type GradientTheme,
  type ThemeConfig,
  DEFAULT_THEME_CONFIG,
} from "@/lib/theme-utils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Save,
  Trash2,
  Check,
  X,
  Palette,
  Type,
  Zap,
  Star,
  StarOff,
  Undo,
  Settings,
  Eye,
  Download,
  Brush,
  Layers,
  Grid3x3,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/lib/axios";

/* ---------- SOLID THEME CONFIG ---------- */
const solidThemes = [
  {
    key: "red" as ThemeColor,
    name: "Crimson",
    preview: "#EF4444",
    darkPreview: "#DC2626",
    lightPreview: "#FEE2E2",
  },
  {
    key: "orange" as ThemeColor,
    name: "Sunset",
    preview: "#F97316",
    darkPreview: "#EA580C",
    lightPreview: "#FFEDD5",
  },
  {
    key: "green" as ThemeColor,
    name: "Emerald",
    preview: "#22C55E",
    darkPreview: "#16A34A",
    lightPreview: "#DCFCE7",
  },
  {
    key: "teal" as ThemeColor,
    name: "Teal",
    preview: "#14B8A6",
    darkPreview: "#0D9488",
    lightPreview: "#CCFBF1",
  },
  {
    key: "blue" as ThemeColor,
    name: "Azure",
    preview: "#3B82F6",
    darkPreview: "#2563EB",
    lightPreview: "#DBEAFE",
  },
  {
    key: "purple" as ThemeColor,
    name: "Royal",
    preview: "#8B5CF6",
    darkPreview: "#7C3AED",
    lightPreview: "#F3E8FF",
  },
  {
    key: "mono" as ThemeColor,
    name: "Monochrome",
    preview: "#0F172A",
    darkPreview: "#020617",
    lightPreview: "#F1F5F9",
  },
];

// Function to get light gradient colors
const getLightGradient = (color: ThemeColor) => {
  const theme = solidThemes.find(t => t.key === color);
  if (!theme) return ["#F1F5F9", "#E2E8F0", "#CBD5E1"];

  switch (color) {
    case "red":
      return ["#FEE2E2", "#FECACA", "#FCA5A5"];
    case "orange":
      return ["#FFEDD5", "#FED7AA", "#FDBA74"];
    case "green":
      return ["#DCFCE7", "#BBF7D0", "#86EFAC"];
    case "teal":
      return ["#CCFBF1", "#99F6E4", "#5EEAD4"];
    case "blue":
      return ["#DBEAFE", "#BFDBFE", "#93C5FD"];
    case "purple":
      return ["#F3E8FF", "#E9D5FF", "#D8B4FE"];
    case "mono":
    default:
      return ["#F1F5F9", "#E2E8F0", "#CBD5E1"];
  }
};

/* ---------- GRADIENT THEME CONFIG (Updated with Lighter Colors) ---------- */
const gradientThemes = [
  {
    key: "sunset" as GradientTheme,
    name: "Sunset",
    preview: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #FDBA74 100%)",
    color: "orange",
    description: "Warm sunrise tones"
  },
  {
    key: "ocean" as GradientTheme,
    name: "Ocean",
    preview: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)",
    color: "blue",
    description: "Cool ocean breeze"
  },
  {
    key: "aurora" as GradientTheme,
    name: "Aurora",
    preview: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 50%, #86EFAC 100%)",
    color: "green",
    description: "Natural green tones"
  },
  {
    key: "fire" as GradientTheme,
    name: "Fire",
    preview: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 50%, #FCA5A5 100%)",
    color: "red",
    description: "Subtle red glow"
  },
  {
    key: "forest" as GradientTheme,
    name: "Forest",
    preview: "linear-gradient(135deg, #DCFCE7 0%, #A7F3D0 50%, #6EE7B7 100%)",
    color: "green",
    description: "Deeper green tones"
  },
  {
    key: "royal" as GradientTheme,
    name: "Royal",
    preview: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 50%, #D8B4FE 100%)",
    color: "purple",
    description: "Elegant purple shades"
  },
  {
    key: "mono" as GradientTheme,
    name: "Mono",
    preview: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
    color: "mono",
    description: "Clean monochrome"
  },
  {
    key: "teal" as GradientTheme,
    name: "Teal",
    preview: "linear-gradient(135deg, #CCFBF1 0%, #99F6E4 50%, #5EEAD4 100%)",
    color: "teal",
    description: "Fresh teal colors"
  },
];

/* ---------- TYPOGRAPHY OPTIONS ---------- */
const fontOptions = [
  { key: "inter", name: "Inter", value: "'Inter', ui-sans-serif, system-ui, sans-serif", preview: "Aa" },
  { key: "mono", name: "JetBrains Mono", value: "'JetBrains Mono', ui-monospace, monospace", preview: "<>{}" },
  { key: "serif", name: "Georgia", value: "Georgia, serif", preview: "Aa" },
  { key: "system", name: "System Default", value: "system-ui, -apple-system, sans-serif", preview: "Aa" },
];

/* ---------- PRESET THEMES ---------- */
const presetThemes = [
  {
    id: "modern-light",
    name: "Modern Light",
    description: "Light theme with subtle gradients",
    config: {
      color: "purple" as ThemeColor,
      gradient: "royal" as GradientTheme,
      font: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSizes: DEFAULT_THEME_CONFIG.fontSizes,
    },
    isPreset: true,
    previewColors: ["#F3E8FF", "#E9D5FF", "#D8B4FE"],
    badge: "Popular"
  },
  {
    id: "sunrise-light",
    name: "Sunrise Light",
    description: "Warm sunrise with light gradients",
    config: {
      color: "orange" as ThemeColor,
      gradient: "sunset" as GradientTheme,
      font: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSizes: DEFAULT_THEME_CONFIG.fontSizes,
    },
    isPreset: true,
    previewColors: ["#FFEDD5", "#FED7AA", "#FDBA74"]
  },
  {
    id: "ocean-light",
    name: "Ocean Light",
    description: "Cool ocean with light blue gradients",
    config: {
      color: "blue" as ThemeColor,
      gradient: "ocean" as GradientTheme,
      font: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSizes: DEFAULT_THEME_CONFIG.fontSizes,
    },
    isPreset: true,
    previewColors: ["#DBEAFE", "#BFDBFE", "#93C5FD"]
  },
  {
    id: "forest-light",
    name: "Forest Light",
    description: "Natural green light gradients",
    config: {
      color: "green" as ThemeColor,
      gradient: "forest" as GradientTheme,
      font: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSizes: DEFAULT_THEME_CONFIG.fontSizes,
    },
    isPreset: true,
    previewColors: ["#DCFCE7", "#A7F3D0", "#6EE7B7"]
  },
  {
    id: "clean-mono",
    name: "Clean Mono",
    description: "Clean monochrome light theme",
    config: {
      color: "mono" as ThemeColor,
      gradient: "mono" as GradientTheme,
      font: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSizes: DEFAULT_THEME_CONFIG.fontSizes,
    },
    isPreset: true,
    previewColors: ["#F8FAFC", "#F1F5F9", "#E2E8F0"]
  },
];

export default function ThemeCustomizationPage() {
  const { theme: currentTheme, setTheme, resetTheme: resetThemeContext, isLoading: themeLoading } = useTheme();

  const [mode, setMode] = useState<"select" | "color" | "gradient" | "typography" | "custom">("select");
  const [draftTheme, setDraftTheme] = useState<ThemeConfig | null>(currentTheme);
  const [dialog, setDialog] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [customThemes, setCustomThemes] = useState<any[]>([]);
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fontSizePreview, setFontSizePreview] = useState("The quick brown fox jumps over the lazy dog.");

  // Load custom themes from localStorage on mount
  // useEffect(() => {
  //   const savedThemes = localStorage.getItem("custom-themes");
  //   if (savedThemes) {
  //     try {
  //       setCustomThemes(JSON.parse(savedThemes));
  //     } catch (error) {
  //       console.error("Error loading custom themes:", error);
  //     }
  //   }
  // }, []);

  // Keep draft theme in sync with the active theme when in select mode
  useEffect(() => {
    if (mode === 'select') {
      setDraftTheme(currentTheme);
    }
  }, [currentTheme, mode]);

  // Update preview when draft theme changes
  useEffect(() => {
    if (draftTheme && mode !== 'select' && showPreview) {
      setPreviewMode(draftTheme);
    } else if (mode === 'select' || !showPreview) {
      clearPreviewMode();
    }
  }, [draftTheme, mode, showPreview]);

  // Handle theme changes
  const handleUpdateDraft = (newConfig: Partial<ThemeConfig>) => {
    if (draftTheme) {
      const updatedTheme = { ...draftTheme, ...newConfig };
      setDraftTheme(updatedTheme);

      // Auto-preview when making changes
      if (!showPreview) setShowPreview(true);
    }
  };

  // Apply theme
  // const handleApplyTheme = async (themeToApply?: ThemeConfig) => {
  //   const finalTheme = themeToApply || draftTheme;

  //   if (!finalTheme) {
  //     setDialog({ type: "error", message: "No theme configuration to apply." });
  //     return;
  //   }

  //   try {
  //     setIsSaving(true);
  //     clearPreviewMode();
  //     setShowPreview(false);

  //     await setTheme(finalTheme);

  //     setDialog({
  //       type: "success",
  //       message: "Theme applied successfully across the entire website."
  //     });
  //     setTimeout(() => setDialog(null), 3000);
  //   } catch (error) {
  //     console.error("Error applying theme:", error);
  //     setDialog({ type: "error", message: "Failed to apply theme." });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleApplyTheme = async (themeToApply?: ThemeConfig) => {
    const finalTheme = themeToApply || draftTheme;
    if (!finalTheme) return;

    try {
      setIsSaving(true);

      // 1. Update the User's persistent preference in DB
      // Assuming you have an endpoint for user profile updates

      console.log(customThemes[0]?._id, customThemes)
      if (!customThemes[0]?.id) {
        await apiFetch("/themes", {
          method: "PUT",
          data: { config: finalTheme, id: customThemes[0]?._id }
        });
      }
      else {
        await apiFetch("/themes", {
          method: "POST",
          data: { config: finalTheme, name: "Theme", isPublic: true }
        });

      }
      // 2. Update the local Context state
      await setTheme(finalTheme);

      setDialog({ type: "success", message: "Theme applied and saved to profile!" });
      setTimeout(() => setDialog(null), 3000);
    } catch (error: any) {
      setDialog({ type: "error", message: "Failed to apply theme preferences" });
    } finally {
      setIsSaving(false);
    }
  };

  // Save custom theme
  // const handleSaveCustomTheme = () => {
  //   if (!themeName.trim()) {
  //     setDialog({ type: "error", message: "Please enter a name for your theme." });
  //     return;
  //   }
  //   if (!draftTheme) return;

  //   // Get matching colors for preview
  //   const solidTheme = solidThemes.find(t => t.key === draftTheme.color);
  //   const gradientTheme = gradientThemes.find(t => t.key === draftTheme.gradient);

  //   const previewColors = gradientTheme
  //     ? getGradientColors(gradientTheme.preview)
  //     : solidTheme
  //       ? [solidTheme.lightPreview, solidTheme.preview, solidTheme.darkPreview]
  //       : ["#F1F5F9", "#3B82F6", "#64748B"];

  //   const newTheme = {
  //     id: `custom-${Date.now()}`,
  //     name: themeName,
  //     description: themeDescription,
  //     config: draftTheme,
  //     isPreset: false,
  //     createdAt: new Date().toISOString(),
  //     previewColors,
  //     matchesColor: gradientTheme?.color || draftTheme.color
  //   };

  //   const updatedThemes = [...customThemes, newTheme];
  //   setCustomThemes(updatedThemes);
  //   localStorage.setItem("custom-themes", JSON.stringify(updatedThemes));

  //   setThemeName("");
  //   setThemeDescription("");
  //   setShowSaveDialog(false);

  //   setDialog({ type: "success", message: `"${themeName}" saved as a custom theme!` });
  //   setTimeout(() => setDialog(null), 3000);
  // };
  const handleSaveCustomTheme = async () => {
    if (!themeName.trim()) {
      setDialog({ type: "error", message: "Please enter a name for your theme." });
      return;
    }
    if (!draftTheme) return;

    try {
      setIsSaving(true);

      // Prepare data for the POST /api/themes route
      const payload = {
        name: themeName,
        config: draftTheme,
        isPublic: true, // You can toggle this based on a checkbox
      };

      const savedTheme = await apiFetch("/themes", {
        method: "POST",
        data: payload
      });

      // Update local state with the database response
      setCustomThemes([savedTheme, ...customThemes]);

      setThemeName("");
      setThemeDescription("");
      setShowSaveDialog(false);

      setDialog({ type: "success", message: `"${themeName}" saved to database!` });
      setTimeout(() => setDialog(null), 3000);
    } catch (error: any) {
      setDialog({ type: "error", message: error.message || "Failed to save theme" });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to extract colors from gradient
  const getGradientColors = (gradient: string): string[] => {
    const colorMatches = gradient.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
    return colorMatches || ["#F1F5F9", "#94A3B8", "#475569"];
  };

  // Delete custom theme
  // const handleDeleteCustomTheme = (themeId: string) => {
  //   const updatedThemes = customThemes.filter(theme => theme.id !== themeId);
  //   setCustomThemes(updatedThemes);
  //   localStorage.setItem("custom-themes", JSON.stringify(updatedThemes));
  //   setDialog({ type: "success", message: "Theme deleted successfully!" });
  //   setTimeout(() => setDialog(null), 3000);
  // };

  const handleDeleteCustomTheme = async (themeId: string) => {
    try {
      setIsSaving(true);

      // Calls DELETE /api/themes?id=...
      await apiFetch(`/themes?id=${themeId}`, {
        method: "DELETE"
      });

      const updatedThemes = customThemes.filter(theme => theme._id !== themeId);
      setCustomThemes(updatedThemes);

      setDialog({ type: "success", message: "Theme deleted from database!" });
      setTimeout(() => setDialog(null), 3000);
    } catch (error: any) {
      setDialog({ type: "error", message: "Failed to delete theme" });
    } finally {
      setIsSaving(false);
    }
  };

  // Load preset theme
  const handleLoadPreset = (preset: any) => {
    setSelectedPreset(preset.id);
    setDraftTheme(preset.config);
    setShowPreview(true);
  };

  // Reset to defaults
  const handleReset = async () => {
    try {
      setIsSaving(true);
      clearPreviewMode();
      setShowPreview(false);

      await resetThemeContext();
      setDraftTheme(DEFAULT_THEME_CONFIG);

      setDialog({ type: 'success', message: 'Theme has been reset to default.' });
      setTimeout(() => setDialog(null), 3000);
    } catch (error) {
      setDialog({ type: 'error', message: 'Failed to reset theme.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Export theme
  const handleExportTheme = () => {
    if (!draftTheme) return;

    const themeData = JSON.stringify(draftTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDialog({ type: 'success', message: 'Theme exported successfully!' });
    setTimeout(() => setDialog(null), 3000);
  };

  // Get gradient themes that match the selected color
  const getMatchingGradients = (color: ThemeColor) => {
    return gradientThemes.filter(g => g.color === color);
  };

  // Load custom themes from Database on mount
  useEffect(() => {
    const loadThemes = async () => {
      try {
        // Fetches themes from your /api/themes route
        const themes = await apiFetch("/themes");
        setCustomThemes(themes);
      } catch (error: any) {
        console.error("Error loading custom themes:", error);
        setDialog({ type: "error", message: error.message || "Failed to load themes" });
      }
    };

    loadThemes();
  }, []);

  if (themeLoading || !draftTheme) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded-lg w-64 max-w-full"></div>
            <div className="h-4 bg-muted rounded-lg w-96 max-w-full"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { color: selectedColor, gradient: selectedGradient, font: selectedFontValue, fontSizes } = draftTheme;
  const selectedFontKey = fontOptions.find(f => f.value === selectedFontValue)?.key || 'inter';
  const matchingGradients = getMatchingGradients(selectedColor);
  const selectedSolidTheme = solidThemes.find(t => t.key === selectedColor);
  const selectedGradientTheme = gradientThemes.find(t => t.key === selectedGradient);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Theme Customization Studio
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              Design and customize your website's appearance with precision. All changes are live-previewed and saved automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${showPreview
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/40 hover:bg-secondary'
                }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {showPreview ? 'Preview On' : 'Preview Off'}
              </span>
            </button>

            <button
              onClick={handleExportTheme}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Mode Navigation */}
        <div className="relative">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { key: "select" as const, label: "Theme Gallery", icon: Grid3x3 },
              { key: "color" as const, label: "Colors", icon: Palette },
              { key: "gradient" as const, label: "Gradients", icon: Layers },
              { key: "typography" as const, label: "Typography", icon: Type },
              // { key: "custom" as const, label: "Custom Builder", icon: Brush },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setMode(key);
                  if (key === "select") {
                    clearPreviewMode();
                    setShowPreview(false);
                  } else {
                    setShowPreview(true);
                  }
                }}
                className={`group flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl border transition-all duration-200 ${mode === key
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-secondary hover:shadow-md"
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${mode === key ? 'scale-110' : ''}`} />
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Gallery Mode */}
      {mode === "select" && (
        <div className="space-y-12">
          {/* Preset Themes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <span>Light Gradient Presets</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose from our light gradient themes
                </p>
              </div>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                {presetThemes.length} presets
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {presetThemes.map((preset) => (
                <motion.div
                  key={preset.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLoadPreset(preset)}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer group ${selectedPreset === preset.id
                    ? "border-primary ring-4 ring-primary/10 bg-gradient-to-br from-primary/5 to-transparent"
                    : "border-border hover:border-primary/40 bg-card"
                    }`}
                >
                  {preset.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                        {preset.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{preset.name}</h3>
                        <p className="text-sm text-muted-foreground">{preset.description}</p>
                      </div>
                      {selectedPreset === preset.id && (
                        <div className="p-1.5 rounded-full bg-primary text-primary-foreground">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="mb-5 h-20 rounded-lg overflow-hidden">
                      <div
                        className="w-full h-full transition-transform group-hover:scale-105"
                        style={{
                          background: preset.previewColors.length === 1
                            ? preset.previewColors[0]
                            : `linear-gradient(135deg, ${preset.previewColors.join(', ')})`
                        }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyTheme(preset.config);
                        }}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadPreset(preset);
                        }}
                        className="px-3 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Custom Themes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Star className="w-5 h-5" />
                  </div>
                  <span>Your Custom Themes</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage and apply your saved custom themes
                </p>
              </div>

              {/* <button
                onClick={() => setMode("custom")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Brush className="w-4 h-4" />
                <span className="text-sm">Create New</span>
              </button> */}
            </div>

            {customThemes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {customThemes.map((theme) => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors"
                  >
                    <button
                      onClick={() => handleDeleteCustomTheme(theme.id)}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
                        {theme.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          {solidThemes.find(t => t.key === (theme.matchesColor || theme.config?.color))?.name || "Custom"}
                        </p>
                      </div>

                      <div className="h-16 rounded-lg mb-5 overflow-hidden">
                        <div
                          className="w-full h-full transition-transform group-hover:scale-105"
                          style={{
                            background: theme.previewColors?.length === 1
                              ? theme.previewColors[0]
                              : `linear-gradient(135deg, ${theme.previewColors?.join(', ') || '#F1F5F9, #94A3B8, #475569'})`
                          }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApplyTheme(theme.config)}
                          className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => {
                            setDraftTheme(theme.config);
                            setMode("custom");
                            setShowPreview(true);
                          }}
                          className="flex-1 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
                  <StarOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Custom Themes Yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by creating your first custom theme to save your preferred settings
                </p>
                <button
                  onClick={() => setMode("custom")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <Brush className="w-4 h-4" />
                  Create Your First Theme
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Color Selection Mode */}
      {mode === "color" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <span>Primary Color Palette</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {solidThemes.map(({ key, name, preview, darkPreview, lightPreview }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateDraft({ color: key })}
                  className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all overflow-hidden ${selectedColor === key
                    ? 'border-primary ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent'
                    : 'border-border hover:border-primary/40 hover:bg-secondary'
                    }`}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-background shadow-lg">
                    <div className="absolute inset-0 flex flex-col">
                      <div
                        className="flex-1"
                        style={{ backgroundColor: darkPreview }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: preview }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: lightPreview }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium">{name}</span>
                  {selectedColor === key && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-primary text-primary-foreground">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Selected: {selectedSolidTheme?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This color will be applied as the primary brand color
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setMode("gradient")}
                    className="px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    View Matching Gradients
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleApplyTheme()}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Applying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Apply Color
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Selection Mode */}
      {mode === "gradient" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Light Gradient Themes</span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Matching gradients for {selectedSolidTheme?.name}
                </p>
              </div>
              <button
                onClick={() => setMode("color")}
                className="px-4 py-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary transition-colors text-sm font-medium"
              >
                Change Color
              </button>
            </div>

            {/* Matching Gradients Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Matching Gradients</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {matchingGradients.map(({ key, name, preview, description }) => (
                  <motion.button
                    key={key}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpdateDraft({ gradient: key })}
                    className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden group ${selectedGradient === key
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40'
                      }`}
                  >
                    <div className="relative h-32 rounded-lg mb-4 overflow-hidden">
                      <div
                        className="absolute inset-0 transition-transform group-hover:scale-105"
                        style={{ background: preview }}
                      />
                    </div>

                    <div className="text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{name}</span>
                        {selectedGradient === key && (
                          <div className="p-1.5 rounded-full bg-primary text-primary-foreground">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* All Gradients Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">All Gradient Themes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gradientThemes.map(({ key, name, preview, description, color }) => (
                  <motion.button
                    key={key}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpdateDraft({ gradient: key })}
                    className={`relative p-5 rounded-xl border-2 transition-all overflow-hidden group ${selectedGradient === key
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40'
                      }`}
                  >
                    <div className="relative h-24 rounded-lg mb-4 overflow-hidden">
                      <div
                        className="absolute inset-0 transition-transform group-hover:scale-105"
                        style={{ background: preview }}
                      />
                      <div className="absolute top-2 right-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: solidThemes.find(t => t.key === color)?.preview }}
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{name}</span>
                        {selectedGradient === key && (
                          <div className="p-1.5 rounded-full bg-primary text-primary-foreground">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Selected: {selectedGradientTheme?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedGradientTheme?.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleApplyTheme()}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Applying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Apply Gradient
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Typography Mode */}
      {mode === "typography" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Type className="w-5 h-5 text-primary" />
              <span>Typography Settings</span>
            </h2>

            <div className="space-y-8">
              {/* Font Family */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Font Family</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {fontOptions.map(({ key, name, value, preview }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUpdateDraft({ font: value })}
                      className={`p-4 rounded-xl border transition-all text-left min-h-[120px] ${selectedFontKey === key
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40 hover:bg-secondary'
                        }`}
                      style={{ fontFamily: value }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold mb-2">{preview}</div>
                          <div className="text-sm font-medium">{name}</div>
                        </div>
                        {selectedFontKey === key && (
                          <div className="p-1.5 rounded-full bg-primary text-primary-foreground">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {fontSizePreview}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Font Sizes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Font Sizes</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fontSizePreview}
                      onChange={(e) => setFontSizePreview(e.target.value)}
                      placeholder="Type preview text..."
                      className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary max-w-[200px]"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { key: 'xs', label: 'Extra Small', min: 10, max: 14, step: 0.5 },
                    { key: 'sm', label: 'Small', min: 12, max: 16, step: 0.5 },
                    { key: 'base', label: 'Base', min: 14, max: 20, step: 0.5 },
                    { key: 'lg', label: 'Large', min: 16, max: 24, step: 0.5 },
                    { key: 'xl', label: 'Extra Large', min: 18, max: 32, step: 0.5 },
                  ].map(({ key, label, min, max, step }) => (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {fontSizes[key as keyof typeof fontSizes]}px
                          </span>
                        </div>
                        <div
                          className="text-sm px-3 py-1 rounded-md bg-secondary"
                          style={{
                            fontSize: `${fontSizes[key as keyof typeof fontSizes]}px`,
                            fontFamily: selectedFontValue
                          }}
                        >
                          Aa
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min={min}
                          max={max}
                          step={step}
                          value={fontSizes[key as keyof typeof fontSizes]}
                          onChange={(e) => {
                            const newFontSizes = {
                              ...fontSizes,
                              [key]: parseFloat(e.target.value)
                            };
                            handleUpdateDraft({ fontSizes: newFontSizes });
                          }}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer 
                            [&::-webkit-slider-thumb]:appearance-none 
                            [&::-webkit-slider-thumb]:h-5 
                            [&::-webkit-slider-thumb]:w-5 
                            [&::-webkit-slider-thumb]:rounded-full 
                            [&::-webkit-slider-thumb]:bg-primary
                            [&::-webkit-slider-thumb]:border-2
                            [&::-webkit-slider-thumb]:border-background
                            [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>{min}px</span>
                          <span>{max}px</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Font: {fontOptions.find(f => f.key === selectedFontKey)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Preview text updates in real-time
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={() => handleApplyTheme()}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Applying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Apply Typography
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Theme Mode */}
      {mode === "custom" && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Brush className="w-5 h-5 text-primary" />
              <span>Custom Theme Builder</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Theme Preview */}
              <div className="space-y-6">
                <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-secondary/30 to-transparent">
                  <h3 className="font-semibold mb-4">Current Theme Preview</h3>

                  <div className="space-y-4">
                    {/* Color & Gradient Preview */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-background">
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-lg"
                          style={{
                            background: selectedGradientTheme?.preview ||
                              `linear-gradient(135deg, ${getLightGradient(selectedColor).join(', ')})`
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Color & Gradient</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedSolidTheme?.name} • {selectedGradientTheme?.name || "Custom Gradient"}
                        </div>
                      </div>
                    </div>

                    {/* Font Preview */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-background">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Type className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Typography</div>
                        <div
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: selectedFontValue }}
                        >
                          {fontOptions.find(f => f.key === selectedFontKey)?.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-secondary/20 to-transparent">
                    <h4 className="text-sm font-medium mb-3">Live Preview</h4>
                    <div
                      className="text-sm p-3 rounded-lg bg-background border border-border min-h-[100px]"
                      style={{ fontFamily: selectedFontValue }}
                    >
                      <p style={{ fontSize: `${fontSizes.base}px` }} className="mb-2">
                        This is how your text will appear with the current settings.
                      </p>
                      <p style={{ fontSize: `${fontSizes.sm}px` }} className="text-muted-foreground">
                        The quick brown fox jumps over the lazy dog.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setMode("color")}
                    className="p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary transition-colors text-left group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3 group-hover:scale-110 transition-transform">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Colors</h4>
                    <p className="text-xs text-muted-foreground">Change color palette</p>
                  </button>

                  <button
                    onClick={() => setMode("gradient")}
                    className="p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary transition-colors text-left group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3 group-hover:scale-110 transition-transform">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Gradients</h4>
                    <p className="text-xs text-muted-foreground">Apply gradient themes</p>
                  </button>

                  <button
                    onClick={() => setMode("typography")}
                    className="p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary transition-colors text-left group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3 group-hover:scale-110 transition-transform">
                      <Type className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Typography</h4>
                    <p className="text-xs text-muted-foreground">Adjust font settings</p>
                  </button>
                </div>
              </div>

              {/* Right Column - Save & Actions */}
              <div className="space-y-6">
                {/* Save Theme */}
                <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-secondary/30 to-transparent">
                  <h3 className="font-semibold mb-4">Save Custom Theme</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme Name *</label>
                      <input
                        type="text"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="My Awesome Theme"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                      <textarea
                        value={themeDescription}
                        onChange={(e) => setThemeDescription(e.target.value)}
                        placeholder="Describe your theme..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveCustomTheme}
                      disabled={!themeName.trim()}
                      className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save as Custom Theme
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleApplyTheme()}
                    disabled={isSaving}
                    className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Applying Theme...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Apply Current Theme
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleExportTheme}
                      className="py-3 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>

                    <button
                      onClick={handleReset}
                      className="py-3 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Undo className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Messages */}
      <AnimatePresence>
        {dialog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]"
          >
            <div className={`relative px-4 py-4 rounded-xl shadow-xl border-l-4 backdrop-blur-sm ${dialog.type === 'success'
              ? 'bg-green-50/95 border-green-500 text-green-800'
              : 'bg-red-50/95 border-red-500 text-red-800'
              }`}>
              <div className="flex items-start gap-3">
                {dialog.type === 'success' ? (
                  <div className="p-1 rounded-full bg-green-100">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-red-100">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{dialog.message}</p>
                </div>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1 hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Settings,
  Package,
  Home,
  Store,
  Layers,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/contexts/I18nContext";

interface NavbarProps {
  onLanguageToggle?: (language: string) => void;
  currentLanguage?: string;
}

const Navbar = ({ onLanguageToggle }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  const { user, logout } = useUser();
  const navRef = useRef<HTMLDivElement>(null);

  // Get language controls
  const { lang, toggleLang } = useLanguage();
  const { t } = useI18n();

  // Determine if currently Arabic/Qatar
  // This controls the toggle state: False = English (Left), True = Qatar (Right)
  const isArabic = useMemo(() => lang === "ar" || lang === "qa", [lang]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Smooth language switching
  const handleLanguageSwitch = async () => {
    if (isTransitioning) return; // Prevent multiple clicks

    setIsTransitioning(true);

    try {
      // Toggle to 'qa' (Qatar) instead of generic 'ar'
      const nextLang = isArabic ? "en" : "qa";

      // Set language directly
      if (toggleLang) toggleLang(nextLang);

      // Inform parent if provided
      if (onLanguageToggle) onLanguageToggle(nextLang);

      // Close mobile menu
      setIsOpen(false);

      // Small delay to let DOM updates settle
      await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navLinks = [
    { key: "navbar.home", path: "/", icon: <Home className="w-5 h-5" /> },
    { key: "navbar.shop", path: "/shop", icon: <Store className="w-5 h-5" /> },
    {
      key: "navbar.programs",
      path: "/programs",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      key: "navbar.contact",
      path: "/contact",
      icon: <Phone className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => pathname === path;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- Reusable Toggle Switch Component ---
  const LanguageToggleSwitch = ({ mobile = false }) => (
    <div
      onClick={handleLanguageSwitch}
      className={`relative flex items-center rounded-full cursor-pointer transition-colors duration-300 border border-transparent shadow-inner ${
        mobile ? "w-20 h-10" : "w-16 h-8"
      } ${
        // Gray for English (Off), Primary for Qatar (On)
        isArabic
          ? "bg-primary border-primary/20"
          : "bg-gray-200 border-gray-300"
      } ${isTransitioning ? "pointer-events-none" : ""}`}
      role="button"
      aria-label={isArabic ? t("language.switchToEnglish") : t("language.switchToQatar")}
    >
      {/* Background Labels (Static) */}
      <div className="absolute inset-0 flex justify-between items-center px-2">
        <span
          className={`font-bold transition-colors duration-300 select-none ${
            mobile ? "text-xs" : "text-[10px]"
          } ${isArabic ? "text-white/40" : "text-gray-500"}`}
        >
          EN
        </span>
        <span
          className={`font-bold transition-colors duration-300 select-none ${
            mobile ? "text-xs" : "text-[10px]"
          } ${isArabic ? "text-white" : "text-gray-400"}`}
        >
          QA
        </span>
      </div>

      {/* Sliding Knob (RTL-safe) */}
      <div
        className={`absolute bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${mobile ? "w-8 h-8" : "w-6 h-6"}`}
        style={isArabic ? { right: mobile ? "0.25rem" : "0.25rem" } : { left: mobile ? "0.25rem" : "0.25rem" }}
        aria-hidden
      >
        <span
          className={`font-bold ${mobile ? "text-[10px]" : "text-[8px]"} text-primary`}
        >
          {isArabic ? "QA" : "EN"}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 w-screen overflow-visible z-[60] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg shadow-black/20"
            : "bg-white border-b border-gray-100 shadow-md shadow-black/10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-1 group relative z-[70]"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="text-primary transition-colors duration-300 group-hover:text-primary/90">
                  STEM
                </span>
                <span className="text-accent transition-colors duration-300 group-hover:text-accent/90">
                  PARK
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 relative z-[70]">
              {/* Desktop Search */}
              <div className="hidden md:block relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={toggleSearch}
                  aria-label={t("navbar.searchAria")}
                >
                  <Search className="w-5 h-5" />
                </Button>

                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-2 animate-fade-in">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("navbar.searchPlaceholder")}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Desktop Language Toggle (New Switch) */}
              <div className="hidden sm:block mx-2">
                <LanguageToggleSwitch />
              </div>

              {/* Cart Button */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label={t("navbar.cartAria")}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Actions */}
              <div className="flex items-center gap-2 border-l border-gray-300 pl-3 ml-1">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <User className="w-5 h-5 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white border border-gray-200 shadow-lg"
                    >
                      <DropdownMenuLabel>
                        {user.name || user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/settings"
                          className="w-full flex items-center"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          {t("user.settings")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/orders"
                          className="w-full flex items-center"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          {t("user.myOrders")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("auth.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login" className="hidden md:block">
                    <Button
                      size="sm"
                      className="rounded-full px-6 font-medium bg-primary text-white"
                    >
                      {t("auth.login")}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay (RTL-aware) */}
        <div
          className={`md:hidden fixed inset-0 top-16 bg-white z-50 transition-all duration-300 ease-in-out transform ${
            isOpen
              ? "translate-x-0 opacity-100 visible"
              : (isArabic ? "-translate-x-full opacity-0 invisible" : "translate-x-full opacity-0 invisible")
          }`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="h-full overflow-y-auto bg-white px-4 py-6 flex flex-col">
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("navbar.searchPlaceholder")}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
              <Button type="submit" className="bg-primary rounded-xl px-4">
                <Search className="w-5 h-5" />
              </Button>
            </form>

            <div className="space-y-2 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.icon}
                  <span className="text-lg">{t(link.key)}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
              {/* Mobile Language Toggle (New Switch) */}
              <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{t("language.label")}</span>
                <LanguageToggleSwitch mobile={true} />
              </div>

              {user ? (
                <div className="grid gap-2">
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500">{t("auth.welcome")}</p>
                    <p className="font-bold text-gray-900">
                      {user.name || user.email}
                    </p>
                  </div>
                  <Link
                    href="/account/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <Settings className="w-5 h-5" /> {t("user.settings")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full text-left"
                  >
                    <LogOut className="w-5 h-5" /> {t("auth.logout")}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-center shadow-lg hover:bg-primary/90 transition-colors"
                >
                  {t("auth.login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap with fixed navbar + 10px gap */}
      <div className="h-16 md:h-20 box-content pb-[10px]" />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        /* Prevent layout shift during language transition */
        html[lang="ar"],
        html[lang="qa"] {
          direction: rtl;
        }

        html[lang="en"] {
          direction: ltr;
        }

        /* Keep navbar structure LTR to avoid clipping/half-width on RTL pages */
        html[lang="ar"] nav,
        html[lang="qa"] nav {
          direction: ltr;
        }

        /* Allow nav items to still display RTL text properly */
        html[lang="ar"] nav .flex,
        html[lang="qa"] nav .flex {
          direction: rtl;
        }
      `}</style>
    </>
  );
};

export default Navbar;
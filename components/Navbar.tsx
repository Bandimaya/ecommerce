"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script"; // Import Script
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
import { useSettings } from "@/contexts/SettingsContext";
import { IMAGE_URL } from "@/lib/constants";

interface NavbarProps {
  onLanguageToggle?: (language: string) => void;
  currentLanguage?: string;
}

const Navbar = ({ onLanguageToggle }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { contact } = useSettings();

  // Language State
  const [currentLang, setCurrentLang] = useState("en");

  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  const { user, logout } = useUser();
  const navRef = useRef<HTMLDivElement>(null);

  // Initialize Language based on cookie
  // useEffect(() => {
  //   const getCookie = (name: string) => {
  //     const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  //     return v ? v[2] : null;
  //   };
  //   const langCookie = getCookie("googtrans");
  //   if (langCookie === "/en/ar" || langCookie === "/auto/ar") {
  //     setCurrentLang("ar");
  //   } else {
  //     setCurrentLang("en");
  //   }
  // }, []);

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

  // --- Custom Language Toggle Logic ---
  const clearTranslateCookies = () => {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

      if (name.trim().startsWith("googtrans")) {
        // Clear for current path
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

        // Clear for root domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;

        // Clear for dot domain (important)
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      }
    });
  };

  useEffect(() => {
    clearTranslateCookies();
  }, [])

  const handleLanguageSwitch = () => {
    const targetLang = currentLang === "en" ? "ar" : "en";

    // 🔥 clear all old Google Translate cookies
    clearTranslateCookies();

    // 🔥 set new language
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;

    // 🔁 reload AFTER cookie is set
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // const handleLanguageSwitch = () => {
  //   const targetLang = currentLang === "en" ? "ar" : "en";
  //   document.cookie = `googtrans=/en/${targetLang}; path=/;`;
  //   window.location.reload();
  // };

  const navLinks = [
    { label: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Shop", path: "/shop", icon: <Store className="w-5 h-5" /> },
    { label: "Courses", path: "/courses", icon: <Layers className="w-5 h-5" /> },
    { label: "Contact", path: "/contact", icon: <Phone className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => pathname === path;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* 3. HIDDEN GOOGLE TRANSLATE ELEMENTS */}
      {/* This div is required for the script to attach to, but we hide it */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Google Translate Init Script */}
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,ar',
                autoDisplay: false
              },
              'google_translate_element'
            );
          }
        `}
      </Script>

      {/* Google Translate External Script */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 w-screen overflow-visible z-[60] transition-all duration-300 ${scrolled
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
              {contact?.logo_url ? (
                <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] overflow-hidden rounded-full border-2 border-white shadow-sm flex-shrink-0">
                    <img
                      src={IMAGE_URL + contact?.logo_url}
                      alt="Logo"
                      className="w-full h-full object-contain"
                      style={{
                        display: "block",
                        maxWidth: "48px",
                        maxHeight: "48px",
                        width: "48px",
                        height: "48px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <span className="text-[18px] md:text-[22px] font-bold text-gray-900 hidden md:inline-block max-w-[160px] truncate leading-none site-brand">
                    STEM<span className="text-accent">PARK</span>
                  </span>
                </div>
              ) : (
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  <span className="text-primary">STEM</span>
                  <span className="text-accent">PARK</span>
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(link.path)}
                  onFocus={() => router.prefetch(link.path)}
                  onTouchStart={() => router.prefetch(link.path)}
                  onPointerDown={(e) => {
                    if (
                      e.button !== 0 ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.altKey
                    )
                      return;
                    e.preventDefault();
                    router.push(link.path);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(link.path);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {link.label}
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
                  aria-label={"Open search"}
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
                        placeholder={"Search products..."}
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

              {/* Custom Language Toggle (New Implementation) */}
              <div
                className="hidden md:flex items-center bg-gray-100 rounded-full p-1 cursor-pointer notranslate border border-gray-200"
                onClick={handleLanguageSwitch}
                title="Switch Language"
              >
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${currentLang === 'en' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  style={{ color: currentLang === 'en' ? 'var(--primary)' : undefined }}
                >
                  EN
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${currentLang === 'ar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  style={{ color: currentLang === 'ar' ? 'var(--primary)' : undefined }}
                >
                  AR
                </div>
              </div>

              {/* Cart Button */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label={"View cart"}
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
                      className="w-56 bg-white border border-gray-200 shadow-lg z-[100]"
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
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/orders"
                          className="w-full flex items-center"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login" className="hidden md:block">
                    <Button
                      size="sm"
                      className="rounded-full px-6 font-medium bg-primary text-white"
                    >
                      Login
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

        {/* Mobile Navigation Overlay */}
        <div
          className={`md:hidden fixed inset-0 top-16 bg-white z-50 transition-all duration-300 ease-in-out transform ${isOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
            }`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="h-full overflow-y-auto bg-white px-4 py-6 flex flex-col">
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={"Search products..."}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
              <Button type="submit" className="bg-primary rounded-xl px-4">
                <Search className="w-5 h-5" />
              </Button>
            </form>

            {/* Mobile Language Toggle */}
            <div
              className="flex w-full justify-center mb-6 notranslate"
              onClick={handleLanguageSwitch}
            >
              <div className="flex bg-gray-100 p-1 rounded-lg cursor-pointer">
                <div
                  className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-300 ${currentLang === 'en' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  style={{ color: currentLang === 'en' ? 'var(--primary)' : undefined }}
                >
                  English
                </div>
                <div
                  className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-300 ${currentLang === 'ar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  style={{ color: currentLang === 'ar' ? 'var(--primary)' : undefined }}
                >
                  العربية
                </div>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all ${isActive(link.path)
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {link.icon}
                  <span className="text-lg">{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
              {user ? (
                <div className="grid gap-2">
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500">Welcome</p>
                    <p className="font-bold text-gray-900">
                      {user.name || user.email}
                    </p>
                  </div>
                  <Link
                    href="/account/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full text-left"
                  >
                    <LogOut className="w-5 h-5" /> Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-center shadow-lg hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap with fixed navbar */}
      <div aria-hidden="true" className="h-16 md:h-20" />

      {/* 6. GLOBAL CSS TO HIDE GOOGLE WIDGETS */}
      <style jsx global>{`
        /* Hide Google Translate Toolbar and Icon completely */
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        /* Remove the top margin Google adds to the body */
        body {
          top: 0px !important;
        }
        
        /* Ensure the toggle itself isn't translated */
        .notranslate {
          translate: no;
        }

        /* Animation Keyframes */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-0.625rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn var(--anim-micro) var(--anim-ease) forwards;
          will-change: opacity, transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none !important;
          }
        }

        /* RTL Handling for Arabic */
        html[lang="ar"],
        html[lang="qa"] {
          direction: rtl;
        }

        html[lang="en"] {
          direction: ltr;
        }

        /* Navbar Layout Fixes for RTL */
        html[lang="ar"] nav,
        html[lang="qa"] nav {
          direction: ltr; /* Keep navbar layout LTR */
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
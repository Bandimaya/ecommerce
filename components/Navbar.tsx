"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
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

  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  const { user, logout } = useUser();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
      <div id="google_translate_element" style={{ display: "none" }}></div>

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

      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 w-full overflow-visible z-[9999] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg shadow-black/20"
            : "bg-white border-b border-gray-100 shadow-md shadow-black/10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 md:px-1 items-gap-20 items-center justify-between">
            {/* Logo Section - Left Side */}
            <div
              className="flex items-center gap-1 group relative z-[70]"
            >
              {/* UPDATED: gap-2 -> gap-[20px] for 20px gap on all screens */}
              <div className="flex items-center gap-[0px]">
                {/* UPDATED: Added md:-ml-[60px] to move left 60px on desktop */}
                <div className="w-[104px] h-[158px] md:w-[158px] md:h-[108px] flex-shrink-0 transition-all duration-300 -ml-[20px] md:-ml-[99px] rtl:-mr-[40px] md:rtl:-mr-[60px] rtl:ml-0">
                  <img
                    src="/assets/favicon.png"
                    alt="STEMPARK"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[20px] md:text-[22px] font-bold hidden md:inline-block max-w-[160px] truncate leading-none site-brand" style={{ color: 'var(--primary)' }}>
                  <span>STEM</span><span className="text-accent">PARK</span>
                </span>
              </div>
            </div>

            {/* Centered Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50">
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
                    {link.label}
                  </Link>
                ))}
              </div>
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
                  <div className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-2 animate-fade-in">
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
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Actions */}
              <div className="flex items-center gap-2 border-l rtl:border-r rtl:border-l-0 border-gray-300 pl-3 rtl:pr-3 rtl:pl-0 ml-1 rtl:mr-1 rtl:ml-0 relative z-[100]">
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
                      className="w-56 bg-white border border-gray-200 shadow-lg z-[99999]"
                    >
                      <DropdownMenuLabel>
                        {user.name || user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account/settings" className="w-full flex items-center">
                          <Settings className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="w-full flex items-center">
                          <Package className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
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
                className="md:hidden text-gray-600 hover:text-gray-900 ml-1 rtl:mr-1 rtl:ml-0"
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
      </nav>

      <div
        aria-hidden="true"
        className="relative block w-full shrink-0 h-16 md:h-20"
      />

      {/* Mobile Navigation Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-white z-50 transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "translate-x-0 opacity-100 visible"
            : "ltr:translate-x-full rtl:-translate-x-full opacity-0 invisible"
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
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full text-left rtl:text-right"
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

      <style jsx global>{`
        /* Hide Google Translate Toolbar */
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
        body {
          top: 0px !important;
        }
        .notranslate {
          translate: no;
        }

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

        /* RTL Handling */
        html[lang="ar"],
        html[lang="qa"] {
          direction: rtl;
        }

        html[lang="en"] {
          direction: ltr;
        }
      `}</style>
    </>
  );
};

export default Navbar;
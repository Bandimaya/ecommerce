"use client";

import { User as UserIcon, LogOut, Settings, LayoutDashboard, ShieldCheck, Menu, X, ChevronLeft, ChevronRight, Package, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Get CSS variable helper
const getCSSVar = (varName: string, fallback?: string) => {
  if (typeof window === 'undefined') return fallback || '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim() || fallback || '';
};

// Define User type interface
interface AppUser {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  // Add other user properties you expect
}

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

function Sidebar({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = usePathname();
  const { logout } = useUser();
  const router = useRouter();
  const { t } = useI18n();
  
  const navItems = [
    { labelKey: "admin.nav.dashboard", path: "/admin", icon: LayoutDashboard },
    { labelKey: "admin.nav.brands", path: "/admin/brands", icon: ShieldCheck },
    { labelKey: "admin.nav.programs", path: "/admin/programs", icon: ShieldCheck },
    { labelKey: "admin.nav.categories", path: "/admin/categories", icon: ShieldCheck },
    { labelKey: "admin.nav.products", path: "/admin/products", icon: Package },
    { labelKey: "admin.nav.orders", path: "/admin/orders", icon: ShieldCheck },
    { labelKey: "admin.nav.customers", path: "/admin/customers", icon: ShieldCheck },
    { labelKey: "admin.nav.contactInfo", path: "/admin/contact-info", icon: Phone },
    { labelKey: "admin.nav.customization", path: "/admin/customization", icon: Settings }
  ];

  const handleMobileLogout = () => {
    logout();
    router.push("/login");
    setIsMobileOpen(false);
  };

  const getColors = () => {
    return {
      primary: getCSSVar('--primary', '#3b82f6'),
      primaryForeground: getCSSVar('--primary-foreground', '#ffffff'),
      foreground: getCSSVar('--foreground', '#020817'),
      mutedForeground: getCSSVar('--muted-foreground', '#64748b'),
      border: getCSSVar('--border', '#e2e8f0'),
      card: getCSSVar('--card', '#ffffff'),
      background: getCSSVar('--background', '#f8fafc'),
      accent: getCSSVar('--accent', '#8b5cf6')
    };
  };

  const colors = getColors();

  return (
    <>
      {/* Mobile Full Screen Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '80px' : '280px'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex fixed left-0 top-0 h-screen flex-col z-50 overflow-hidden"
        style={{
          backgroundColor: colors.card,
          borderRight: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        {/* Logo Section */}
        <div 
          className="flex items-center justify-between px-4 py-5 border-b"
          style={{ borderColor: colors.border }}
        >
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center gap-1"
            >
              <span className="text-xl font-extrabold tracking-tight" style={{ color: colors.primary }}>
                STEM
              </span>
              <span className="text-xl font-extrabold tracking-tight" 
                style={{ color: colors.accent }}>
                PARK
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md ml-2"
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}>
                Admin
              </span>
            </motion.div>
          )}
          
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex justify-center"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}>
                <LayoutDashboard size={18} />
              </div>
            </motion.div>
          )}
          
          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: colors.mutedForeground }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm transition-all duration-200 group relative
                    ${isActive
                      ? "shadow-sm"
                      : "hover:bg-gray-50"
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? colors.primary : 'transparent',
                    color: isActive ? colors.primaryForeground : colors.mutedForeground,
                  }}
                >
                  <Icon 
                    className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`} 
                    size={20} 
                  />
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap font-medium"
                    >
                      {t(item.labelKey)}
                    </motion.span>
                  )}
                  {isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full ml-2 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-lg"
                      style={{
                        backgroundColor: colors.foreground,
                        color: colors.card
                      }}
                    >
                      {t(item.labelKey)}
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div 
          className="px-4 py-4 border-t"
          style={{ 
            borderColor: colors.border,
            color: colors.mutedForeground
          }}
        >
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm"
            >
              © {new Date().getFullYear()} STEM PARK Admin
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-center text-xs opacity-75"
            >
              © {new Date().getFullYear()}
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Full Screen Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col shadow-2xl"
            style={{ backgroundColor: colors.background }}
          >
            {/* Mobile Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}>
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold" style={{ color: colors.foreground }}>
                    Admin Panel
                  </h1>
                  <p className="text-xs" style={{ color: colors.mutedForeground }}>
                    Full Control Center
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                style={{ color: colors.mutedForeground }}
                aria-label="Close menu"
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-semibold mb-3 px-2 uppercase tracking-wider" 
                style={{ color: colors.mutedForeground }}
              >
                Admin Sections
              </motion.h3>
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm transition-all duration-200
                          ${isActive
                            ? "shadow-md"
                            : "hover:bg-gray-50"
                          }
                        `}
                        style={{
                          backgroundColor: isActive ? colors.primary : 'transparent',
                          color: isActive ? colors.primaryForeground : colors.foreground,
                        }}
                      >
                        <Icon size={22} />
                        <span className="font-medium">{t(item.labelKey)}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-4 border-t"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.card
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm" style={{ color: colors.mutedForeground }}>
                  © {new Date().getFullYear()} STEM PARK
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMobileLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('auth.logout')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface HeaderProps {
  toggleMobileSidebar: () => void;
  toggleDesktopSidebar: () => void;
  isCollapsed: boolean;
}

function Header({ toggleMobileSidebar, toggleDesktopSidebar, isCollapsed }: HeaderProps) {
  const { user, logout } = useUser() as { user: AppUser | null; logout: () => void };
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  // Get CSS variables
  const getColors = () => {
    return {
      primary: getCSSVar('--primary', '#3b82f6'),
      accent: getCSSVar('--accent', '#8b5cf6'),
      foreground: getCSSVar('--foreground', '#020817'),
      mutedForeground: getCSSVar('--muted-foreground', '#64748b'),
      border: getCSSVar('--border', '#e2e8f0'),
      card: getCSSVar('--card', '#ffffff')
    };
  };

  const colors = getColors();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Get current page title
  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  // Type guard to check if user has avatar
  const hasAvatar = (user: AppUser | null): user is AppUser & { avatar: string } => {
    return !!user && 'avatar' in user && !!user.avatar;
  };

  // Type guard to check if user has role
  const hasRole = (user: AppUser | null, role: string): boolean => {
    return !!user && 'role' in user && user.role === role;
  };

  return (
    <motion.header 
      initial={false}
      animate={{ 
        left: typeof window !== 'undefined' && window.innerWidth >= 1024 
          ? (isCollapsed ? '80px' : '280px') 
          : '0px' 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 z-40 h-16 md:h-20 bg-white/95 backdrop-blur-md shadow-sm border-b"
      style={{ borderColor: colors.border }}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Desktop Hamburger Menu */}
          <motion.button
            onClick={toggleDesktopSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: colors.mutedForeground }}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </motion.button>

          {/* Mobile Hamburger Menu */}
          <motion.button
            onClick={toggleMobileSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: colors.mutedForeground }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </motion.button>
          
          <div className="flex flex-col">
            <motion.h2 
              key={pathname}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold tracking-tight" 
              style={{ color: colors.foreground }}
            >
              {getPageTitle()}
            </motion.h2>
            <p className="text-xs hidden sm:block" style={{ color: colors.mutedForeground }}>
              Admin Panel Control
            </p>
          </div>
        </div>

        {/* Right Side - User */}
        <div className="flex items-center gap-3">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group outline-none"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border"
                    style={{
                      backgroundColor: `${colors.primary}10`,
                      borderColor: colors.border
                    }}>
                    {hasAvatar(user) ? (
                      <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5" style={{ color: colors.primary }} />
                    )}
                  </div>
                  {hasRole(user, "admin") && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 border-2 w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: colors.accent,
                        borderColor: colors.card
                      }}
                      title="Admin Verified" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold truncate max-w-[120px]" style={{ color: colors.foreground }}>
                    {user?.name || "Administrator"}
                  </p>
                  <p className="text-xs truncate max-w-[120px]" style={{ color: colors.mutedForeground }}>
                    {user?.email || "admin@stem-park.com"}
                  </p>
                </div>
              </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-56 p-2 rounded-xl shadow-xl border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}>
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate" style={{ color: colors.foreground }}>
                      {user?.name || "Administrator"}
                    </p>
                    {hasRole(user, "admin") && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary
                        }}>
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate"
                    style={{ color: colors.mutedForeground }}>
                    {user?.email || "admin@stem-park.com"}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />

              <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-gray-50">
                <Link href="/admin/profile" className="flex items-center w-full">
                  <UserIcon className="mr-3 h-4 w-4" style={{ color: colors.mutedForeground }} />
                  <span className="font-medium text-sm" style={{ color: colors.foreground }}>
                    {t('user.profile')}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-gray-50">
                <Link href="/admin/settings" className="flex items-center w-full">
                  <Settings className="mr-3 h-4 w-4" style={{ color: colors.mutedForeground }} />
                  <span className="font-medium text-sm" style={{ color: colors.foreground }}>
                    {t('user.settings')}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer py-2.5 rounded-lg focus:bg-red-50"
                style={{ color: '#ef4444' }}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-bold text-sm">{t('auth.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get CSS variables for main content
  const getColors = () => {
    return {
      background: getCSSVar('--background', '#f8fafc'),
      mutedForeground: getCSSVar('--muted-foreground', '#64748b'),
      foreground: getCSSVar('--foreground', '#020817'),
      card: getCSSVar('--card', '#ffffff'),
      border: getCSSVar('--border', '#e2e8f0')
    };
  };

  const colors = getColors();

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const toggleDesktopSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.background }}>
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <motion.div 
        initial={false}
        animate={{ 
          paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (isCollapsed ? '80px' : '280px')
            : '0px',
          paddingRight: '0px'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col w-full max-lg:!pl-0"
      >
        {/* Header */}
        <Header 
          isCollapsed={isCollapsed}
          toggleMobileSidebar={toggleMobileSidebar}
          toggleDesktopSidebar={toggleDesktopSidebar}
        />

        {/* Main Content */}
        <main className="pt-20 pb-10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 md:mb-8"
            >
              <div className="flex items-center text-sm" style={{ color: colors.mutedForeground }}>
                <Link href="/admin" className="hover:underline">Dashboard</Link>
                <span className="mx-2">/</span>
                <span className="font-medium" style={{ color: colors.foreground }}>
                  Current Page
                </span>
              </div>
            </motion.div>

            {/* Content Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border shadow-sm p-6 min-h-[calc(100vh-120px)]"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
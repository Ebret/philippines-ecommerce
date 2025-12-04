'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Search, ShoppingCart, User, ChevronDown, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  navigation?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  actions?: React.ReactNode;
  sticky?: boolean;
  variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({
  logo,
  title = 'Philippines E-Commerce',
  navigation = [],
  actions,
  sticky = true,
  variant = 'default',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const { data: session, status } = useSession();
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = session?.user;
  const userRole = (session?.user as any)?.role || 'BUYER';
  const userName = user?.name || user?.email || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header
      className={cn(
        'border-b border-border/50 bg-background/95 backdrop-blur-sm shadow-sm transition-all duration-300',
        sticky && 'sticky top-0 z-40'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo/Title - Enhanced with gradient and hover effects */}
          <div className="flex items-center gap-3 flex-shrink-0 group">
            {logo && (
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                {logo}
              </div>
            )}
            <Link
              href="/"
              className="relative text-2xl font-bold font-serif text-primary hover:text-primary/90 transition-all duration-300 group-hover:drop-shadow-lg"
            >
              {title}
              {/* Subtle underline animation */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
            </Link>
          </div>

          {/* Desktop Navigation - Enhanced with animations */}
          {navigation.length > 0 && (
            <nav className="hidden gap-8 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300 group"
                >
                  {/* Icon with color transition */}
                  {item.icon && (
                    <span className="transition-transform duration-300 group-hover:scale-110 group-hover:text-accent">
                      {item.icon}
                    </span>
                  )}
                  {item.label}

                  {/* Animated underline on hover */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
                </Link>
              ))}
            </nav>
          )}

          {/* Search Bar - Desktop Enhanced */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 group-focus-within:animate-pulse" />
            </div>
          </div>

          {/* Actions - Enhanced with animations */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted hover:text-primary rounded-lg transition-all duration-300 group"
              aria-label="Search"
            >
              <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            </button>

            {/* Cart Icon - Enhanced with badge animation */}
            <Link
              href="/cart"
              className="relative p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-300 border border-primary/20 hover:border-primary/50 group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {/* Animated badge */}
              <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-accent/50 animate-pulse">
                0
              </span>
            </Link>

            {/* User Menu - Enhanced with Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted hover:text-primary rounded-lg transition-all duration-300 group"
                  aria-label="User menu"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                      {userInitials}
                    </div>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border/50 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-border/50 bg-muted/50">
                      <p className="text-sm font-semibold text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                        {userRole}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/account/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                        <span>My Orders</span>
                      </Link>

                      {userRole === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      {userRole === 'SELLER' && (
                        <Link
                          href="/vendor/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <span>Seller Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/account/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-border/50 py-2">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted hover:text-primary rounded-lg transition-all duration-300 group"
                aria-label="Login"
              >
                <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            )}

            {actions}

            {/* Mobile Menu Button - Enhanced */}
            {navigation.length > 0 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 min-h-11 min-w-11 text-foreground hover:bg-muted hover:text-primary md:hidden transition-all duration-300 group"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Enhanced */}
        {searchOpen && (
          <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            </div>
          </div>
        )}

        {/* Mobile Navigation - Enhanced with smooth animations */}
        {mobileMenuOpen && navigation.length > 0 && (
          <nav className="border-t border-border/50 py-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <span className="transition-transform duration-300 group-hover:scale-110 group-hover:text-accent">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export { Header };


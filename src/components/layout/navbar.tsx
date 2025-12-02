'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Search, Moon, Sun, Leaf, Home, Package, Radio, Info, Phone, User } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import UserMenu from './user-menu';
import { SearchModal } from '@/components/search/search-modal';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme, isDark } = useTheme();
  const pathname = usePathname();

  const navigationItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Live Selling', href: '/live', icon: Radio },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-primary md:text-2xl hover:opacity-80 transition-opacity">
              <Leaf className="h-6 w-6 fill-primary/20" />
              <span>Extreme Life</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <Link href="/cart" className="p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors relative border border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  0
                </span>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden sm:block">
                <UserMenu />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          "fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-background border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Account</p>
                <p className="text-xs text-muted-foreground">Manage your profile</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}


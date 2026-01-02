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
      <nav className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-md">
        {/* Subtle bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo - Herb and Water style */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-colors">
                <Leaf className="h-5 w-5 text-[hsl(42,70%,65%)] fill-[hsl(42,70%,65%)]/20" />
              </div>
              <span className="font-serif text-xl md:text-2xl font-medium tracking-tight text-white group-hover:text-[hsl(42,70%,65%)] transition-colors">
                Extreme Life
              </span>
            </Link>

            {/* Desktop Navigation - PharmaPro style */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 text-sm font-semibold transition-all duration-250 rounded-lg",
                    pathname === item.href
                      ? "text-white bg-white/20"
                      : "text-white hover:text-white hover:bg-white/15"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Actions - Refined */}
            <div className="flex items-center gap-1.5">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 min-h-11 min-w-11 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button - Refined */}
              <Link href="/cart" className="p-2.5 min-h-11 min-w-11 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-250 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(42,70%,58%)] text-[10px] font-semibold text-[hsl(155,35%,12%)] shadow-sm">
                  0
                </span>
              </Link>

              {/* Theme Toggle - Refined */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2.5 min-h-11 min-w-11 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden sm:block">
                <UserMenu />
              </div>

              {/* Mobile Menu Button - Refined */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 min-h-11 min-w-11 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer - Herb and Water style */}
      <div
        className={cn(
          "fixed top-[72px] right-0 z-50 h-[calc(100vh-72px)] w-80 max-w-[85vw] bg-[hsl(155,28%,12%)] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-250",
                        isActive
                          ? "bg-white/10 text-[hsl(42,70%,65%)]"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
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
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[hsl(42,70%,65%)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Account</p>
                <p className="text-xs text-white/60">Manage your profile</p>
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


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Search, Moon, Sun, Leaf } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import UserMenu from './user-menu';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, isDark } = useTheme();

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Live Selling', href: '/live' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Extreme Life Herbal with Leaf Icon */}
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-primary md:text-2xl hover:opacity-80 transition-opacity">
            <Leaf className="h-6 w-6 fill-primary/20" />
            <span className="hidden sm:inline">Extreme Life</span>
            <span className="sm:hidden">Extreme Life</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <Link href="/cart" className="p-2 text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors relative border border-primary/20">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-in slide-in-from-top-2">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 py-2 border-t border-border mt-2 pt-2">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}


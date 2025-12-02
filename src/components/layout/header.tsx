'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';

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

  return (
    <header
      className={cn(
        'border-b border-border bg-background shadow-sm',
        sticky && 'sticky top-0 z-40'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <Link href="/" className="text-2xl font-bold font-serif text-primary hover:opacity-80 transition-opacity">
              {title}
            </Link>
          </div>

          {/* Desktop Navigation */}
          {navigation.length > 0 && (
            <nav className="hidden gap-8 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors border border-primary/20"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">0</span>
            </Link>

            {/* User Menu */}
            <Link
              href="/account/profile"
              className="p-2 min-h-11 min-w-11 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </Link>

            {actions}

            {/* Mobile Menu Button */}
            {navigation.length > 0 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 min-h-11 min-w-11 text-foreground hover:bg-muted md:hidden transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && navigation.length > 0 && (
          <nav className="border-t border-border py-4 md:hidden animate-in slide-in-from-top-2">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
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


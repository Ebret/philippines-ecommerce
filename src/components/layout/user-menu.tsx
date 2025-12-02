'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings, ShoppingBag, BarChart3, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark transition-colors font-semibold text-sm"
      >
        Login
      </Link>
    );
  }

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
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  // Role-based menu items
  const getRoleMenuItems = () => {
    const baseItems = [
      { label: 'Profile', href: '/account/profile', icon: User },
      { label: 'Settings', href: '/account/settings', icon: Settings },
    ];

    if (userRole === 'SELLER' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      baseItems.push({ label: 'Dashboard', href: '/vendor/dashboard', icon: BarChart3 });
    }

    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      baseItems.push({ label: 'Admin Panel', href: '/admin', icon: BarChart3 });
    }

    return baseItems;
  };

  const menuItems = getRoleMenuItems();

  return (
    <div ref={menuRef} className="relative">
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground text-sm font-bold">
          {userInitials}
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              {userRole}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="border-t border-border p-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


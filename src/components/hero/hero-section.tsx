'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/navbar';
import { useParallax } from '@/hooks/use-parallax';

/**
 * Hero Section Component with Parallax Effects
 *
 * Features:
 * - Multi-layer parallax scrolling for visual depth
 * - Smooth GPU-accelerated animations
 * - Responsive design with mobile optimization
 * - Dark mode support
 * - Accessibility compliant (respects reduced motion preference)
 */
export default function HeroSection() {
  // Parallax hooks for different layers (creates depth effect)
  const backgroundParallax = useParallax({ speed: 0.3, direction: 'up', maxOffset: 150 });
  const floatingParallax = useParallax({ speed: 0.5, direction: 'up', maxOffset: 200 });
  const contentParallax = useParallax({ speed: 0.1, direction: 'up', maxOffset: 50 });

  // Memoized transform styles for performance
  const backgroundStyle = useMemo(() => ({
    backgroundImage: 'url(/hero-banner.png)',
    transform: `translate3d(0, ${backgroundParallax.offset}px, 0)`,
    willChange: 'transform',
  }), [backgroundParallax.offset]);

  const floatingOrbStyles = useMemo(() => ({
    orb1: {
      transform: `translate3d(0, ${floatingParallax.offset * 0.8}px, 0)`,
      willChange: 'transform',
    },
    orb2: {
      transform: `translate3d(0, ${floatingParallax.offset * 1.2}px, 0)`,
      willChange: 'transform',
    },
    orb3: {
      transform: `translate3d(0, ${floatingParallax.offset * 0.6}px, 0)`,
      willChange: 'transform',
    },
  }), [floatingParallax.offset]);

  const contentStyle = useMemo(() => ({
    transform: `translate3d(0, ${contentParallax.offset}px, 0)`,
    willChange: 'transform',
  }), [contentParallax.offset]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 overflow-hidden">
      {/* Navigation Bar - Fixed, no parallax */}
      <Navbar />

      {/* Hero Background Image - Slow parallax for depth */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 transition-transform duration-100 ease-out motion-reduce:transform-none"
        style={backgroundStyle}
        aria-hidden="true"
      />

      {/* Animated Floating Orbs - Medium parallax for mid-layer depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={floatingOrbStyles.orb1}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={floatingOrbStyles.orb2}
        />
        <div
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={floatingOrbStyles.orb3}
        />
      </div>

      {/* Content - Subtle parallax for foreground layer */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8">
        <div
          className="max-w-4xl mx-auto text-center transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={contentStyle}
        >
          {/* Main Heading - Relivator Style */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Premium Herbal
              <span className="block bg-gradient-to-r from-accent-300 to-accent-100 dark:from-accent-200 dark:to-accent-300 bg-clip-text text-transparent">
                Wellness Solutions
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Discover nature's most powerful herbal products for your health, vitality, and wellness journey
          </p>

          {/* CTA Buttons - Using new Button component */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Link href="/products">
              <Button
                size="lg"
                variant="accent"
                className="text-lg px-8 py-6 h-auto"
              >
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:text-white"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust Signals - Enhanced with Relivator styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10">
            {/* Signal 1 */}
            <div className="flex flex-col items-center gap-3 animate-fade-in group">
              <div className="p-3 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-all duration-200">
                <ShieldCheck className="w-6 h-6 text-accent-300 dark:text-accent-200" />
              </div>
              <h3 className="text-white font-semibold group-hover:text-accent-200 transition-colors">100% Natural</h3>
              <p className="text-primary-200 dark:text-primary-300 text-sm">Pure herbal ingredients</p>
            </div>

            {/* Signal 2 */}
            <div className="flex flex-col items-center gap-3 animate-fade-in group">
              <div className="p-3 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-all duration-200">
                <Leaf className="w-6 h-6 text-accent-300 dark:text-accent-200" />
              </div>
              <h3 className="text-white font-semibold group-hover:text-accent-200 transition-colors">Organic Certified</h3>
              <p className="text-primary-200 dark:text-primary-300 text-sm">Trusted quality standards</p>
            </div>

            {/* Signal 3 */}
            <div className="flex flex-col items-center gap-3 animate-fade-in group">
              <div className="p-3 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-all duration-200">
                <Zap className="w-6 h-6 text-accent-300 dark:text-accent-200" />
              </div>
              <h3 className="text-white font-semibold group-hover:text-accent-200 transition-colors">Fast Results</h3>
              <p className="text-primary-200 dark:text-primary-300 text-sm">Proven effectiveness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <p className="text-primary-200 dark:text-primary-300 text-sm font-semibold">Scroll to explore</p>
          <svg
            className="w-5 h-5 text-primary-300 dark:text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}


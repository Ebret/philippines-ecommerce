'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/navbar';
import { useParallax } from '@/hooks/use-parallax';

/**
 * Hero Section Component - Herb and Water Inspired
 *
 * Features:
 * - Serene, nature-inspired gradient backgrounds
 * - Soft organic floating elements
 * - Elegant typography with Cormorant Garamond
 * - Smooth animations respecting reduced motion
 * - Full dark mode support
 */
export default function HeroSection() {
  // Parallax hooks for different layers (creates depth effect)
  const backgroundParallax = useParallax({ speed: 0.25, direction: 'up', maxOffset: 120 });
  const floatingParallax = useParallax({ speed: 0.4, direction: 'up', maxOffset: 180 });
  const contentParallax = useParallax({ speed: 0.08, direction: 'up', maxOffset: 40 });

  // Memoized transform styles for performance
  const backgroundStyle = useMemo(() => ({
    backgroundImage: 'url(/hero-banner.png)',
    transform: `translate3d(0, ${backgroundParallax.offset}px, 0)`,
    willChange: 'transform',
  }), [backgroundParallax.offset]);

  const floatingOrbStyles = useMemo(() => ({
    orb1: {
      transform: `translate3d(0, ${floatingParallax.offset * 0.7}px, 0)`,
      willChange: 'transform',
    },
    orb2: {
      transform: `translate3d(0, ${floatingParallax.offset * 1.1}px, 0)`,
      willChange: 'transform',
    },
    orb3: {
      transform: `translate3d(0, ${floatingParallax.offset * 0.5}px, 0)`,
      willChange: 'transform',
    },
    orb4: {
      transform: `translate3d(0, ${floatingParallax.offset * 0.9}px, 0)`,
      willChange: 'transform',
    },
  }), [floatingParallax.offset]);

  const contentStyle = useMemo(() => ({
    transform: `translate3d(0, ${contentParallax.offset}px, 0)`,
    willChange: 'transform',
  }), [contentParallax.offset]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Herb and Water Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(152,32%,25%)] via-[hsl(155,28%,18%)] to-[hsl(145,22%,22%)] dark:from-[hsl(155,35%,8%)] dark:via-[hsl(152,28%,10%)] dark:to-[hsl(145,25%,12%)]" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Navigation Bar - Fixed, no parallax */}
      <Navbar />

      {/* Hero Background Image - Slow parallax for depth */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-transform duration-100 ease-out motion-reduce:transform-none"
        style={backgroundStyle}
        aria-hidden="true"
      />

      {/* Organic Floating Elements - Soft, nature-inspired */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Main sage glow - top right */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb1,
            background: 'radial-gradient(circle, rgba(90, 148, 116, 0.25) 0%, transparent 70%)',
          }}
        />
        {/* Golden accent glow - bottom left */}
        <div
          className="absolute -bottom-40 -left-32 w-[450px] h-[450px] rounded-full blur-[90px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb2,
            background: 'radial-gradient(circle, rgba(229, 184, 74, 0.15) 0%, transparent 70%)',
          }}
        />
        {/* Secondary sage glow - center */}
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[80px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb3,
            background: 'radial-gradient(circle, rgba(107, 158, 122, 0.12) 0%, transparent 70%)',
          }}
        />
        {/* Mint accent - right center */}
        <div
          className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full blur-[70px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb4,
            background: 'radial-gradient(circle, rgba(74, 168, 138, 0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content - Subtle parallax for foreground layer */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 pt-20">
        <div
          className="max-w-5xl mx-auto text-center transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={contentStyle}
        >
          {/* Tagline badge */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[hsl(48,35%,92%)] text-sm font-medium">
              <Sparkles className="w-4 h-4 text-[hsl(42,70%,58%)]" />
              Nature&apos;s Healing Power
            </span>
          </div>

          {/* Main Heading - Herb and Water Style */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white mb-6 leading-[1.1] tracking-tight">
              Discover
              <span className="block mt-2 bg-gradient-to-r from-[hsl(42,70%,65%)] via-[hsl(48,65%,72%)] to-[hsl(42,60%,60%)] bg-clip-text text-transparent">
                Herbal Wellness
              </span>
            </h1>
          </div>

          {/* Subtitle - Elegant and readable */}
          <p className="text-lg sm:text-xl md:text-2xl text-[hsl(145,20%,75%)] dark:text-[hsl(145,18%,70%)] mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in font-light">
            Premium herbal products crafted from nature&apos;s finest botanicals for your health, vitality, and wellness journey
          </p>

          {/* CTA Buttons - Elegant pill shapes */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in">
            <Link href="/products">
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto rounded-full bg-gradient-to-r from-[hsl(42,70%,58%)] to-[hsl(42,75%,48%)] text-[hsl(155,35%,12%)] font-medium shadow-lg hover:shadow-xl hover:from-[hsl(42,75%,52%)] hover:to-[hsl(42,80%,42%)] transition-all duration-300 hover:-translate-y-1"
              >
                Explore Products
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto rounded-full border-2 border-white/25 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
              >
                Our Story
              </Button>
            </Link>
          </div>

          {/* Trust Signals - Refined cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-12 border-t border-white/10">
            {/* Signal 1 */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-fade-in group hover:bg-white/10 transition-all duration-300">
              <div className="p-4 bg-[hsl(152,32%,38%)]/30 rounded-xl group-hover:bg-[hsl(152,32%,38%)]/40 transition-all duration-300">
                <ShieldCheck className="w-7 h-7 text-[hsl(42,70%,65%)]" />
              </div>
              <h3 className="text-white font-serif text-lg font-medium group-hover:text-[hsl(42,70%,65%)] transition-colors">100% Natural</h3>
              <p className="text-[hsl(145,16%,60%)] text-sm leading-relaxed">Pure botanical ingredients sourced responsibly</p>
            </div>

            {/* Signal 2 */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-fade-in group hover:bg-white/10 transition-all duration-300">
              <div className="p-4 bg-[hsl(152,32%,38%)]/30 rounded-xl group-hover:bg-[hsl(152,32%,38%)]/40 transition-all duration-300">
                <Leaf className="w-7 h-7 text-[hsl(42,70%,65%)]" />
              </div>
              <h3 className="text-white font-serif text-lg font-medium group-hover:text-[hsl(42,70%,65%)] transition-colors">Quality Certified</h3>
              <p className="text-[hsl(145,16%,60%)] text-sm leading-relaxed">Trusted standards for premium wellness</p>
            </div>

            {/* Signal 3 */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-fade-in group hover:bg-white/10 transition-all duration-300">
              <div className="p-4 bg-[hsl(152,32%,38%)]/30 rounded-xl group-hover:bg-[hsl(152,32%,38%)]/40 transition-all duration-300">
                <Zap className="w-7 h-7 text-[hsl(42,70%,65%)]" />
              </div>
              <h3 className="text-white font-serif text-lg font-medium group-hover:text-[hsl(42,70%,65%)] transition-colors">Proven Results</h3>
              <p className="text-[hsl(145,16%,60%)] text-sm leading-relaxed">Time-tested formulas that deliver</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Refined */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <p className="text-[hsl(145,18%,60%)] text-xs uppercase tracking-widest font-medium">Explore</p>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-[hsl(42,70%,58%)] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

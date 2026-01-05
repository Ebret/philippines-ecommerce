'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, Zap, Heart, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/navbar';
import { useParallax } from '@/hooks/use-parallax';

/**
 * Hero Section Component - PharmaPro Drugstore Inspired
 *
 * Features:
 * - Professional healthcare gradient backgrounds
 * - Modern floating elements with aquamarine/blue accents
 * - Clean typography with Poppins font
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
      {/* PharmaPro Gradient Background - Professional Healthcare */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(155,50%,45%)] via-[hsl(175,45%,38%)] to-[hsl(224,60%,45%)] dark:from-[hsl(155,45%,18%)] dark:via-[hsl(175,40%,15%)] dark:to-[hsl(224,55%,22%)]" />

      {/* Modern geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0v20H0zm20 0L40 0v20H20zm0 0v20l20-20H20zm0 0H0l20 20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Navigation Bar - Fixed, no parallax */}
      <Navbar />

      {/* Hero Background Image - Slow parallax for depth */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 transition-transform duration-100 ease-out motion-reduce:transform-none"
        style={backgroundStyle}
        aria-hidden="true"
      />

      {/* Modern Floating Elements - Professional healthcare aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Primary aquamarine glow - top right */}
        <div
          className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full blur-[120px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb1,
            background: 'radial-gradient(circle, rgba(91, 193, 153, 0.35) 0%, transparent 70%)',
          }}
        />
        {/* Orange accent glow - bottom left (CTA energy) */}
        <div
          className="absolute -bottom-40 -left-32 w-[450px] h-[450px] rounded-full blur-[100px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb2,
            background: 'radial-gradient(circle, rgba(239, 101, 0, 0.18) 0%, transparent 70%)',
          }}
        />
        {/* Blue professional glow - center left */}
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[90px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb3,
            background: 'radial-gradient(circle, rgba(78, 114, 208, 0.15) 0%, transparent 70%)',
          }}
        />
        {/* Teal accent - right center */}
        <div
          className="absolute top-1/2 right-1/4 w-[320px] h-[320px] rounded-full blur-[80px] transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={{
            ...floatingOrbStyles.orb4,
            background: 'radial-gradient(circle, rgba(57, 179, 167, 0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content - Subtle parallax for foreground layer */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 pt-20">
        <div
          className="max-w-5xl mx-auto text-center transition-transform duration-100 ease-out motion-reduce:transform-none"
          style={contentStyle}
        >
          {/* Tagline badge - PharmaPro style */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold tracking-wide">
              <Heart className="w-4 h-4 text-[hsl(25,100%,55%)]" />
              Your Health, Our Priority
            </span>
          </div>

          {/* Main Heading - PharmaPro Professional Style */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.15] tracking-tight">
              Premium Herbal
              <span className="block mt-2 bg-gradient-to-r from-[hsl(25,100%,55%)] via-[hsl(25,95%,60%)] to-[hsl(45,90%,55%)] bg-clip-text text-transparent">
                Health Solutions
              </span>
            </h1>
          </div>

          {/* Subtitle - Clean and professional */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in font-normal">
            Trusted herbal products for your wellness journey. Quality certified, naturally sourced, delivered to your doorstep.
          </p>

          {/* CTA Buttons - PharmaPro style with orange accent */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in">
            <Link href="/products">
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto rounded-lg bg-[hsl(25,100%,47%)] hover:bg-[hsl(25,100%,42%)] text-white font-semibold shadow-lg shadow-[hsl(25,100%,47%)]/30 hover:shadow-xl hover:shadow-[hsl(25,100%,47%)]/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto rounded-lg border-2 border-white bg-transparent text-white hover:bg-white hover:text-[hsl(155,50%,35%)] backdrop-blur-sm transition-all duration-300 font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust Signals - Solid background cards for better readability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 pt-12 border-t border-white/15">
            {/* Signal 1 - FDA Approved */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg animate-fade-in group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold text-base">FDA Registered</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed text-center">Quality assured herbal products</p>
            </div>

            {/* Signal 2 - Natural Ingredients */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg animate-fade-in group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold text-base">100% Natural</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed text-center">Pure botanical ingredients</p>
            </div>

            {/* Signal 3 - Fast Delivery */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-slate-800 shadow-lg animate-fade-in group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Truck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold text-base">Fast Delivery</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed text-center">Nationwide shipping available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Modern style */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Scroll</p>
          <div className="w-6 h-10 rounded-full border-2 border-white/25 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-[hsl(25,100%,55%)] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { ShieldCheck, Leaf, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Premium Herbal
              <span className="block bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
                Wellness Solutions
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Discover nature's most powerful herbal products for your health, vitality, and wellness journey
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Link
              href="/products"
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-900 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 text-lg backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10">
            {/* Signal 1 */}
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-white font-semibold">100% Natural</h3>
              <p className="text-emerald-200 text-sm">Pure herbal ingredients</p>
            </div>

            {/* Signal 2 */}
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Leaf className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-white font-semibold">Organic Certified</h3>
              <p className="text-emerald-200 text-sm">Trusted quality standards</p>
            </div>

            {/* Signal 3 */}
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Zap className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-white font-semibold">Fast Results</h3>
              <p className="text-emerald-200 text-sm">Proven effectiveness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <p className="text-emerald-200 text-sm font-semibold">Scroll to explore</p>
          <svg
            className="w-5 h-5 text-emerald-300"
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


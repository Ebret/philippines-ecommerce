'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About Extreme Life Herbal</h1>
          <p className="text-xl text-green-100">
            Bringing natural wellness solutions to the Philippines since 2020
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Extreme Life Herbal, we are committed to providing high-quality, natural herbal products that promote health and wellness. Our mission is to make traditional herbal remedies accessible to everyone in the Philippines while maintaining the highest standards of quality and authenticity.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a Philippines where natural wellness is the first choice for health-conscious individuals. Through education, quality products, and exceptional customer service, we aim to be the leading provider of herbal solutions in Southeast Asia.
            </p>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Quality</h3>
                <p className="text-gray-700">
                  We source only the finest herbal ingredients and maintain strict quality control standards.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Authenticity</h3>
                <p className="text-gray-700">
                  All our products are genuine and tested for purity and potency.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Transparency</h3>
                <p className="text-gray-700">
                  We provide complete information about our products and their benefits.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Customer Care</h3>
                <p className="text-gray-700">
                  Your satisfaction and wellness journey is our top priority.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>100% natural and organic herbal products</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>Sourced from trusted local and international suppliers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>Rigorous quality testing and certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>Fast and reliable delivery across the Philippines</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>Expert customer support and product guidance</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>Competitive pricing with regular promotions</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Wellness Journey?</h3>
            <p className="text-gray-700 mb-6">
              Explore our collection of premium herbal products and find the perfect solution for your health needs.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Get in touch with our team for more information about our products and services.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}


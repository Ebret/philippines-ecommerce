import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Shield, Zap, Heart, MapPin, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'About Us | Extreme Life Herbal',
  description: 'Learn about Extreme Life Herbal - bringing natural wellness solutions to the Philippines since 2020.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Extreme Life Herbal</h1>
          <p className="text-xl text-emerald-100">
            Bringing natural wellness solutions to the Philippines since 2020
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              At Extreme Life Herbal, we are committed to providing high-quality, natural herbal products that promote health and wellness. Our mission is to make traditional herbal remedies accessible to everyone in the Philippines while maintaining the highest standards of quality and authenticity.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We envision a Philippines where natural wellness is the first choice for health-conscious individuals. Through education, quality products, and exceptional customer service, we aim to be the leading provider of herbal solutions in Southeast Asia.
            </p>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Quality</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We source only the finest herbal ingredients and maintain strict quality control standards.
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-3">
                  <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Authenticity</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  All our products are genuine and tested for purity and potency.
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Transparency</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We provide complete information about our products and their benefits.
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Customer Care</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Your satisfaction and wellness journey is our top priority.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Why Choose Us?</h2>
            <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-xl">✓</span>
                <span>100% natural and organic herbal products</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-xl">✓</span>
                <span>Sourced from trusted local and international suppliers</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-xl">✓</span>
                <span>Rigorous quality testing and certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-xl">✓</span>
                <span>Fast and reliable delivery across the Philippines</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-xl">✓</span>
                <span>Expert customer support and product guidance</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-3 text-xl">✓</span>
                <span>Competitive pricing with regular promotions</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-8 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Your Wellness Journey?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              Explore our collection of premium herbal products and find the perfect solution for your health needs.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Business Location Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Visit Our Office</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
              <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
              <p className="text-gray-700 dark:text-gray-300">
                35 Cambridge E. Rodriguez Cubao<br />
                Quezon City 1102<br />
                Philippines
              </p>
            </div>

            {/* Phone */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
              <Phone className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
              <a
                href="tel:+6328714285"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                (02) 8714 8285
              </a>
            </div>

            {/* Email */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <a
                href="mailto:extremelifeherbal@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors break-all"
              >
                extremelifeherbal@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Have Questions?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Get in touch with our team for more information about our products and services.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}


import HeroSection from '@/components/hero/hero-section';
import Link from 'next/link';
import { Star, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most popular herbal wellness products trusted by thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">🍃</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Herbal Tea
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Premium herbal tea blend for relaxation and wellness</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">(128 reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱19.99</p>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">💊</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Vitamin Supplement
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Natural vitamin supplement for daily vitality</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">(256 reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱29.99</p>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold">
                    Best Seller
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">🌿</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Herbal Oil
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Pure herbal oil extract for natural healing</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">(89 reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱39.99</p>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their health with our products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "These herbal products have completely changed my life! I feel more energetic and healthier than ever before."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Maria Johnson</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "Excellent quality and fast delivery! The customer service is outstanding. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  RC
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Robert Cruz</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "I've been using their products for 6 months now and the results are amazing. Worth every peso!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Angela Santos</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/testimonials"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-900 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Read More Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* Facebook Integration Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Follow Us on Facebook
                </h2>
                <p className="text-blue-100 text-lg mb-8">
                  Join our community of thousands of happy customers. Get exclusive deals, health tips, and product updates!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://web.facebook.com/extremelifeherbalproducts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Facebook className="w-6 h-6" />
                    Visit Our Page
                  </a>
                  <a
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white font-bold rounded-lg transition-all duration-300 border-2 border-white/50 hover:border-white hover:bg-white/30"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Facebook className="w-24 h-24 text-white mx-auto mb-4 opacity-80" />
                  <p className="text-blue-100 text-lg font-semibold">
                    Extreme Life Herbal Products
                  </p>
                  <p className="text-blue-200 text-sm mt-2">
                    Health food shop • Trusted by thousands
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions? We're here to help! Contact us anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Address</h3>
              <p className="text-gray-600 dark:text-gray-400">
                35 Cambridge E. Rodriguez Cubao<br />
                Quezon City 1102<br />
                Philippines
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="tel:+6328714285" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  (02) 8714 8285
                </a>
              </p>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="mailto:extremelifeherbal@gmail.com" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  extremelifeherbal@gmail.com
                </a>
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hours</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mon - Fri: 9AM - 6PM<br />
                Sat: 10AM - 4PM<br />
                Sun: Closed
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Send us a Message
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Extreme Life Herbal</h3>
              <p className="text-gray-400 mb-4">Premium herbal wellness products for your health journey</p>
              <a
                href="https://web.facebook.com/extremelifeherbalproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
              >
                <Facebook className="w-5 h-5" />
                Follow on Facebook
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
                <li><a href="/products" className="hover:text-emerald-400 transition">Products</a></li>
                <li><a href="/about" className="hover:text-emerald-400 transition">About</a></li>
                <li><a href="/testimonials" className="hover:text-emerald-400 transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-emerald-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Shipping</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Extreme Life Herbal Products. All rights reserved.</p>
            <p className="text-sm mt-2">35 Cambridge E. Rodriguez Cubao, Quezon City 1102, Philippines | (02) 8714 8285</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

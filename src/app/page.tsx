import HeroSection from '@/components/hero/hero-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most popular herbal wellness products trusted by thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl">🍃</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Herbal Tea
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Premium herbal tea blend for relaxation and wellness</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱19.99</p>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl">💊</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Vitamin Supplement
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Natural vitamin supplement for daily vitality</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱29.99</p>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold">
                    Best Seller
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-6xl">🌿</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Herbal Oil
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Pure herbal oil extract for natural healing</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱39.99</p>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Extreme Life Herbal</h3>
              <p className="text-gray-400">Premium herbal wellness products for your health journey</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
                <li><a href="/products" className="hover:text-emerald-400 transition">Products</a></li>
                <li><a href="/about" className="hover:text-emerald-400 transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Shipping</a></li>
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
            <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

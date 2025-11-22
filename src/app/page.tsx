import HeroSection from '@/components/hero/hero-section';
import Link from 'next/link';
import { Star, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products - Relivator Styling */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Discover our most popular herbal wellness products trusted by thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card variant="elevated" interactive className="group overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">🍃</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Herbal Tea
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Premium herbal tea blend for relaxation and wellness</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                  ))}
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">(128 reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">₱19.99</p>
                  <Badge variant="default">Popular</Badge>
                </div>
                <Button className="w-full" size="default">
                  Add to Cart
                </Button>
              </div>
            </Card>

            {/* Product 2 */}
            <Card variant="elevated" interactive className="group overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">💊</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Vitamin Supplement
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Natural vitamin supplement for daily vitality</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                  ))}
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">(256 reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">₱29.99</p>
                  <Badge variant="accent">Best Seller</Badge>
                </div>
                <Button className="w-full" size="default">
                  Add to Cart
                </Button>
              </div>
            </Card>

            {/* Product 3 */}
            <Card variant="elevated" interactive className="group overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">🌿</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Herbal Oil
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Pure herbal oil extract for natural healing</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                  ))}
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">(89 reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">₱39.99</p>
                  <Badge variant="secondary">Premium</Badge>
                </div>
                <Button className="w-full" size="default">
                  Add to Cart
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="px-8 py-6 h-auto text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section - Relivator Styling */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their health with our products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card variant="default" interactive>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6 italic">
                "These herbal products have completely changed my life! I feel more energetic and healthier than ever before."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">Maria Johnson</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Verified Buyer</p>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card variant="default" interactive>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6 italic">
                "Excellent quality and fast delivery! The customer service is outstanding. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                  RC
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">Robert Cruz</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Verified Buyer</p>
                </div>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card variant="default" interactive>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6 italic">
                "I've been using their products for 6 months now and the results are amazing. Worth every peso!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">Angela Santos</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Verified Buyer</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button size="lg" variant="accent" className="px-8 py-6 h-auto text-lg">
                Read More Testimonials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facebook Integration Section - Relivator Styling */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="max-w-7xl mx-auto">
          <Card variant="elevated" className="bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-700 dark:to-secondary-800 border-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Follow Us on Facebook
                </h2>
                <p className="text-secondary-100 text-lg mb-8">
                  Join our community of thousands of happy customers. Get exclusive deals, health tips, and product updates!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://web.facebook.com/extremelifeherbalproducts"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="gap-2 px-8 py-6 h-auto text-lg bg-white text-secondary-600 hover:bg-secondary-50"
                    >
                      <Facebook className="w-6 h-6" />
                      Visit Our Page
                    </Button>
                  </a>
                  <Link href="/products">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 px-8 py-6 h-auto text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:text-white"
                    >
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Facebook className="w-24 h-24 text-white mx-auto mb-4 opacity-80" />
                  <p className="text-secondary-100 text-lg font-semibold">
                    Extreme Life Herbal Products
                  </p>
                  <p className="text-secondary-200 text-sm mt-2">
                    Health food shop • Trusted by thousands
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Information Section - Relivator Styling */}
      <section className="py-20 px-4 md:px-8 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Have questions? We're here to help! Contact us anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address */}
            <Card variant="default" interactive className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Address</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                35 Cambridge E. Rodriguez Cubao<br />
                Quezon City 1102<br />
                Philippines
              </p>
            </Card>

            {/* Phone */}
            <Card variant="default" interactive className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Phone</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                <a href="tel:+6328714285" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
                  (02) 8714 8285
                </a>
              </p>
            </Card>

            {/* Email */}
            <Card variant="default" interactive className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Email</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                <a href="mailto:extremelifeherbal@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition">
                  extremelifeherbal@gmail.com
                </a>
              </p>
            </Card>

            {/* Hours */}
            <Card variant="default" interactive className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Hours</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Mon - Fri: 9AM - 6PM<br />
                Sat: 10AM - 4PM<br />
                Sun: Closed
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-6 h-auto text-lg">
                Send us a Message
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Relivator Styling */}
      <footer className="bg-neutral-900 dark:bg-black text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-primary-300">Extreme Life Herbal</h3>
              <p className="text-neutral-400 mb-4">Premium herbal wellness products for your health journey</p>
              <a
                href="https://web.facebook.com/extremelifeherbalproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
                Follow on Facebook
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary-300">Quick Links</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/" className="hover:text-primary-400 transition-colors duration-200">Home</a></li>
                <li><a href="/products" className="hover:text-primary-400 transition-colors duration-200">Products</a></li>
                <li><a href="/about" className="hover:text-primary-400 transition-colors duration-200">About</a></li>
                <li><a href="/testimonials" className="hover:text-primary-400 transition-colors duration-200">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary-300">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/contact" className="hover:text-primary-400 transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">Shipping</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary-300">Legal</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">Terms</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors duration-200">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
            <p>&copy; 2025 Extreme Life Herbal Products. All rights reserved.</p>
            <p className="text-sm mt-2">35 Cambridge E. Rodriguez Cubao, Quezon City 1102, Philippines | (02) 8714 8285</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

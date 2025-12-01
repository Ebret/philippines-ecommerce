import HeroSection from '@/components/hero/hero-section';
import Link from 'next/link';
import { Star, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Navbar */}
      <HeroSection />

      {/* Featured Products - Extreme Life Styling */}
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular herbal wellness products trusted by thousands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card variant="product" className="group">
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-105">🍃</span>
                <Badge variant="category" size="sm" className="absolute top-3 right-3">
                  Herbal Tea
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                  Premium Herbal Tea Blend
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">Premium herbal tea blend for relaxation and wellness</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(128)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">₱199</span>
                  <Badge variant="default" size="sm">Popular</Badge>
                </div>
                <Button className="w-full" rounded="full">
                  Add to Cart
                </Button>
              </div>
            </Card>

            {/* Product 2 */}
            <Card variant="product" className="group">
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-105">💊</span>
                <Badge variant="category" size="sm" className="absolute top-3 right-3">
                  Supplements
                </Badge>
                <Badge variant="discount" size="sm" className="absolute top-3 left-3">
                  -20%
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                  Natural Vitamin Supplement
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">Natural vitamin supplement for daily vitality</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(256)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">₱299</span>
                  <Badge variant="accent" size="sm">Best Seller</Badge>
                </div>
                <Button className="w-full" rounded="full">
                  Add to Cart
                </Button>
              </div>
            </Card>

            {/* Product 3 */}
            <Card variant="product" className="group">
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-105">🌿</span>
                <Badge variant="category" size="sm" className="absolute top-3 right-3">
                  Essential Oils
                </Badge>
                <Badge variant="inStock" size="sm" className="absolute bottom-3 left-3">
                  In Stock
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                  Pure Herbal Oil Extract
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">Pure herbal oil extract for natural healing</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(89)</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">₱399</span>
                  <Badge variant="secondary" size="sm">Premium</Badge>
                </div>
                <Button className="w-full" rounded="full">
                  Add to Cart
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" rounded="full" className="px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section - Extreme Life Styling */}
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their health with our products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic">
                "These herbal products have completely changed my life! I feel more energetic and healthier than ever before."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-foreground">Maria Johnson</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic">
                "Excellent quality and fast delivery! The customer service is outstanding. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                  RC
                </div>
                <div>
                  <p className="font-semibold text-foreground">Robert Cruz</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic">
                "I've been using their products for 6 months now and the results are amazing. Worth every peso!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">
                  AS
                </div>
                <div>
                  <p className="font-semibold text-foreground">Angela Santos</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button size="lg" variant="accent" rounded="full" className="px-8">
                Read More Testimonials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facebook Integration Section - Extreme Life Styling */}
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <Card variant="elevated" className="bg-primary border-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                  Follow Us on Facebook
                </h2>
                <p className="text-primary-foreground/90 text-lg mb-8">
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
                      rounded="full"
                      className="gap-2 px-8 bg-background text-primary hover:bg-background/90"
                    >
                      <Facebook className="w-6 h-6" />
                      Visit Our Page
                    </Button>
                  </a>
                  <Link href="/products">
                    <Button
                      size="lg"
                      variant="outline"
                      rounded="full"
                      className="gap-2 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
                    >
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Facebook className="w-24 h-24 text-primary-foreground mx-auto mb-4 opacity-80" />
                  <p className="text-primary-foreground text-lg font-semibold">
                    Extreme Life Herbal Products
                  </p>
                  <p className="text-primary-foreground/80 text-sm mt-2">
                    Health food shop • Trusted by thousands
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Information Section - Extreme Life Styling */}
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help! Contact us anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address */}
            <Card variant="elevated" className="text-center p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Address</h3>
              <p className="text-muted-foreground text-sm">
                35 Cambridge E. Rodriguez Cubao<br />
                Quezon City 1102<br />
                Philippines
              </p>
            </Card>

            {/* Phone */}
            <Card variant="elevated" className="text-center p-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground text-sm">
                <a href="tel:+6328714285" className="hover:text-primary transition">
                  (02) 8714 8285
                </a>
              </p>
            </Card>

            {/* Email */}
            <Card variant="elevated" className="text-center p-6">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground text-sm">
                <a href="mailto:extremelifeherbal@gmail.com" className="hover:text-primary transition">
                  extremelifeherbal@gmail.com
                </a>
              </p>
            </Card>

            {/* Hours */}
            <Card variant="elevated" className="text-center p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">Hours</h3>
              <p className="text-muted-foreground text-sm">
                Mon - Fri: 9AM - 6PM<br />
                Sat: 10AM - 4PM<br />
                Sun: Closed
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" rounded="full" className="px-8">
                Send us a Message
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Extreme Life Styling */}
      <footer className="bg-primary text-primary-foreground py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">Extreme Life Herbal</h3>
              <p className="text-primary-foreground/80 mb-4 text-sm">Premium herbal wellness products for your health journey</p>
              <a
                href="https://web.facebook.com/extremelifeherbalproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
                Follow on Facebook
              </a>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li><a href="/" className="hover:text-primary-foreground transition-colors duration-200">Home</a></li>
                <li><a href="/products" className="hover:text-primary-foreground transition-colors duration-200">Products</a></li>
                <li><a href="/about" className="hover:text-primary-foreground transition-colors duration-200">About</a></li>
                <li><a href="/testimonials" className="hover:text-primary-foreground transition-colors duration-200">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li><a href="/contact" className="hover:text-primary-foreground transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors duration-200">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors duration-200">Shipping</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors duration-200">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li><a href="#" className="hover:text-primary-foreground transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors duration-200">Terms</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors duration-200">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
            <p className="text-sm">&copy; 2025 Extreme Life Herbal Products. All rights reserved.</p>
            <p className="text-xs mt-2">35 Cambridge E. Rodriguez Cubao, Quezon City 1102, Philippines | (02) 8714 8285</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

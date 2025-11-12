export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Extreme Life Herbal</h1>
          <ul className="flex gap-6">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Extreme Life Herbal</h2>
          <p className="text-xl mb-8">Premium herbal products for your health and wellness</p>
          <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2">Herbal Tea</h4>
              <p className="text-gray-600 mb-4">Premium herbal tea blend</p>
              <p className="text-2xl font-bold text-green-600 mb-4">$19.99</p>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Add to Cart
              </button>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2">Vitamin Supplement</h4>
              <p className="text-gray-600 mb-4">Natural vitamin supplement</p>
              <p className="text-2xl font-bold text-green-600 mb-4">$29.99</p>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Add to Cart
              </button>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2">Herbal Oil</h4>
              <p className="text-gray-600 mb-4">Pure herbal oil extract</p>
              <p className="text-2xl font-bold text-green-600 mb-4">$39.99</p>
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">
                China Palace
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 font-medium">Home</Link>
              <Link href="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
              <Link href="/checkout" className="text-gray-700 hover:text-gray-900">Checkout</Link>
            </nav>
            <div className="md:hidden">
              <button className="text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Authentic Chinese Cuisine
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Delicious dishes made with fresh ingredients and traditional recipes. 
                Order online for collection or delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/menu"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors text-center"
                >
                  Order Now
                </Link>
                <Link 
                  href="/menu"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors text-center"
                >
                  View Menu
                </Link>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-800/20 z-10"></div>
                <div className="absolute inset-0 bg-gray-900/30 z-20"></div>
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🥢</div>
                    <div className="text-2xl font-semibold">Fresh & Authentic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose China Palace?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering the best Chinese dining experience with quality ingredients and authentic recipes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍜</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Recipes</h3>
              <p className="text-gray-600">Traditional Chinese recipes passed down through generations, ensuring authentic flavors.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We use only the freshest ingredients, sourced locally whenever possible.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick delivery and collection service to ensure your food arrives hot and fresh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Dishes
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most loved dishes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-4xl">🦆</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aromatic Duck</h3>
                <p className="text-gray-600 mb-4">Crispy aromatic duck with pancakes, spring onion & cucumber.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">£9.00</span>
                  <Link 
                    href="/menu"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-4xl">🍛</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Meal A</h3>
                <p className="text-gray-600 mb-4">Complete meal for two people with your choice of main course.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">£10.00</span>
                  <Link 
                    href="/menu"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">🥘</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Special Dishes</h3>
                <p className="text-gray-600 mb-4">Explore our chef's special selection of authentic Chinese dishes.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">From £8.50</span>
                  <Link 
                    href="/menu"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Browse our full menu and place your order online for collection or delivery.
          </p>
          <Link 
            href="/menu"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Start Ordering
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">China Palace</h3>
              <p className="text-gray-400">
                Authentic Chinese cuisine delivered to your door.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">12 Barnsley Road</p>
              <p className="text-gray-400 mb-2">Hemsworth, Pontefract</p>
              <p className="text-gray-400 mb-2">WF9 4PY</p>
              <p className="text-gray-400">01977 123456</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Opening Hours</h4>
              <p className="text-gray-400 mb-1">Mon: 12:00-15:00, 17:00-23:00</p>
              <p className="text-gray-400 mb-1">Tue: Closed</p>
              <p className="text-gray-400 mb-1">Wed: 12:00-15:00, 17:00-23:00</p>
              <p className="text-gray-400 mb-1">Thu: 12:00-15:00, 17:00-23:00</p>
              <p className="text-gray-400 mb-1">Fri-Sun: 16:00-00:00</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/menu" className="text-gray-400 hover:text-white">Menu</Link></li>
                <li><Link href="/checkout" className="text-gray-400 hover:text-white">Order Online</Link></li>
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 China Palace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
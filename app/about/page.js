"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Social Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="fa fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="fa fa-facebook text-xl"></i>
              </a>
            </div>
            
            {/* Navigation Left */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 font-medium">Home</Link>
              <Link href="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
              <Link href="/feedback" className="text-gray-700 hover:text-gray-900">Feedback</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact Us</Link>
            </nav>
            
            {/* Logo */}
            <div className="flex items-center">
              <Image 
                src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/logo/logo01.png"
                alt="China Palace"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            
            {/* Navigation Right */}
            <div className="hidden md:flex space-x-8"></div>
            
            {/* Login/Register */}
            <div className="hidden md:flex items-center space-x-2">
              <i className="fa fa-user-circle-o text-gray-600"></i>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">login</Link>
              <span className="text-gray-600">or</span>
              <Link href="/register" className="text-gray-700 hover:text-gray-900">Register</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8">About China Palace</h1>
            
            <div className="prose max-w-none">
              <div className="text-center mb-8">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/logo/logo01.png"
                  alt="China Palace"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Welcome to China Palace</h2>
              <p className="mb-4">
                Located in the heart of Hemsworth, China Palace has been serving authentic Chinese cuisine to the local community for many years. We pride ourselves on using fresh ingredients and traditional cooking methods to create delicious meals that satisfy every palate.
              </p>

              <h2 className="text-xl font-semibold mb-4">Our Story</h2>
              <p className="mb-4">
                China Palace was established with a simple mission: to bring the authentic flavors of Chinese cuisine to Pontefract and surrounding areas. Our experienced chefs combine traditional recipes with modern cooking techniques to create dishes that are both familiar and exciting.
              </p>

              <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Fresh, high-quality ingredients sourced locally where possible</li>
                <li>Traditional Chinese cooking methods and recipes</li>
                <li>Convenient online ordering for collection and delivery</li>
                <li>Friendly, professional service</li>
                <li>Set meals perfect for families and groups</li>
                <li>Customizable options to suit dietary preferences</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">Our Location</h2>
              <div className="mb-4">
                <p><strong>Address:</strong> 12 Barnsley Road, Hemsworth, Pontefract, WF9 4PY</p>
                <p><strong>Phone:</strong> Available on our contact page</p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
              <div className="mb-4">
                <p><strong>Monday, Wednesday, Thursday:</strong> 12:00-15:00, 17:00-23:00</p>
                <p><strong>Tuesday:</strong> Closed</p>
                <p><strong>Friday, Saturday, Sunday:</strong> 16:00-00:00</p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Order Online</h2>
              <p className="mb-4">
                Skip the wait and order online for collection or delivery. Our easy-to-use website lets you browse our menu, customize your order, and track your delivery all in one place.
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/menu" 
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
              >
                View Our Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ul className="flex flex-wrap justify-center space-x-6 mb-4">
              <li><Link href="/" className="text-gray-700 hover:text-gray-900">HOME</Link></li>
              <li><Link href="/about" className="text-gray-700 hover:text-gray-900">ABOUT US</Link></li>
              <li><Link href="/terms" className="text-gray-700 hover:text-gray-900">TERMS & CONDITIONS</Link></li>
              <li><Link href="/privacy" className="text-gray-700 hover:text-gray-900">PRIVACY POLICY</Link></li>
              <li><Link href="/cookies" className="text-gray-700 hover:text-gray-900">COOKIE POLICY</Link></li>
              <li><Link href="/disclaimer" className="text-gray-700 hover:text-gray-900">SERVICE DISCLAIMER</Link></li>
              <li><Link href="/contact" className="text-gray-700 hover:text-gray-900">CONTACT US</Link></li>
            </ul>
            <p className="text-gray-600">
              China Palace © 2025. All rights reserved. Designed By China Palace
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
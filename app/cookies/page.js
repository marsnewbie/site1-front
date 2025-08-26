"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function CookiesPage() {
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
            <h1 className="text-3xl font-bold text-center mb-8">Cookie Policy</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They help us provide you with a better experience by remembering your preferences and improving site functionality.
              </p>

              <h2 className="text-xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="mb-4">
                We use cookies to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Remember your cart items and preferences</li>
                <li>Keep you logged in to your account</li>
                <li>Analyze site usage to improve our services</li>
                <li>Provide personalized content and recommendations</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
              <div className="mb-4">
                <h3 className="font-semibold">Essential Cookies:</h3>
                <p className="mb-2">These are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
                
                <h3 className="font-semibold">Performance Cookies:</h3>
                <p className="mb-2">These collect information about how visitors use our website, helping us improve site performance.</p>
                
                <h3 className="font-semibold">Functionality Cookies:</h3>
                <p className="mb-2">These remember choices you make and provide enhanced features and personalization.</p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
              <p className="mb-4">
                You can control and manage cookies in your browser settings. Please note that disabling certain cookies may affect the functionality of our website.
              </p>

              <h2 className="text-xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="mb-4">
                We may use third-party services that set cookies, such as analytics tools and payment processors. These have their own privacy policies and cookie policies.
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Last updated: January 2025
              </p>
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
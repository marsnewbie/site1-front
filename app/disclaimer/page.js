"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function DisclaimerPage() {
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
            <h1 className="text-3xl font-bold text-center mb-8">Service Disclaimer</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">General Disclaimer</h2>
              <p className="mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, China Palace excludes all representations, warranties, undertakings and guarantees relating to this website and its contents.
              </p>

              <h2 className="text-xl font-semibold mb-4">Service Availability</h2>
              <p className="mb-4">
                We strive to ensure our online ordering service is available 24/7, but we cannot guarantee continuous, uninterrupted access. We may need to suspend service for maintenance or due to circumstances beyond our control.
              </p>

              <h2 className="text-xl font-semibold mb-4">Delivery Times</h2>
              <p className="mb-4">
                Estimated delivery and collection times are provided as a guide only. Actual times may vary due to factors including weather conditions, traffic, order volume, and other circumstances beyond our control.
              </p>

              <h2 className="text-xl font-semibold mb-4">Food Safety and Allergens</h2>
              <p className="mb-4">
                While we take all reasonable precautions to ensure food safety and accurate allergen information, we cannot guarantee that our dishes are completely free from allergens or suitable for all dietary requirements. Customers with allergies should inform us when placing orders.
              </p>

              <h2 className="text-xl font-semibold mb-4">Pricing and Availability</h2>
              <p className="mb-4">
                Prices and menu items shown on this website are subject to change without notice. We reserve the right to refuse orders and may be unable to fulfill orders due to ingredient availability.
              </p>

              <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
              <p className="mb-4">
                We may use third-party services for payment processing, delivery, and other functions. We are not responsible for the performance or policies of these third parties.
              </p>

              <h2 className="text-xl font-semibold mb-4">Website Content</h2>
              <p className="mb-4">
                The content on this website, including images, descriptions, and nutritional information, is provided for general information purposes only and may not reflect the exact appearance or composition of menu items.
              </p>

              <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                China Palace shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of this website or our services, except as required by law.
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Last updated: January 2025
              </p>
              <p className="text-sm text-gray-600 mt-2">
                If you have any questions about this disclaimer, please contact us.
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
"use client";
import Link from 'next/link';
import Header from '../components/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Contact China Palace</h1>
            <p className="text-gray-600 text-lg">
              Get in touch with us for orders, questions, or feedback
            </p>
          </div>
          
          {/* Contact Information - Full Width */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Get in Touch</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <i className="fa fa-map-marker text-red-600 text-xl mr-4 mt-1"></i>
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">
                        12 Barnsley Road<br/>
                        Hemsworth, Pontefract<br/>
                        WF9 4PY
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <i className="fa fa-phone text-red-600 text-xl mr-4 mt-1"></i>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">
                        Call us during opening hours<br/>
                        01977 123456
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <i className="fa fa-envelope text-red-600 text-xl mr-4 mt-1"></i>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">
                        info@chinapalace.co.uk<br/>
                        orders@chinapalace.co.uk
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start">
                    <i className="fa fa-clock-o text-red-600 text-xl mr-4 mt-1"></i>
                    <div>
                      <h3 className="font-semibold">Opening Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p><strong>Monday:</strong> 12:00-15:00, 17:00-23:00</p>
                        <p><strong>Tuesday:</strong> Closed</p>
                        <p><strong>Wednesday:</strong> 12:00-15:00, 17:00-23:00</p>
                        <p><strong>Thursday:</strong> 12:00-15:00, 17:00-23:00</p>
                        <p><strong>Friday:</strong> 16:00-00:00</p>
                        <p><strong>Saturday:</strong> 16:00-00:00</p>
                        <p><strong>Sunday:</strong> 16:00-00:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-red-600 hover:text-red-700">
                    <i className="fa fa-facebook text-2xl"></i>
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-700">
                    <i className="fa fa-instagram text-2xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Online CTA */}
          <div className="mt-12 text-center">
            <div className="bg-red-600 text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
              <p className="text-lg mb-6">
                Skip the phone call and order online for faster service!
              </p>
              <Link 
                href="/menu" 
                className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Order Online Now
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
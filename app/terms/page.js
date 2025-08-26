"use client";
import Link from 'next/link';
import Header from '../components/Header';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">1. General</h2>
              <p className="mb-4">
                These terms and conditions apply to your use of the China Palace online ordering service. By placing an order, you agree to be bound by these terms.
              </p>

              <h2 className="text-xl font-semibold mb-4">2. Orders and Payment</h2>
              <p className="mb-4">
                All orders are subject to acceptance by China Palace. We reserve the right to refuse any order without giving reasons. Payment is required at the time of order placement for delivery orders, or on collection for collection orders.
              </p>

              <h2 className="text-xl font-semibold mb-4">3. Delivery</h2>
              <p className="mb-4">
                We deliver to selected areas only. Delivery charges apply as shown on the website. We aim to deliver within the estimated time, but this is not guaranteed. We are not liable for delays due to circumstances beyond our control.
              </p>

              <h2 className="text-xl font-semibold mb-4">4. Collection</h2>
              <p className="mb-4">
                Collection orders can be collected from our premises during opening hours. Please bring your order confirmation. We are not responsible for orders not collected within reasonable time.
              </p>

              <h2 className="text-xl font-semibold mb-4">5. Cancellation and Refunds</h2>
              <p className="mb-4">
                If you need to cancel your order, please contact our restaurant as soon as possible. We will do our best to accommodate cancellation requests, though this may not always be possible depending on the preparation stage of your order. Refunds and cancellations are handled at our discretion and may be subject to charges depending on the circumstances.
              </p>

              <h2 className="text-xl font-semibold mb-4">6. Food Safety and Allergies</h2>
              <p className="mb-4">
                Please inform us of any allergies or dietary requirements when placing your order. While we take care to avoid cross-contamination, we cannot guarantee that our dishes are completely free from allergens.
              </p>

              <h2 className="text-xl font-semibold mb-4">7. Liability</h2>
              <p className="mb-4">
                Our liability is limited to the value of your order. We are not liable for any indirect or consequential losses.
              </p>

              <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="mb-4">
                We may update these terms from time to time. The current version will always be available on our website.
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
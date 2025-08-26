"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Try to get order data from sessionStorage first
    if (typeof window !== 'undefined') {
      const storedOrderData = sessionStorage.getItem('lastOrderData');
      if (storedOrderData) {
        try {
          const parsedData = JSON.parse(storedOrderData);
          setOrderData(parsedData);
          // Clear the data after displaying
          sessionStorage.removeItem('lastOrderData');
        } catch (e) {
          console.error('Error parsing stored order data:', e);
        }
      }
    }
  }, []);

  // Fallback order data if sessionStorage is empty
  const fallbackOrderData = {
    orderId: orderId || 'ORD12345',
    customerName: 'Customer',
    email: 'customer@example.com',
    phone: '01977 123456',
    mode: 'collection',
    total: 1500,
    subtotal: 1200,
    deliveryFee: 300,
    items: [
      {
        name: 'Set Meal A',
        qty: 1,
        price: 1000,
        options: ['Beef Curry', 'Rice']
      }
    ],
    comment: ''
  };

  const displayData = orderData || fallbackOrderData;

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

      {/* Success Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <i className="fa fa-check text-green-600 text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. We'll start preparing it right away.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
              <p className="text-gray-600 mt-1">Order Number: <strong>{displayData.orderId}</strong></p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Customer Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Name:</strong> {displayData.customerName || 'Customer'}</p>
                  {displayData.email && <p><strong>Email:</strong> {displayData.email}</p>}
                  {displayData.phone && <p><strong>Phone:</strong> {displayData.phone}</p>}
                </div>
              </div>

              {/* Order Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Type</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Mode:</strong> {displayData.mode === 'delivery' ? 'Delivery' : 'Collection'}</p>
                  {displayData.address && (
                    <p><strong>Address:</strong> {displayData.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayData.items && displayData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.options && item.options.length > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              {item.options.map((option, optIdx) => (
                                <div key={optIdx}>{option}</div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-gray-600">£{(item.price / 100).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">£{((item.price * item.qty) / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Sub-Total:</span>
                    <span className="text-gray-900 font-medium">£{(displayData.subtotal / 100).toFixed(2)}</span>
                  </div>
                  {displayData.mode === 'delivery' && displayData.deliveryFee > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="text-gray-900 font-medium">£{(displayData.deliveryFee / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>£{(displayData.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {displayData.comment && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Special Instructions:</h4>
                <p className="text-gray-600">{displayData.comment}</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What Happens Next?</h3>
            <div className="space-y-2 text-blue-800">
              <p>• You'll receive an order confirmation email shortly</p>
              <p>• We'll start preparing your order immediately</p>
              {displayData.mode === 'delivery' ? (
                <p>• Your order will be delivered to your address within 45 minutes</p>
              ) : (
                <p>• Your order will be ready for collection in 15 minutes</p>
              )}
              <p>• We'll call you if there are any issues with your order</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center text-gray-600">
                <i className="fa fa-phone mr-2"></i>
                <span>01977 123456</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fa fa-envelope mr-2"></i>
                <span>orders@chinapalace.co.uk</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-8">
            <Link 
              href="/menu" 
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors mr-4"
            >
              Order Again
            </Link>
            <Link 
              href="/" 
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
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
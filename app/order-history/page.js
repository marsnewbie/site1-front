"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

export default function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadOrderHistory();
  }, [isAuthenticated, router]);

  const loadOrderHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      
      const res = await fetch(apiUrl + '/api/auth/order-history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to load order history:', data.error);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (pence) => {
    return (pence / 100).toFixed(2);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
      case 'collected':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-16 px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Order History Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-600">View your past orders and their details</p>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <i className="fa fa-shopping-cart text-6xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders with us yet.
                </p>
                <Link 
                  href="/menu"
                  className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">£{formatPrice(order.total_pence)}</p>
                          <p className="text-sm text-gray-600 capitalize">{order.mode || 'Collection'}</p>
                        </div>
                        <i className={`fa fa-chevron-${expandedOrder === order.id ? 'up' : 'down'} text-gray-400`}></i>
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.cart_items && order.cart_items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                                  </div>
                                  <p className="text-sm font-medium">£{formatPrice(item.price * item.qty)}</p>
                                </div>
                              ))}
                            </div>
                            
                            {/* Order Totals */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>£{formatPrice(order.subtotal_pence || 0)}</span>
                              </div>
                              {order.delivery_fee_pence > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span>Delivery Fee:</span>
                                  <span>£{formatPrice(order.delivery_fee_pence)}</span>
                                </div>
                              )}
                              {order.discount_pence > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                  <span>Discount:</span>
                                  <span>-£{formatPrice(order.discount_pence)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2 mt-2">
                                <span>Total:</span>
                                <span>£{formatPrice(order.total_pence)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Order Details */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-600">Order Type:</span>
                                <span className="ml-2 capitalize">{order.mode || 'Collection'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Status:</span>
                                <span className="ml-2 capitalize">{order.status || 'Pending'}</span>
                              </div>
                              {order.requested_time && (
                                <div>
                                  <span className="text-gray-600">Requested Time:</span>
                                  <span className="ml-2">{order.requested_time}</span>
                                </div>
                              )}
                              
                              {/* Contact Details */}
                              {order.contact && (
                                <div className="mt-4">
                                  <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p>{order.contact.name}</p>
                                    <p>{order.contact.email}</p>
                                    <p>{order.contact.phone}</p>
                                    {order.mode === 'delivery' && order.contact.address && (
                                      <div>
                                        <p className="font-medium mt-2">Delivery Address:</p>
                                        <p>{order.contact.address}</p>
                                        <p>{order.contact.postcode}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {order.comment && (
                                <div className="mt-4">
                                  <span className="text-gray-600">Special Instructions:</span>
                                  <p className="ml-2 italic">{order.comment}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link href="/" className="text-gray-600 hover:text-gray-700 text-sm">
                ← Back to Home
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
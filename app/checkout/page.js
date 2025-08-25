"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [mode, setMode] = useState('collection');
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [postcode, setPostcode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [accountType, setAccountType] = useState('guest');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // On mount, read cart from sessionStorage (passed from menu page)
  useEffect(() => {
    const stored = sessionStorage.getItem('cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const deliveryFee = quote?.feePence || 0;
  const minOrder = quote?.minOrderPence || 0;

  async function fetchQuote() {
    if (!postcode) {
      alert('Please enter postcode');
      return;
    }
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/delivery/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'delivery', postcode, subtotalPence: subtotal }),
      });
      const data = await res.json();
      setQuote(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function submitOrder() {
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          contact,
          address: { postcode, line1: addressLine },
          cartItems,
          subtotalPence: subtotal,
          deliveryFeePence: deliveryFee,
          totalPence: subtotal + deliveryFee,
          paymentMethod,
          notes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage(`Order ${data.orderId} placed successfully!`);
        // clear cart
        sessionStorage.removeItem('cart');
        setCartItems([]);
      } else {
        setMessage('Error placing order');
      }
    } catch (e) {
      console.error(e);
      setMessage('Error placing order');
    } finally {
      setSubmitting(false);
    }
  }

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
            
            {/* Navigation Right (blank for checkout) */}
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

      {/* Checkout content */}
      <div className="container mx-auto py-8">
        <div className="row flex">
          {/* Left column: method summary and cart */}
          <div className="col-md-6">
            {/* Delivery/Collection summary */}
            <div className="summary-box border border-gray-300 bg-gray-50 p-4 rounded mb-6">
              <div className="summary-header flex justify-between items-center bg-red-600 text-white p-3 rounded mb-4">
                <p className="title text-lg font-bold m-0">{mode === 'collection' ? 'Collection' : 'Delivery'}</p>
                <Link href="/menu" className="btn btn-sm bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
                  Change
                </Link>
              </div>
              <div className="summary-body">
                <p className="mb-4"><strong>Collection Time:</strong> 04:45 PM (Monday)</p>
                <label htmlFor="notes" className="block mb-2 font-semibold">Notes</label>
                <textarea 
                  id="notes" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="notes-textarea w-full min-h-20 border border-gray-300 rounded p-3 resize-none"
                  placeholder="Special instructions if you have any..."
                />
              </div>
            </div>

            {/* Shopping cart summary */}
            <div className="summary-box border border-gray-300 bg-gray-50 p-4 rounded">
              <div className="summary-header flex justify-between items-center bg-red-600 text-white p-3 rounded mb-4">
                <p className="title text-lg font-bold m-0">Shopping Cart</p>
                <Link href="/menu" className="btn btn-sm bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
                  Back to menu
                </Link>
              </div>
              <div className="summary-body">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty. <Link href="/menu" className="text-red-600 hover:text-red-800">Go back to menu.</Link></p>
                ) : (
                  <table className="cart-table w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2 bg-gray-100 text-left">Product Name</th>
                        <th className="border border-gray-300 p-2 bg-gray-100 text-center" style={{width: '80px'}}>Quantity</th>
                        <th className="border border-gray-300 p-2 bg-gray-100 text-center" style={{width: '80px'}}>Price</th>
                        <th className="border border-gray-300 p-2 bg-gray-100 text-center" style={{width: '80px'}}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-300 p-2">
                            <div className="font-semibold">{item.name}</div>
                            {item.options && item.options.length > 0 && (
                              <div className="text-sm text-gray-600">
                                {item.options.map((option, optIdx) => (
                                  <div key={optIdx} className="text-xs">{option}</div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">{item.qty}</td>
                          <td className="border border-gray-300 p-2 text-center">£{(item.price / 100).toFixed(2)}</td>
                          <td className="border border-gray-300 p-2 text-center">£{((item.price * item.qty) / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="3" className="border border-gray-300 p-2 text-right font-bold">Sub‑Total:</td>
                        <td className="border border-gray-300 p-2 text-center font-bold">£{(subtotal / 100).toFixed(2)}</td>
                      </tr>
                      {mode === 'delivery' && quote && quote.isDeliverable && (
                        <tr>
                          <td colSpan="3" className="border border-gray-300 p-2 text-right font-bold">Delivery:</td>
                          <td className="border border-gray-300 p-2 text-center font-bold">£{(deliveryFee / 100).toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="3" className="border border-gray-300 p-2 text-right font-bold">Total:</td>
                        <td className="border border-gray-300 p-2 text-center font-bold">£{((subtotal + deliveryFee) / 100).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Account details, voucher, payment */}
          <div className="col-md-6">
            {/* Account & Billing Details */}
            <div className="summary-box border border-gray-300 bg-gray-50 p-4 rounded mb-6">
              <div className="summary-header bg-red-600 text-white p-3 rounded mb-4">
                <p className="title text-lg font-bold m-0">Account & Billing Details</p>
              </div>
              <div className="summary-body">
                {/* Guest checkout accordion */}
                <details className="border border-gray-300 rounded mb-4">
                  <summary className="bg-red-600 text-white p-3 cursor-pointer font-bold rounded">
                    I'm A Guest
                  </summary>
                  <div className="panel-body p-4 bg-white border-t border-gray-300">
                    <div className="alert alert-warning text-sm text-red-600 mb-4 p-3 bg-red-50 rounded">
                      Using a guest account means you cannot track your orders, earn reward points, or access account‑only features.
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-first-name" className="block mb-2 font-semibold">First Name<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="guest-first-name" 
                        value={contact.name}
                        onChange={(e) => setContact({...contact, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-email" className="block mb-2 font-semibold">E‑Mail<span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        id="guest-email" 
                        value={contact.email}
                        onChange={(e) => setContact({...contact, email: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Email"
                      />
                      <small className="text-red-500 text-sm">The email is required and cannot be empty</small>
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-phone" className="block mb-2 font-semibold">Telephone<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="guest-phone" 
                        value={contact.phone}
                        onChange={(e) => setContact({...contact, phone: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Telephone"
                      />
                    </div>
                    {mode === 'delivery' && (
                      <>
                        <div className="form-group mb-4">
                          <label htmlFor="guest-postcode" className="block mb-2 font-semibold">Post Code</label>
                          <input 
                            type="text" 
                            id="guest-postcode" 
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Post Code"
                          />
                        </div>
                        <div className="form-group mb-4">
                          <label htmlFor="guest-address" className="block mb-2 font-semibold">Address</label>
                          <input 
                            type="text" 
                            id="guest-address" 
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Address"
                          />
                        </div>
                      </>
                    )}
                    <p className="text-sm">Not now, I will create an account later <a href="#" className="text-red-600 hover:text-red-800">Create An Account</a></p>
                  </div>
                </details>

                {/* Returning customer accordion */}
                <details className="border border-gray-300 rounded mb-4">
                  <summary className="bg-red-600 text-white p-3 cursor-pointer font-bold rounded">
                    I'm Already A Customer
                  </summary>
                  <div className="panel-body p-4 bg-white border-t border-gray-300">
                    <h5 className="font-bold mb-4">Returning Customer</h5>
                    <div className="form-group mb-4">
                      <label htmlFor="login-email" className="block mb-2 font-semibold">E‑Mail:</label>
                      <input 
                        type="email" 
                        id="login-email" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="login-password" className="block mb-2 font-semibold">Password:</label>
                      <input 
                        type="password" 
                        id="login-password" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Password"
                      />
                    </div>
                    <button className="btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Login</button>
                    <div className="form-group mt-4">
                      <a href="#" className="text-red-600 hover:text-red-800">Forgotten Password</a><br/>
                      <label className="flex items-center mt-2">
                        <input type="checkbox" className="mr-2" />
                        Remember Me
                      </label>
                    </div>
                  </div>
                </details>

                {/* New account accordion */}
                <details className="border border-gray-300 rounded">
                  <summary className="bg-red-600 text-white p-3 cursor-pointer font-bold rounded">
                    I'm New Here (I Want To Register An Account)
                  </summary>
                  <div className="panel-body p-4 bg-white border-t border-gray-300">
                    <h5 className="font-bold mb-4">Your Personal Details</h5>
                    <div className="form-group mb-4">
                      <label htmlFor="new-first-name" className="block mb-2 font-semibold">First Name<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="new-first-name" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-email" className="block mb-2 font-semibold">E‑Mail<span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        id="new-email" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-phone" className="block mb-2 font-semibold">Telephone<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="new-phone" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Telephone"
                      />
                    </div>
                    <h5 className="font-bold mb-4">Your Password</h5>
                    <div className="form-group mb-4">
                      <label htmlFor="new-password" className="block mb-2 font-semibold">Your Password<span className="text-red-500">*</span></label>
                      <input 
                        type="password" 
                        id="new-password" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Password"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-password-confirm" className="block mb-2 font-semibold">Password Confirm<span className="text-red-500">*</span></label>
                      <input 
                        type="password" 
                        id="new-password-confirm" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <h5 className="font-bold mb-4">Your Address</h5>
                    <div className="form-group mb-4">
                      <label htmlFor="new-postcode" className="block mb-2 font-semibold">Post Code<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="new-postcode" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Post Code"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-address" className="block mb-2 font-semibold">Address</label>
                      <input 
                        type="text" 
                        id="new-address" 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Address"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        I wish to subscribe to the China Palace newsletter.
                      </label>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Voucher section */}
            <div className="voucher-section border border-gray-300 p-4 rounded mb-6 bg-gray-50">
              <h5 className="font-bold mb-2">Voucher /</h5>
              <p className="mb-3">Enter your gift voucher code here:</p>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Gift voucher code"
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Apply Voucher</button>
              </div>
            </div>

            {/* Payment method */}
            <div className="payment-method border border-gray-300 p-4 rounded mb-6 bg-gray-50">
              <p className="font-bold mb-3">Choose your Payment Method</p>
              <label className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="paymethod" 
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="mr-2"
                />
                Cash
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="paymethod" 
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-2"
                />
                Credit Card / Debit Card (NOCHEX)
              </label>
            </div>

            <div className="alert alert-warning text-sm text-yellow-800 mb-4 p-3 bg-yellow-50 rounded">
              Please watch out for order confirmation email from us. In case you don't receive an order confirmation email please call us to confirm the order. Please make sure you check your SPAM or junk folder in your inbox.
            </div>

            <div className="terms-section mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mr-2"
                />
                I have read and agree to the <a href="#" className="text-red-600 hover:text-red-800">Terms & Conditions</a> as well as <a href="#" className="text-red-600 hover:text-red-800">Privacy Policy</a>.
              </label>
            </div>

            <button 
              className="place-order-btn w-full bg-red-600 text-white p-3 rounded font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isSubmitting || cartItems.length === 0 || !agreeTerms || (mode === 'delivery' && (!quote || !quote.isDeliverable))}
              onClick={submitOrder}
            >
              {isSubmitting ? 'Processing...' : `Place ${mode === 'collection' ? 'Collection' : 'Delivery'} Order`}
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
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
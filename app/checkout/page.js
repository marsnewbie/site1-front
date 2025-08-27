"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [mode, setMode] = useState('collection');
  const [contact, setContact] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    postcode: '',
    address: '',
    street: '',
    address2: '',
    city: ''
  });
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [accountType, setAccountType] = useState('guest');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [storeConfig, setStoreConfig] = useState(null);
  const [requestedTime, setRequestedTime] = useState('ASAP');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Separate state for each checkout option
  const [guestContact, setGuestContact] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', postcode: '',
    address: '', street: '', address2: '', city: ''
  });
  const [returningContact, setReturningContact] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', postcode: '',
    address: '', street: '', address2: '', city: ''
  });
  const [newContact, setNewContact] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', postcode: '',
    address: '', street: '', address2: '', city: ''
  });
  
  // Separate postcode validation for each option
  const [guestQuote, setGuestQuote] = useState(null);
  const [returningQuote, setReturningQuote] = useState(null);
  const [newQuote, setNewQuote] = useState(null);
  
  // Separate form errors for each option
  const [guestFormErrors, setGuestFormErrors] = useState({});
  const [returningFormErrors, setReturningFormErrors] = useState({});
  const [newFormErrors, setNewFormErrors] = useState({});

  // Load store configuration from database
  useEffect(() => {
    async function loadStoreConfig() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
        const res = await fetch(apiUrl + '/api/store/config');
        if (res.ok) {
          const config = await res.json();
          setStoreConfig(config);
        }
      } catch (e) {
        console.error('Error loading store config:', e);
        // Fallback to default config
        setStoreConfig({
          collection_lead_time_minutes: 15,
          delivery_lead_time_minutes: 45,
          collection_buffer_before_close_minutes: 15,
          delivery_buffer_before_close_minutes: 15
        });
      }
    }
    loadStoreConfig();
  }, []);

  // On mount, read cart and order details from sessionStorage (passed from menu page)
  useEffect(() => {
    const stored = sessionStorage.getItem('cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    }

    // Load saved delivery mode from menu page
    const savedMode = sessionStorage.getItem('orderMode');
    if (savedMode) {
      setMode(savedMode);
    }

    // Load saved postcode and delivery info from menu page
    const savedPostcode = sessionStorage.getItem('postcode');
    const savedDeliveryInfo = sessionStorage.getItem('deliveryInfo');
    const savedRequestedTime = sessionStorage.getItem('requestedTime');
    
    if (savedPostcode) {
      setContact(prev => ({ ...prev, postcode: savedPostcode }));
    }
    if (savedDeliveryInfo) {
      try {
        const deliveryInfo = JSON.parse(savedDeliveryInfo);
        setQuote(deliveryInfo);
      } catch (e) {
        console.error('Error loading delivery info from sessionStorage:', e);
      }
    }
    if (savedRequestedTime) {
      setRequestedTime(savedRequestedTime);
    }
  }, []);

  // Handle login for returning customers
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setMessage('Please enter your email and password.');
      return;
    }

    setIsLoggingIn(true);
    setMessage('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      const res = await fetch(apiUrl + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginEmail, 
          password: loginPassword 
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Use AuthContext to save login state
        login(data.user, data.token);
        
        // Pre-fill returning customer form with user data
        setReturningContact({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
          phone: data.user.telephone || '',
          postcode: data.user.postcode || '',
          address: data.user.address || '',
          street: data.user.street_name || '',
          address2: data.user.address2 || '',
          city: data.user.city || ''
        });
        
        // If delivery mode and user has postcode, trigger quote check
        if (mode === 'delivery' && data.user.postcode) {
          fetchQuoteForType('returning', data.user.postcode, subtotal);
        }
        
        setMessage('Login successful! Your information has been loaded.');
        
        // Clear login form
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setMessage(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (e) {
      console.error('Login error:', e);
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Set default account type and auto-fill based on authentication status
  useEffect(() => {
    if (isAuthenticated && user) {
      // Logged in users default to 'returning' account type
      setAccountType('returning');
      
      // Auto-fill returning customer form with user data
      setReturningContact({
        firstName: user.firstName || '',
        lastName: user.lastName || '', 
        email: user.email || '',
        phone: user.telephone || '',
        postcode: user.postcode || '',
        address: user.address || '',
        street: user.street_name || '',
        address2: user.address2 || '',
        city: user.city || ''
      });
    } else {
      // Not logged in users default to 'guest'
      setAccountType('guest');
    }
  }, [isAuthenticated, user]);

  // Helper functions to get current form data
  const getCurrentContact = () => {
    switch (accountType) {
      case 'guest': return guestContact;
      case 'returning': return returningContact;
      case 'new': return newContact;
      default: return guestContact;
    }
  };
  
  const setCurrentContact = (updater) => {
    switch (accountType) {
      case 'guest': setGuestContact(updater); break;
      case 'returning': setReturningContact(updater); break;
      case 'new': setNewContact(updater); break;
    }
  };
  
  const getCurrentQuote = () => {
    switch (accountType) {
      case 'guest': return guestQuote;
      case 'returning': return returningQuote;
      case 'new': return newQuote;
      default: return guestQuote;
    }
  };
  
  const setCurrentQuote = (quote) => {
    switch (accountType) {
      case 'guest': setGuestQuote(quote); break;
      case 'returning': setReturningQuote(quote); break;
      case 'new': setNewQuote(quote); break;
    }
  };
  
  const getCurrentFormErrors = () => {
    switch (accountType) {
      case 'guest': return guestFormErrors;
      case 'returning': return returningFormErrors;
      case 'new': return newFormErrors;
      default: return guestFormErrors;
    }
  };
  
  const setCurrentFormErrors = (errors) => {
    switch (accountType) {
      case 'guest': setGuestFormErrors(errors); break;
      case 'returning': setReturningFormErrors(errors); break;
      case 'new': setNewFormErrors(errors); break;
    }
  };
  
  // Handle account type change with logout protection
  const handleAccountTypeChange = (newType) => {
    if (isAuthenticated && (newType === 'guest' || newType === 'new')) {
      setMessage('请先退出登录才能选择其他结账方式。');
      return;
    }
    setAccountType(newType);
    setMessage(''); // Clear any previous messages
  };

  const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const currentQuote = getCurrentQuote();
  const deliveryFee = currentQuote?.feePence || 0;
  const minOrder = currentQuote?.minOrderPence || 0;

  // Validate form fields for current account type
  const validateForm = () => {
    const errors = {};
    const contact = getCurrentContact();

    // Required fields for guest checkout
    if (accountType === 'guest') {
      if (!contact.firstName.trim()) errors.firstName = 'First name is required';
      if (!contact.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!contact.phone.trim()) errors.phone = 'Phone number is required';

      // Additional required fields for delivery
      if (mode === 'delivery') {
        if (!contact.postcode.trim()) errors.postcode = 'Postcode is required for delivery';
        if (!contact.address.trim()) errors.address = 'Address is required for delivery';
      }
    }

    // Returning customers (already logged in) - no validation needed for basic info
    if (accountType === 'returning') {
      // Only validate delivery-specific fields if in delivery mode
      if (mode === 'delivery') {
        if (!contact.postcode.trim()) errors.postcode = 'Postcode is required for delivery';
        if (!contact.address.trim()) errors.address = 'Address is required for delivery';
      }
    }

    // Additional fields for new account
    if (accountType === 'new') {
      if (!contact.firstName.trim()) errors.firstName = 'First name is required';
      if (!contact.lastName.trim()) errors.lastName = 'Last name is required';
      if (!contact.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!contact.phone.trim()) errors.phone = 'Phone number is required';
      if (!contact.postcode.trim()) errors.postcode = 'Postcode is required';
      if (!contact.address.trim()) errors.address = 'Address is required';
    }

    setCurrentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Updated fetchQuote for specific account type
  async function fetchQuoteForType(type, postcode, subtotalAmount) {
    if (!postcode) {
      alert('Please enter postcode');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      const res = await fetch(apiUrl + '/api/delivery/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: 'delivery', 
          postcode: postcode, 
          subtotalPence: subtotalAmount 
        }),
      });
      const data = await res.json();
      
      // Set quote for specific account type
      switch (type) {
        case 'guest': setGuestQuote(data); break;
        case 'returning': setReturningQuote(data); break;
        case 'new': setNewQuote(data); break;
      }
    } catch (e) {
      console.error(e);
      const errorQuote = {
        isDeliverable: false,
        reason: 'Error checking delivery availability. Please try again.'
      };
      
      switch (type) {
        case 'guest': setGuestQuote(errorQuote); break;
        case 'returning': setReturningQuote(errorQuote); break;
        case 'new': setNewQuote(errorQuote); break;
      }
    }
  }
  
  // Convenience function for current account type
  function fetchQuote() {
    const contact = getCurrentContact();
    fetchQuoteForType(accountType, contact.postcode, subtotal);
  }

  async function submitOrder() {
    if (!validateForm()) {
      setMessage('Please fill in all required fields correctly.');
      return;
    }

    if (!agreeTerms) {
      setMessage('Please agree to the terms and conditions');
      return;
    }

    // Validate delivery postcode if needed
    const quote = getCurrentQuote();
    if (mode === 'delivery' && (!quote || !quote.isDeliverable)) {
      setMessage('Please check delivery availability for your postcode.');
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      
      // Get current form data
      const contact = getCurrentContact();
      
      // Prepare data based on account type
      let requestBody = {
        mode,
        cartItems,
        subtotalPence: subtotal,
        deliveryFeePence: deliveryFee,
        totalPence: subtotal + deliveryFee,
        paymentMethod,
        comment: notes,
      };

      // Add data based on checkout method
      if (accountType === 'guest') {
        requestBody.checkoutMethod = 'guest';
        requestBody.guestData = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          telephone: contact.phone,
          postcode: contact.postcode,
          address: contact.address,
          streetName: contact.street,
          city: contact.city
        };
      } else if (accountType === 'returning') {
        // For returning customers, we don't need checkoutMethod since backend will use req.user
        if (!isAuthenticated) {
          setMessage('Please log in first.');
          setSubmitting(false);
          return;
        }
      } else if (accountType === 'new') {
        // For new account registration
        const password = document.getElementById('new-password')?.value;
        const passwordConfirm = document.getElementById('new-password-confirm')?.value;
        
        if (!password || !passwordConfirm) {
          setMessage('Please enter and confirm your password.');
          setSubmitting(false);
          return;
        }
        
        requestBody.checkoutMethod = 'register';
        requestBody.registerData = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          telephone: contact.phone,
          password: password,
          passwordConfirm: passwordConfirm,
          postcode: contact.postcode,
          address: contact.address,
          streetName: contact.street,
          city: contact.city
        };
      }

      const headers = { 'Content-Type': 'application/json' };
      
      // Add auth token if user is logged in
      if (isAuthenticated && localStorage.getItem('authToken')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
      }
      
      const res = await fetch(apiUrl + '/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Store order data for success page
        const contact = getCurrentContact();
        const orderData = {
          orderId: data.orderId,
          customerName: `${contact.firstName} ${contact.lastName || ''}`.trim(),
          email: contact.email,
          phone: contact.phone,
          mode: mode,
          total: subtotal + deliveryFee,
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          items: cartItems,
          comment: notes,
          address: mode === 'delivery' ? `${contact.address || ''} ${contact.street || ''} ${contact.city || ''}`.trim() : null
        };
        
        sessionStorage.setItem('lastOrderData', JSON.stringify(orderData));
        
        // Clear all order-related session storage
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('orderMode');
        sessionStorage.removeItem('postcode');
        sessionStorage.removeItem('deliveryInfo');
        setCartItems([]);
        
        // Redirect to success page
        window.location.href = `/order-success?orderId=${data.orderId}`;
      } else {
        setMessage(data.error || 'Error placing order');
      }
    } catch (e) {
      console.error('Checkout error:', e);
      setMessage('Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

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
                <p className="mb-4">
                  <strong>{mode === 'collection' ? 'Collection' : 'Delivery'} Time:</strong> {requestedTime}
                </p>
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
                <details className="border border-gray-300 rounded mb-4" open={accountType === 'guest'}>
                  <summary 
                    className="bg-red-600 text-white p-3 cursor-pointer font-bold rounded"
                    onClick={() => handleAccountTypeChange('guest')}
                  >
                    Checkout As A Guest
                  </summary>
                  <div className="panel-body p-4 bg-white border-t border-gray-300">
                    <div className="alert alert-warning text-sm text-red-600 mb-4 p-3 bg-red-50 rounded">
                      Using a guest account means you cannot track your orders, earn reward points, or access account‑only features.
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-first-name" className="block mb-2 font-semibold">*First Name</label>
                      <input 
                        type="text" 
                        id="guest-first-name" 
                        value={guestContact.firstName}
                        onChange={(e) => setGuestContact({...guestContact, firstName: e.target.value})}
                        className={`w-full p-2 border rounded ${guestFormErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="First Name"
                      />
                      {guestFormErrors.firstName && <div className="text-red-500 text-sm mt-1">{guestFormErrors.firstName}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-last-name" className="block mb-2 font-semibold">Last Name</label>
                      <input 
                        type="text" 
                        id="guest-last-name" 
                        value={guestContact.lastName}
                        onChange={(e) => setGuestContact({...guestContact, lastName: e.target.value})}
                        className={`w-full p-2 border rounded ${guestFormErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Last Name"
                      />
                      {guestFormErrors.lastName && <div className="text-red-500 text-sm mt-1">{guestFormErrors.lastName}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-email" className="block mb-2 font-semibold">*E‑Mail</label>
                      <input 
                        type="email" 
                        id="guest-email" 
                        value={guestContact.email}
                        onChange={(e) => setGuestContact({...guestContact, email: e.target.value})}
                        className={`w-full p-2 border rounded ${guestFormErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Email"
                      />
                      {guestFormErrors.email && <div className="text-red-500 text-sm mt-1">{guestFormErrors.email}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-phone" className="block mb-2 font-semibold">*Telephone</label>
                      <input 
                        type="text" 
                        id="guest-phone" 
                        value={guestContact.phone}
                        onChange={(e) => setGuestContact({...guestContact, phone: e.target.value})}
                        className={`w-full p-2 border rounded ${guestFormErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Telephone"
                      />
                      {guestFormErrors.phone && <div className="text-red-500 text-sm mt-1">{guestFormErrors.phone}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-postcode" className="block mb-2 font-semibold">
                        Post Code{mode === 'delivery' ? <span className="text-red-500">*</span> : ''}:
                      </label>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          id="guest-postcode" 
                          value={guestContact.postcode}
                          onChange={(e) => {
                            setGuestContact({...guestContact, postcode: e.target.value});
                            // Clear previous quote when postcode changes
                            if (mode === 'delivery') {
                              setGuestQuote(null);
                            }
                          }}
                          className={`flex-1 p-2 border rounded ${guestFormErrors.postcode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Post Code"
                        />
                        {mode === 'delivery' && (
                          <button 
                            type="button"
                            onClick={fetchQuote}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Check
                          </button>
                        )}
                      </div>
                      {formErrors.postcode && <div className="text-red-500 text-sm mt-1">{formErrors.postcode}</div>}
                      {mode === 'delivery' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Please press "Check" button to verify the postcode before placing the order
                        </div>
                      )}
                      {mode === 'delivery' && quote && (
                        <div className={`text-sm mt-2 ${quote.isDeliverable ? 'text-green-600' : 'text-red-600'}`}>
                          {quote.isDeliverable
                            ? `Delivery fee £${(quote.feePence / 100).toFixed(2)}, minimum order £${(quote.minOrderPence / 100).toFixed(2)}`
                            : `Not deliverable: ${quote.reason}`}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="guest-address" className="block mb-2 font-semibold">
                        Address{mode === 'delivery' ? <span className="text-red-500">*</span> : ''}
                        <span className="text-gray-500 text-sm font-normal"> (Detailed Street Name and House Number)</span>
                      </label>
                      <input 
                        type="text" 
                        id="guest-address" 
                        value={guestContact.address}
                        onChange={(e) => setGuestContact({...guestContact, address: e.target.value})}
                        className={`w-full p-2 border rounded ${guestFormErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. 123 Main Street, Apartment 4B"
                      />
                      {formErrors.address && <div className="text-red-500 text-sm mt-1">{formErrors.address}</div>}
                    </div>
                    {/* Street Name field hidden as it's now included in Address field */}
                    <div className="form-group mb-4">
                      <label htmlFor="guest-city" className="block mb-2 font-semibold">City:</label>
                      <input 
                        type="text" 
                        id="guest-city" 
                        value={guestContact.city}
                        onChange={(e) => setGuestContact({...guestContact, city: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="City"
                      />
                    </div>
                    <p className="text-sm">Not now, I will create an account later <Link href="/register" className="text-red-600 hover:text-red-800">Create An Account</Link></p>
                  </div>
                </details>

                {/* Returning customer accordion */}
                <details className="border border-gray-300 rounded mb-4" open={accountType === 'returning'}>
                  <summary 
                    className="bg-red-600 text-white p-3 cursor-pointer font-bold rounded"
                    onClick={() => handleAccountTypeChange('returning')}
                  >
                    I'm Already A Customer
                  </summary>
                  <div className="panel-body p-4 bg-white border-t border-gray-300">
                    <h5 className="font-bold mb-4">Returning Customer</h5>
                    {isAuthenticated ? (
                      /* Show logged in user info */
                      <div className="bg-green-50 border border-green-200 rounded p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            ✓
                          </div>
                          <div>
                            <div className="font-bold text-green-800">Welcome back!</div>
                            <div className="text-green-600 text-sm">{user?.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div><strong>Name:</strong> {user?.firstName} {user?.lastName}</div>
                          {user?.telephone && <div><strong>Phone:</strong> {user?.telephone}</div>}
                          {user?.address && <div><strong>Address:</strong> {user?.address}</div>}
                          {user?.postcode && <div><strong>Postcode:</strong> {user?.postcode}</div>}
                        </div>
                      </div>
                    ) : (
                      /* Show login form */
                      <div>
                        <div className="form-group mb-4">
                          <label htmlFor="login-email" className="block mb-2 font-semibold">E‑Mail:</label>
                          <input 
                            type="email" 
                            id="login-email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Email"
                          />
                        </div>
                        <div className="form-group mb-4">
                          <label htmlFor="login-password" className="block mb-2 font-semibold">Password:</label>
                          <input 
                            type="password" 
                            id="login-password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Password"
                          />
                        </div>
                        <button 
                          className="btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          onClick={handleLogin}
                          disabled={isLoggingIn || !loginEmail || !loginPassword}
                        >
                          {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                      </div>
                    )}
                    <div className="form-group mt-4">
                      <Link href="/forgot-password" className="text-red-600 hover:text-red-800">Forgotten Password</Link><br/>
                      <label className="flex items-center mt-2">
                        <input type="checkbox" className="mr-2" />
                        Remember Me
                      </label>
                    </div>
                  </div>
                </details>

                {/* New account accordion */}
                <details className="border border-gray-300 rounded" open={accountType === 'new'}>
                  <summary 
                    className="bg-red-600 text-white p-3 cursor-pointer font-bold rounded"
                    onClick={() => handleAccountTypeChange('new')}
                  >
                    I'm New Here (I Want To Register An Account)
                  </summary>
                  <div className="panel-body p-4 bg-white border-t border-gray-300">
                    <h5 className="font-bold mb-4">Your Personal Details</h5>
                    <div className="form-group mb-4">
                      <label htmlFor="new-first-name" className="block mb-2 font-semibold">First Name<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="new-first-name" 
                        value={contact.firstName}
                        onChange={(e) => setContact({...contact, firstName: e.target.value})}
                        className={`w-full p-2 border rounded ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="First Name"
                      />
                      {formErrors.firstName && <div className="text-red-500 text-sm mt-1">{formErrors.firstName}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-last-name" className="block mb-2 font-semibold">Last Name<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="new-last-name" 
                        value={contact.lastName}
                        onChange={(e) => setContact({...contact, lastName: e.target.value})}
                        className={`w-full p-2 border rounded ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Last Name"
                      />
                      {formErrors.lastName && <div className="text-red-500 text-sm mt-1">{formErrors.lastName}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-email" className="block mb-2 font-semibold">E‑Mail<span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        id="new-email" 
                        value={contact.email}
                        onChange={(e) => setContact({...contact, email: e.target.value})}
                        className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Email"
                      />
                      {formErrors.email && <div className="text-red-500 text-sm mt-1">{formErrors.email}</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-phone" className="block mb-2 font-semibold">Telephone<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="new-phone" 
                        value={contact.phone}
                        onChange={(e) => setContact({...contact, phone: e.target.value})}
                        className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Telephone"
                      />
                      {formErrors.phone && <div className="text-red-500 text-sm mt-1">{formErrors.phone}</div>}
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
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          id="new-postcode" 
                          value={contact.postcode}
                          onChange={(e) => {
                            setContact({...contact, postcode: e.target.value});
                            // Clear previous quote when postcode changes
                            if (mode === 'delivery') {
                              setQuote(null);
                            }
                          }}
                          className={`flex-1 p-2 border rounded ${formErrors.postcode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Post Code"
                        />
                        {mode === 'delivery' && (
                          <button 
                            type="button"
                            onClick={fetchQuote}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Check
                          </button>
                        )}
                      </div>
                      {formErrors.postcode && <div className="text-red-500 text-sm mt-1">{formErrors.postcode}</div>}
                      {mode === 'delivery' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Please press "Check" button to verify the postcode before placing the order
                        </div>
                      )}
                      {mode === 'delivery' && quote && (
                        <div className={`text-sm mt-2 ${quote.isDeliverable ? 'text-green-600' : 'text-red-600'}`}>
                          {quote.isDeliverable
                            ? `Delivery fee £${(quote.feePence / 100).toFixed(2)}, minimum order £${(quote.minOrderPence / 100).toFixed(2)}`
                            : `Not deliverable: ${quote.reason}`}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-address" className="block mb-2 font-semibold">
                        Address<span className="text-red-500">*</span>
                        <span className="text-gray-500 text-sm font-normal"> (Detailed Street Name and House Number)</span>
                      </label>
                      <input 
                        type="text" 
                        id="new-address" 
                        value={contact.address}
                        onChange={(e) => setContact({...contact, address: e.target.value})}
                        className={`w-full p-2 border rounded ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. 123 Main Street, Apartment 4B"
                      />
                      {formErrors.address && <div className="text-red-500 text-sm mt-1">{formErrors.address}</div>}
                    </div>
                    {/* Street Name field hidden as it's now included in Address field */}
                    <div className="form-group mb-4">
                      <label htmlFor="new-address2" className="block mb-2 font-semibold">Address 2</label>
                      <input 
                        type="text" 
                        id="new-address2" 
                        value={contact.address2}
                        onChange={(e) => setContact({...contact, address2: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Address 2"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="new-city" className="block mb-2 font-semibold">City</label>
                      <input 
                        type="text" 
                        id="new-city" 
                        value={contact.city}
                        onChange={(e) => setContact({...contact, city: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="City"
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
                I have read and agree to the <Link href="/terms" className="text-red-600 hover:text-red-800">Terms & Conditions</Link> as well as <Link href="/privacy" className="text-red-600 hover:text-red-800">Privacy Policy</Link>.
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
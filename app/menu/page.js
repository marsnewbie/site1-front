"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
  const [data, setData] = useState({ categories: [], items: [] });
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [postcode, setPostcode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [mode, setMode] = useState('collection');
  const [isLoading, setIsLoading] = useState(true);
  const [requestedTime, setRequestedTime] = useState('ASAP');

  // Business configuration - these would come from Supabase in production
  const businessConfig = {
    openingTime: '16:30',
    closingTime: '22:00',
    collectionTimeMinutes: 15, // 15 minutes for collection
    deliveryTimeMinutes: 45,   // 45 minutes for delivery
    deliveryPostcodes: ['PE6 0EG', 'PE6 0EH', 'PE6 0EJ'], // Valid delivery postcodes
  };

  // Generate time slots based on current time and business config
  const generateTimeSlots = (mode) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    
    // Parse business hours
    const [openHour, openMin] = businessConfig.openingTime.split(':').map(Number);
    const [closeHour, closeMin] = businessConfig.closingTime.split(':').map(Number);
    const openTimeMinutes = openHour * 60 + openMin;
    const closeTimeMinutes = closeHour * 60 + closeMin;
    
    const timeSlots = ['ASAP'];
    const interval = mode === 'collection' ? businessConfig.collectionTimeMinutes : businessConfig.deliveryTimeMinutes;
    
    // Determine start time
    let startTime;
    if (currentTime < openTimeMinutes) {
      // Before opening - start from opening time
      startTime = openTimeMinutes;
    } else {
      // After opening - start from current time + interval
      startTime = Math.ceil(currentTime / interval) * interval;
    }
    
    // Generate time slots
    for (let time = startTime; time < closeTimeMinutes; time += interval) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const displayMinutes = minutes.toString().padStart(2, '0');
      
      const timeString = `${displayHours}:${displayMinutes} ${ampm}`;
      timeSlots.push(timeString);
    }
    
    return timeSlots;
  };

  // Add CSS styles for the menu layout
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .menu-categories ul { padding-left: 0; margin: 0; }
      .menu-categories li { margin-bottom: 5px; }
      .menu-categories a {
        display: block;
        background: #b58b4d;
        color: #fff;
        padding: 8px 12px;
        border-radius: 3px;
        text-decoration: none;
        font-weight: bold;
      }
      .menu-categories a:hover,
      .menu-categories a:focus {
        background: #a2793f;
        color: #fff;
      }
      .menu-items section { margin-bottom: 30px; }
      .menu-items h3 {
        background: #b58b4d;
        color: #fff;
        padding: 10px;
        border-radius: 3px;
        font-size: 1.25rem;
      }
      .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 5px;
        border-bottom: 1px solid #e5e5e5;
      }
      .menu-item:last-child { border-bottom: none; }
      .menu-item .name { flex: 1; }
      .menu-item .price { margin-right: 10px; white-space: nowrap; }
      .menu-item button {
        background: #b58b4d;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
      }
      .menu-item button:hover { background: #a2793f; cursor: pointer; }
      .order-panel { background: #f9f8f4; padding: 15px; border: 1px solid #ddd; border-radius: 3px; }
      .order-panel h4 { background: #b58b4d; color:#fff; padding: 10px; margin-top:0; border-radius:3px; font-size: 1.1rem; }
      .order-panel .option-row { display: flex; align-items: center; margin-bottom: 10px; }
      .order-panel .option-row label { margin-left: 5px; margin-right: 15px; font-weight: normal; }
      .order-panel select { width: 100%; padding: 5px; margin-bottom: 10px; }
      .cart-empty { font-style: italic; color: #777; margin-bottom: 10px; }
      .cart-items { list-style: none; padding: 0; margin: 0; }
      .cart-items li { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #e5e5e5; }
      .cart-items li:last-child { border-bottom: none; }
      .cart-summary { margin-top: 10px; font-weight: bold; }
      .order-panel .checkout-btn { width: 100%; background: #b58b4d; color: #fff; padding: 8px; border: none; border-radius: 3px; }
      .order-panel .checkout-btn:hover { background: #a2793f; cursor:pointer; }
      .row { display: flex; flex-wrap: wrap; }
      .col-md-3 { flex: 0 0 25%; max-width: 25%; padding: 0 15px; }
      .col-md-6 { flex: 0 0 50%; max-width: 50%; padding: 0 15px; }
      .business-hours { font-size: 0.8rem; color: #666; margin-top: 5px; }
      .delivery-status { font-size: 0.9rem; margin-top: 5px; }
      .delivery-status.success { color: #28a745; }
      .delivery-status.error { color: #dc3545; }
      @media (max-width: 768px) {
        .col-md-3, .col-md-6 { flex: 0 0 100%; max-width: 100%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/menu');
        if (res.ok) {
          const d = await res.json();
          setData(d);
          if (d.categories.length > 0) {
            setActiveCategory(d.categories[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Update time slots when mode changes
  useEffect(() => {
    const timeSlots = generateTimeSlots(mode);
    if (!timeSlots.includes(requestedTime)) {
      setRequestedTime(timeSlots[0]);
    }
  }, [mode]);

  function openOptionsModal(item) {
    setSelectedItem(item);
    setSelectedOptions({});
    setShowOptionsModal(true);
  }

  function closeOptionsModal() {
    setShowOptionsModal(false);
    setSelectedItem(null);
    setSelectedOptions({});
  }

  function handleOptionChange(optionId, choiceId, type) {
    if (type === 'radio') {
      setSelectedOptions(prev => ({
        ...prev,
        [optionId]: choiceId
      }));
    } else if (type === 'checkbox') {
      setSelectedOptions(prev => ({
        ...prev,
        [optionId]: prev[optionId] ? 
          prev[optionId].includes(choiceId) ? 
            prev[optionId].filter(id => id !== choiceId) : 
            [...prev[optionId], choiceId] : 
          [choiceId]
      }));
    }
  }

  function addItemWithOptions() {
    if (!selectedItem) return;

    // Validate required options
    const requiredOptions = selectedItem.options.filter(opt => opt.required);
    const missingRequired = requiredOptions.some(opt => !selectedOptions[opt.id]);
    
    if (missingRequired) {
      alert('Please select all required options');
      return;
    }

    // Calculate total price including options
    let totalPrice = selectedItem.price;
    let optionDetails = [];

    selectedItem.options.forEach(option => {
      if (selectedOptions[option.id]) {
        if (option.type === 'radio') {
          const choice = option.choices.find(c => c.id === selectedOptions[option.id]);
          if (choice) {
            totalPrice += choice.priceDelta;
            optionDetails.push(`${option.name}: ${choice.name}`);
          }
        } else if (option.type === 'checkbox') {
          const selectedChoices = option.choices.filter(c => 
            selectedOptions[option.id].includes(c.id)
          );
          selectedChoices.forEach(choice => {
            totalPrice += choice.priceDelta;
            optionDetails.push(`${option.name}: ${choice.name}`);
          });
        }
      }
    });

    // Create cart item with options
    const cartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: totalPrice,
      basePrice: selectedItem.price,
      qty: 1,
      options: optionDetails,
      selectedOptions: selectedOptions
    };

    // Add to cart
    const existingIdx = cartItems.findIndex((it) => 
      it.id === cartItem.id && 
      JSON.stringify(it.selectedOptions) === JSON.stringify(cartItem.selectedOptions)
    );

    let newItems;
    if (existingIdx >= 0) {
      newItems = cartItems.slice();
      newItems[existingIdx] = {
        ...newItems[existingIdx],
        qty: newItems[existingIdx].qty + 1,
      };
    } else {
      newItems = [...cartItems, cartItem];
    }
    
    setCartItems(newItems);
    
    // Persist to sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }

    closeOptionsModal();
  }

  async function checkDelivery() {
    if (!postcode) {
      alert('Please enter postcode');
      return;
    }

    // Check if postcode is valid for delivery
    const isValidPostcode = businessConfig.deliveryPostcodes.some(validPostcode => 
      postcode.toUpperCase().replace(/\s/g, '') === validPostcode.replace(/\s/g, '')
    );

    if (!isValidPostcode) {
      setDeliveryInfo({
        isDeliverable: false,
        reason: 'Sorry, we do not deliver to your postcode. You can place an order and collect from store.'
      });
      return;
    }

    try {
      const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/delivery/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'delivery', postcode, subtotalPence: subtotal }),
      });
      const data = await res.json();
      setDeliveryInfo(data);
    } catch (e) {
      console.error(e);
      setDeliveryInfo({
        isDeliverable: false,
        reason: 'Error checking delivery availability. Please try again.'
      });
    }
  }

  function removeItem(index) {
    const newItems = cartItems.slice();
    newItems.splice(index, 1);
    setCartItems(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }
  }

  function updateQuantity(index, newQty) {
    if (newQty <= 0) {
      removeItem(index);
      return;
    }
    const newItems = cartItems.slice();
    newItems[index] = { ...newItems[index], qty: newQty };
    setCartItems(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }
  }

  const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const deliveryFee = deliveryInfo?.feePence ? deliveryInfo.feePence / 100 : 0;
  const total = subtotal / 100 + deliveryFee;

  // Generate time slots for current mode
  const timeSlots = generateTimeSlots(mode);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
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
            <nav className="hidden md:flex space-x-8">
              <Link href="/feedback" className="text-gray-700 hover:text-gray-900">Feedback</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact Us</Link>
            </nav>
            
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

      {/* Main Layout - Three Columns */}
      <div className="container mx-auto py-8">
        <div className="row flex">
          {/* Left Sidebar - Categories */}
          <div className="col-md-3">
            <nav className="menu-categories">
              <ul className="list-unstyled">
                {data.categories.map((cat) => (
                  <li key={cat.id}>
                    <a 
                      href={`#cat-${cat.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveCategory(cat.id);
                      }}
                      className={`block bg-red-600 text-white p-3 rounded mb-2 text-decoration-none font-weight-bold transition-colors ${
                        activeCategory === cat.id ? 'bg-red-700' : 'hover:bg-red-700'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Center - Menu Items */}
          <div className="col-md-6">
            <div className="menu-items">
              {activeCategory && (
                <section id={`cat-${activeCategory}`}>
                  <h3 className="bg-red-600 text-white p-3 rounded text-xl font-bold mb-4">
                    {data.categories.find(c => c.id === activeCategory)?.name}
                  </h3>
                  {data.items
                    .filter((i) => i.categoryId === activeCategory)
                    .map((item) => (
                      <div key={item.id} className="menu-item">
                        <span className="name text-lg font-semibold">{item.name}</span>
                        <span className="price text-xl font-bold text-red-600">
                          £{(item.price / 100).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => openOptionsModal(item)}
                          className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 rounded font-semibold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ))}
                </section>
              )}
            </div>
          </div>

          {/* Right Sidebar - Order Panel */}
          <div className="col-md-3">
            <aside className="order-panel">
              <h4 className="bg-red-600 text-white p-3 rounded text-xl font-bold mb-4">Your Order</h4>
              
              {/* Delivery/Collection Mode */}
              <div className="option-row mb-4">
                <input 
                  type="radio" 
                  id="del" 
                  name="order-type" 
                  checked={mode === 'delivery'}
                  onChange={() => setMode('delivery')}
                />
                <label htmlFor="del" className="ml-2">Home Delivery</label>
                <div className="business-hours">Starts at: 05:15 pm</div>
              </div>
              <div className="option-row mb-4">
                <input 
                  type="radio" 
                  id="col" 
                  name="order-type" 
                  checked={mode === 'collection'}
                  onChange={() => setMode('collection')}
                />
                <label htmlFor="col" className="ml-2">Collection</label>
                <div className="business-hours">Starts at: 04:45 pm</div>
              </div>

              {/* Business Hours Display */}
              <div className="business-hours mb-4">
                Store opening {businessConfig.openingTime}-{businessConfig.closingTime}
              </div>

              {/* Requested Time */}
              <label htmlFor="req-time" className="block mb-2 font-semibold">Requested Time</label>
              <select 
                id="req-time" 
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>

              {/* Delivery Postcode Check */}
              {mode === 'delivery' && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="Enter postcode"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button 
                      onClick={checkDelivery}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                    >
                      Check
                    </button>
                  </div>
                  {deliveryInfo && (
                    <div className={`delivery-status ${deliveryInfo.isDeliverable ? 'success' : 'error'}`}>
                      {deliveryInfo.isDeliverable
                        ? `Delivery fee £${(deliveryInfo.feePence / 100).toFixed(2)}, minimum order £${(deliveryInfo.minOrderPence / 100).toFixed(2)}`
                        : deliveryInfo.reason}
                    </div>
                  )}
                </div>
              )}

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <div className="cart-empty text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-500">Your shopping cart is empty!</p>
                </div>
              ) : (
                <ul className="cart-items">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="font-semibold">{item.name}</div>
                        {item.options && item.options.length > 0 && (
                          <div className="text-sm text-gray-600">
                            {item.options.map((option, optIdx) => (
                              <div key={optIdx} className="text-xs">{option}</div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <button 
                            onClick={() => updateQuantity(idx, item.qty - 1)}
                            className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(idx, item.qty + 1)}
                            className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">
                          £{((item.price * item.qty) / 100).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeItem(idx)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Order Summary */}
              {cartItems.length > 0 && (
                <div className="cart-summary mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span>Sub‑Total:</span>
                    <span>£{(subtotal / 100).toFixed(2)}</span>
                  </div>
                  {mode === 'delivery' && deliveryInfo?.isDeliverable && (
                    <div className="flex justify-between mb-2">
                      <span>Delivery:</span>
                      <span>£{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button 
                className="checkout-btn w-full mt-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0 || (mode === 'delivery' && (!deliveryInfo || !deliveryInfo.isDeliverable))}
                onClick={() => (window.location.href = '/checkout')}
              >
                {cartItems.length === 0 ? 'Cart Empty' : 'Checkout'}
              </button>
            </aside>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{selectedItem.name}</h3>
                <button 
                  onClick={closeOptionsModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">{selectedItem.description}</p>
              
              <div className="space-y-8">
                {selectedItem.options.map((option) => (
                  <div key={option.id} className="border-b border-gray-200 pb-8">
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      {option.name}
                      {option.required && <span className="text-red-500 ml-3 text-sm bg-red-100 px-2 py-1 rounded">Required</span>}
                    </h4>
                    <div className="space-y-3">
                      {option.choices.map((choice) => (
                        <label key={choice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center">
                            <input
                              type={option.type}
                              name={option.id}
                              value={choice.id}
                              checked={
                                option.type === 'radio' 
                                  ? selectedOptions[option.id] === choice.id
                                  : selectedOptions[option.id]?.includes(choice.id)
                              }
                              onChange={() => handleOptionChange(option.id, choice.id, option.type)}
                              className="mr-4"
                            />
                            <span className="font-semibold text-lg">{choice.name}</span>
                          </div>
                          {choice.priceDelta > 0 && (
                            <span className="text-red-600 font-bold text-lg">
                              +£{(choice.priceDelta / 100).toFixed(2)}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-2xl font-bold">
                  Total: £{((selectedItem.price + 
                    selectedItem.options.reduce((total, opt) => {
                      if (selectedOptions[opt.id]) {
                        if (opt.type === 'radio') {
                          const choice = opt.choices.find(c => c.id === selectedOptions[opt.id]);
                          return total + (choice?.priceDelta || 0);
                        } else {
                          return total + opt.choices
                            .filter(c => selectedOptions[opt.id]?.includes(c.id))
                            .reduce((sum, c) => sum + c.priceDelta, 0);
                        }
                      }
                      return total;
                    }, 0)) / 100).toFixed(2)}
                </span>
                <button
                  onClick={addItemWithOptions}
                  className="bg-red-600 text-white px-10 py-4 rounded-xl hover:bg-red-700 transition-colors font-bold text-lg shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
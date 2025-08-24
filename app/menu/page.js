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
      }
    }
    load();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                China Palace
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link href="/menu" className="text-gray-900 font-medium">Menu</Link>
              <Link href="/checkout" className="text-gray-700 hover:text-gray-900">Checkout</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Categories */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Categories</h2>
            <div className="space-y-2">
              {data.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Menu Items */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Menu</h1>
            <p className="text-gray-600">Choose from our delicious selection of authentic Chinese cuisine</p>
          </div>

          {activeCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items
                .filter((i) => i.categoryId === activeCategory)
                .map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {item.imageUrl && (
                      <div className="relative h-48">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">
                          £{(item.price / 100).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => openOptionsModal(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Cart */}
        <div className="w-80 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Order</h3>
            
            {/* Delivery/Collection Mode */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="collection"
                    checked={mode === 'collection'}
                    onChange={() => setMode('collection')}
                    className="mr-2"
                  />
                  <span>Collection</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="delivery"
                    checked={mode === 'delivery'}
                    onChange={() => setMode('delivery')}
                    className="mr-2"
                  />
                  <span>Delivery</span>
                </label>
              </div>
            </div>

            {/* Delivery Postcode Check */}
            {mode === 'delivery' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Enter postcode"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button 
                    onClick={checkDelivery}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Check
                  </button>
                </div>
                {deliveryInfo && (
                  <div className={`text-sm ${deliveryInfo.isDeliverable ? 'text-green-600' : 'text-red-600'}`}>
                    {deliveryInfo.isDeliverable
                      ? `Delivery fee £${(deliveryInfo.feePence / 100).toFixed(2)}, minimum order £${(deliveryInfo.minOrderPence / 100).toFixed(2)}`
                      : `Not deliverable: ${deliveryInfo.reason}`}
                  </div>
                )}
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {item.options && item.options.length > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            {item.options.map((option, optIdx) => (
                              <div key={optIdx}>{option}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeItem(idx)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(idx, item.qty - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(idx, item.qty + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-medium">
                        £{((item.price * item.qty) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{(subtotal / 100).toFixed(2)}</span>
                </div>
                {mode === 'delivery' && deliveryInfo?.isDeliverable && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>£{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <div className="mt-6">
              <button 
                disabled={cartItems.length === 0} 
                onClick={() => (window.location.href = '/checkout')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {cartItems.length === 0 ? 'Cart Empty' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                <button 
                  onClick={closeOptionsModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              
              <div className="space-y-4">
                {selectedItem.options.map((option) => (
                  <div key={option.id} className="border-b pb-4">
                    <h4 className="font-medium mb-2">
                      {option.name}
                      {option.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <div className="space-y-2">
                      {option.choices.map((choice) => (
                        <label key={choice.id} className="flex items-center">
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
                            className="mr-2"
                          />
                          <span className="flex-1">{choice.name}</span>
                          {choice.priceDelta > 0 && (
                            <span className="text-green-600 font-medium">
                              +£{(choice.priceDelta / 100).toFixed(2)}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-lg font-semibold">
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
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <p>12 Barnsley Road, Hemsworth</p>
              <p>Pontefract, WF9 4PY</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
              <p>Monday: 12:00-15:00, 17:00-23:00</p>
              <p>Tuesday: Closed</p>
              <p>Wednesday: 12:00-15:00, 17:00-23:00</p>
              <p>Thursday: 12:00-15:00, 17:00-23:00</p>
              <p>Friday: 16:00-00:00</p>
              <p>Saturday: 16:00-00:00</p>
              <p>Sunday: 16:00-00:00</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p>Call: 01977 123456</p>
              <p>All credit cards accepted</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>China Palace © 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
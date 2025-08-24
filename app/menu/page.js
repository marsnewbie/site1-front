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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                China Palace
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link href="/menu" className="text-gray-900 font-medium">Menu</Link>
              <Link href="/checkout" className="text-gray-700 hover:text-gray-900">Checkout</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Layout - Three Columns */}
      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar - Categories */}
        <div className="w-80 bg-white shadow-sm min-h-screen sticky top-16">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Menu Categories</h2>
            <div className="space-y-2">
              {data.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="font-semibold text-lg">{cat.name}</div>
                  <div className="text-sm opacity-75 mt-1">
                    {data.items.filter(item => item.categoryId === cat.id).length} items
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Menu Items */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Menu</h1>
            <p className="text-xl text-gray-600">Choose from our delicious selection of authentic Chinese cuisine</p>
          </div>

          {activeCategory && (
            <div className="space-y-8">
              {data.items
                .filter((i) => i.categoryId === activeCategory)
                .map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex">
                      {/* Item Image */}
                      <div className="w-48 h-48 flex-shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                            <span className="text-5xl">🍜</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                          <span className="text-3xl font-bold text-green-600">
                            £{(item.price / 100).toFixed(2)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-lg mb-6">{item.description}</p>
                        
                        {item.options && item.options.length > 0 && (
                          <div className="mb-6">
                            <div className="text-sm text-gray-500 mb-3 font-medium">Customization available</div>
                            <div className="flex flex-wrap gap-2">
                              {item.options.slice(0, 3).map((option, idx) => (
                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                                  {option.name}
                                </span>
                              ))}
                              {item.options.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                                  +{item.options.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => openOptionsModal(item)}
                          className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
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
        <div className="w-96 bg-white shadow-sm min-h-screen sticky top-16">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h3>
            
            {/* Delivery/Collection Mode */}
            <div className="mb-6">
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
                  <span className="font-medium">Collection</span>
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
                  <span className="font-medium">Delivery</span>
                </label>
              </div>
            </div>

            {/* Delivery Postcode Check */}
            {mode === 'delivery' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Enter postcode"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button 
                    onClick={checkDelivery}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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
            <div className="space-y-4 mb-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add some delicious items to get started</p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                        {item.options && item.options.length > 0 && (
                          <div className="text-sm text-gray-600 mt-2">
                            {item.options.map((option, optIdx) => (
                              <div key={optIdx} className="text-xs">{option}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeItem(idx)}
                        className="text-red-500 hover:text-red-700 ml-3 p-1"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(idx, item.qty - 1)}
                          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(idx, item.qty + 1)}
                          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-xl text-green-600">
                        £{((item.price * item.qty) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span>£{(subtotal / 100).toFixed(2)}</span>
                </div>
                {mode === 'delivery' && deliveryInfo?.isDeliverable && (
                  <div className="flex justify-between text-lg">
                    <span>Delivery</span>
                    <span>£{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-2xl border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <div className="mt-8">
              <button 
                disabled={cartItems.length === 0} 
                onClick={() => (window.location.href = '/checkout')}
                className="w-full bg-green-600 text-white py-5 px-6 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold text-xl shadow-lg"
              >
                {cartItems.length === 0 ? 'Cart Empty' : 'Proceed to Checkout'}
              </button>
            </div>
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
                            <span className="text-green-600 font-bold text-lg">
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
                  className="bg-green-600 text-white px-10 py-4 rounded-xl hover:bg-green-700 transition-colors font-bold text-lg shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
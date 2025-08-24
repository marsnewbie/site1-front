"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cart from '../components/Cart';

export default function MenuPage() {
  const [data, setData] = useState({ categories: [], items: [] });
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/menu');
        if (res.ok) {
          const d = await res.json();
          setData(d);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Menu Section */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Menu</h1>
              <p className="text-gray-600">Choose from our delicious selection of authentic Chinese cuisine</p>
            </div>

            {data.categories.map((cat) => (
              <section key={cat.id} className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
                  {cat.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items
                    .filter((i) => i.categoryId === cat.id)
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
              </section>
            ))}
          </div>

          {/* Cart Section */}
          <div className="w-80">
            <Cart items={cartItems} onItemsChange={setCartItems} />
          </div>
        </div>
      </main>

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
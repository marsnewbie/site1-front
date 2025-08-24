"use client";
import { useState } from 'react';

export default function Cart({ items, onItemsChange }) {
  const [postcode, setPostcode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [mode, setMode] = useState('collection');

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const deliveryFee = deliveryInfo?.feePence ? deliveryInfo.feePence / 100 : 0;
  const minOrder = deliveryInfo?.minOrderPence ? deliveryInfo.minOrderPence / 100 : 0;
  const total = subtotal / 100 + deliveryFee;

  async function checkDelivery() {
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
      setDeliveryInfo(data);
    } catch (e) {
      console.error(e);
    }
  }

  function removeItem(index) {
    const newItems = items.slice();
    newItems.splice(index, 1);
    onItemsChange(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }
  }

  function updateQuantity(index, newQty) {
    if (newQty <= 0) {
      removeItem(index);
      return;
    }
    const newItems = items.slice();
    newItems[index] = { ...newItems[index], qty: newQty };
    onItemsChange(newItems);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
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
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          items.map((item, idx) => (
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
      {items.length > 0 && (
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
          disabled={items.length === 0} 
          onClick={() => (window.location.href = '/checkout')}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {items.length === 0 ? 'Cart Empty' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}
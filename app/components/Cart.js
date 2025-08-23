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

  return (
    <div className="cart">
      <h3>Your Order</h3>
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="collection"
            checked={mode === 'collection'}
            onChange={() => setMode('collection')}
          />
          Collection
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            name="mode"
            value="delivery"
            checked={mode === 'delivery'}
            onChange={() => setMode('delivery')}
          />
          Delivery
        </label>
      </div>
      {mode === 'delivery' && (
        <div style={{ marginTop: '0.5rem' }}>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Postcode"
            style={{ width: '70%', padding: '0.25rem' }}
          />
          <button onClick={checkDelivery} style={{ marginLeft: '0.5rem' }}>Check</button>
          {deliveryInfo && (
            <p style={{ marginTop: '0.5rem' }}>
              {deliveryInfo.isDeliverable
                ? `Delivery fee £${(deliveryInfo.feePence / 100).toFixed(2)}, minimum order £${(deliveryInfo.minOrderPence / 100).toFixed(2)}`
                : `Not deliverable: ${deliveryInfo.reason}`}
            </p>
          )}
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((it, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
            <span>
              {it.qty} × {it.name}
            </span>
            <span>
              £{(it.price * it.qty / 100).toFixed(2)}{' '}
              <button onClick={() => removeItem(idx)} style={{ marginLeft: '0.5rem' }}>x</button>
            </span>
          </li>
        ))}
      </ul>
      <div style={{ borderTop: '1px solid #eaeaea', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span>£{(subtotal / 100).toFixed(2)}</span>
        </div>
        {mode === 'delivery' && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery</span>
            <span>£{deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button disabled={items.length === 0} onClick={() => (window.location.href = '/checkout')}>
          Checkout
        </button>
      </div>
    </div>
  );
}
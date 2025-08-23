"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Simple checkout page supporting guest orders. It reads cart from localStorage for demonstration.
export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [mode, setMode] = useState('collection');
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [postcode, setPostcode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

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
          paymentMethod: 'card',
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
    <div>
      <header>
        <nav className="container flex justify-between items-center">
          <div><Link href="/">Home</Link></div>
          <div className="space-x-4">
            <Link href="/menu">Menu</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        </nav>
      </header>
      <main className="container">
        <h1 className="text-2xl font-semibold my-4">Checkout</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty. <Link href="/menu">Go back to menu.</Link></p>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                <input type="radio" name="mode" value="collection" checked={mode === 'collection'} onChange={() => setMode('collection')} />
                Collection
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input type="radio" name="mode" value="delivery" checked={mode === 'delivery'} onChange={() => setMode('delivery')} />
                Delivery
              </label>
            </div>
            {mode === 'delivery' && (
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="Postcode" />
                <button onClick={fetchQuote} style={{ marginLeft: '0.5rem' }}>Check</button>
                {quote && (
                  <p style={{ marginTop: '0.5rem' }}>{quote.isDeliverable ? `Delivery fee £${(quote.feePence / 100).toFixed(2)}, minimum order £${(quote.minOrderPence / 100).toFixed(2)}` : `Not deliverable: ${quote.reason}`}</p>
                )}
              </div>
            )}
            <h2>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
              <input type="text" placeholder="Full Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              <input type="text" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} style={{ marginTop: '0.5rem' }} />
              <input type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} style={{ marginTop: '0.5rem' }} />
              {mode === 'delivery' && (
                <input type="text" placeholder="Address line" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} style={{ marginTop: '0.5rem' }} />
              )}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <h2>Summary</h2>
              <p>Subtotal: £{(subtotal / 100).toFixed(2)}</p>
              {mode === 'delivery' && quote && quote.isDeliverable && <p>Delivery: £{(deliveryFee / 100).toFixed(2)}</p>}
              <p>Total: £{((subtotal + (quote?.feePence || 0)) / 100).toFixed(2)}</p>
            </div>
            <button disabled={isSubmitting || (mode === 'delivery' && (!quote || !quote.isDeliverable))} onClick={submitOrder} style={{ marginTop: '1rem' }}>
              Place Order
            </button>
            {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
          </div>
        )}
      </main>
      <footer>
        <div className="container text-sm">
          <p>Address: 123 High Street, Sample Town</p>
          <p>Hours: Mon-Sun 16:30 - 22:00</p>
          <p>© 2025 Takeaway. Designed by eTakeaway</p>
        </div>
      </footer>
    </div>
  );
}
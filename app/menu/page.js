"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cart from '../components/Cart';

export default function MenuPage() {
  const [data, setData] = useState({ categories: [], items: [] });
  const [cartItems, setCartItems] = useState([]);

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

  function addItem(item) {
    // Basic add to cart; no modifiers
    const existingIdx = cartItems.findIndex((it) => it.id === item.id);
    let newItems;
    if (existingIdx >= 0) {
      newItems = cartItems.slice();
      newItems[existingIdx] = {
        ...newItems[existingIdx],
        qty: newItems[existingIdx].qty + 1,
      };
    } else {
      newItems = [...cartItems, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    }
    setCartItems(newItems);
    // persist to sessionStorage for checkout page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newItems));
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
      <main className="container" style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 2 }}>
          {data.categories.map((cat) => (
            <section key={cat.id} id={cat.id} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{cat.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {data.items
                  .filter((i) => i.categoryId === cat.id)
                  .map((item) => (
                    <div key={item.id} style={{ background: '#fff', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '4px' }}>
                      {item.imageUrl && (
                        <div style={{ marginBottom: '0.5rem', position: 'relative', height: '200px' }}>
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </div>
                      )}
                      <h3 style={{ margin: 0 }}>{item.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>{item.description}</p>
                      <p style={{ fontWeight: 'bold' }}>£{(item.price / 100).toFixed(2)}</p>
                      <button onClick={() => addItem(item)} style={{ marginTop: '0.5rem' }}>Add</button>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <Cart items={cartItems} onItemsChange={setCartItems} />
        </div>
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
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Home page shows hero, about us, and category shortcuts.
export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/menu');
        if (res.ok) {
          const data = await res.json();
          const uniqueCats = data.categories || [];
          setCategories(uniqueCats);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

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
        <section className="my-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Takeaway</h1>
          <p className="mb-4">Order delicious meals online for collection or delivery.</p>
          <Link href="/menu" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Browse Menu
          </Link>
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/menu#${cat.id}`} className="block p-4 bg-white border rounded hover:shadow">
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-semibold mb-2">About Us</h2>
          <p>We are passionate about serving authentic cuisine. Place your order online and enjoy our dishes at home.</p>
        </section>
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
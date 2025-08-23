"use client";
import Link from 'next/link';

export default function RegisterPage() {
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
        <h1 className="text-2xl font-semibold my-4">Register</h1>
        <p>Registration functionality is not implemented in this demo.</p>
        <p>Please continue as a guest.</p>
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
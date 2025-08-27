"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // 行业标准：Prefetch menu page data when user lands on homepage
    // 这样用户点击菜单时数据已经在缓存中了
    const prefetchMenuData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
        
        // Prefetch in background, don't wait for completion
        Promise.all([
          fetch(`${apiUrl}/api/store/config`, { 
            cache: 'force-cache',
            next: { revalidate: 300 } 
          }),
          fetch(`${apiUrl}/api/store/hours`, { 
            cache: 'force-cache',
            next: { revalidate: 300 } 
          }),
          fetch(`${apiUrl}/api/menu`, { 
            cache: 'force-cache',
            next: { revalidate: 600 } 
          })
        ]).catch(() => {}); // Silent fail, not critical
      } catch (error) {
        // Silent fail - this is just prefetching for performance
      }
    };
    
    // Start prefetching after 2 seconds, when user is likely still on homepage
    setTimeout(prefetchMenuData, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section with Banner */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image 
            src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/banner-1-1440x760.jpg"
            alt="China Palace Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Link 
              href="/menu"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">ABOUT US</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Welcome to China Palace, your local destination for authentic and freshly prepared Chinese cuisine. 
            We take pride in serving delicious dishes made with traditional recipes, high-quality ingredients, 
            and a passion for flavor. Whether you're craving classic favourites like Sweet & Sour Chicken, 
            Crispy Beef, or freshly made Chow Mein, we've got something to satisfy every appetite.
          </p>
          <Link 
            href="/menu"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            FULL MENU
          </Link>
        </div>
      </section>

      {/* Online Menu Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">ONLINE MENU</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="mb-4">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/online-1.png"
                  alt="Beef Dishes"
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <Link 
                href="/menu"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-base font-medium transition-colors"
              >
                BEEF DISHES
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/online-02.png"
                  alt="Soup"
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <Link 
                href="/menu"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-base font-medium transition-colors"
              >
                SOUP
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/online-3.png"
                  alt="Rice Dishes"
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <Link 
                href="/menu"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-base font-medium transition-colors"
              >
                RICE DISHES
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/online-4.png"
                  alt="Duck Dishes"
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <Link 
                href="/menu"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-base font-medium transition-colors"
              >
                DUCK DISHES
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/online-5.png"
                  alt="Curry Dishes"
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <Link 
                href="/menu"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-base font-medium transition-colors"
              >
                CURRY DISHES
              </Link>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Image 
                  src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/online-6.png"
                  alt="Chicken Dishes"
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <Link 
                href="/menu"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-base font-medium transition-colors"
              >
                CHICKEN DISHES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Allergy Advice Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">ALLERGY ADVICE</h2>
          <p className="text-xl text-gray-600">
            If you have any allergies to any products, please inform us before ordering. We will do our best to advise you.
          </p>
        </div>
      </section>

      {/* Address and Opening Hours Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">ADDRESS</h3>
          <p className="text-xl text-gray-600 mb-2">3A North St, Crowland Peterborough, PE6 0EG</p>
          <p className="text-xl text-gray-600 mb-8">CALL: 01733 211788</p>
          
          <h4 className="text-2xl font-bold text-gray-900 mb-4">ALL CREDIT CARDS ACCEPTED</h4>
          <div className="mb-8">
            <Image 
              src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/homepage/cardss.png"
              alt="All Credit Cards Accepted"
              width={200}
              height={60}
              className="mx-auto"
            />
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-6">OPENING HOURS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-left">
              <p className="text-lg text-gray-600">Sunday: 16:30 - 22:00</p>
              <p className="text-lg text-gray-600">Monday: 16:30 - 22:00</p>
              <p className="text-lg text-gray-600">Tuesday: Closed</p>
              <p className="text-lg text-gray-600">Wednesday: 16:30 - 22:00</p>
            </div>
            <div className="text-left">
              <p className="text-lg text-gray-600">Thursday: 16:30 - 22:00</p>
              <p className="text-lg text-gray-600">Friday: 16:30 - 22:00</p>
              <p className="text-lg text-gray-600">Saturday: 16:30 - 22:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
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
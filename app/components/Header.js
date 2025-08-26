"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const handleProfileClick = (path) => {
    setShowUserMenu(false);
    router.push(path);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Social Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <i className="fa fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <i className="fa fa-facebook text-xl"></i>
            </a>
          </div>
          
          {/* Navigation Left */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 font-medium">Home</Link>
            <Link href="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact Us</Link>
          </nav>
          
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="https://erzoxdbzmmhshpkscfln.supabase.co/storage/v1/object/public/media/logo/logo01.png"
              alt="China Palace"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          
          {/* Navigation Right */}
          <div className="hidden md:flex space-x-8"></div>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <i className="fa fa-user-circle text-xl text-gray-600"></i>
                  <span className="font-medium">Hello, {user.firstName || user.first_name}</span>
                  <i className={`fa fa-chevron-${showUserMenu ? 'up' : 'down'} text-sm text-gray-600`}></i>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => handleProfileClick('/account-details')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fa fa-user text-gray-600 mr-2"></i>
                      Account Details
                    </button>
                    <button
                      onClick={() => handleProfileClick('/order-history')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fa fa-history text-gray-600 mr-2"></i>
                      Order History
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fa fa-sign-out text-gray-600 mr-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <i className="fa fa-user-circle-o text-gray-600"></i>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">login</Link>
                <span className="text-gray-600">or</span>
                <Link href="/register" className="text-gray-700 hover:text-gray-900">Register</Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <i className="fa fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
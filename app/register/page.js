"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    postcode: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.telephone.trim()) {
      errors.telephone = 'Phone number is required';
    }
    
    if (!formData.postcode.trim()) {
      errors.postcode = 'Postcode is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
      const res = await fetch(apiUrl + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          telephone: formData.telephone,
          postcode: formData.postcode,
          address: formData.address,
          password: formData.password
        }),
      });
      
      const data = await res.json();
      
      if (data.success && data.token) {
        // Use auth context to login
        login(data.user, data.token);
        
        setMessage('Registration successful! Redirecting...');
        
        setTimeout(() => {
          router.push('/');
        }, 1000);
        
      } else {
        setMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Registration Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join China Palace and enjoy online ordering</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.telephone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.telephone && <p className="text-red-500 text-sm mt-1">{formErrors.telephone}</p>}
                </div>
                
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.postcode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your postcode"
                  />
                  {formErrors.postcode && <p className="text-red-500 text-sm mt-1">{formErrors.postcode}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full address"
                ></textarea>
                {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                  {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mr-3 mt-1 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-red-600 hover:text-red-700">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-red-600 hover:text-red-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            {message && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-600 hover:text-gray-700 text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
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
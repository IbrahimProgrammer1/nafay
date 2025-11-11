'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/../context/CartContext'
import axios from 'axios'
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UserPayload {
  id: string
  name: string
  role: string
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserPayload | null>(null)
  const [loading, setLoading] = useState(true); // To handle initial session check
  const { getItemCount } = useCart()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get('/api/auth/me');
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      toast.success('Logged out successfully!');
      router.push('/');
      router.refresh(); // Important: refreshes server components and session data
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="bg-white/80 shadow-md backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">Nafay</Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-primary-600 transition-colors">Products</Link>
            
            {/* Conditional Links */}
            {!loading && user && !isAdmin && (
              <Link href="/account/orders" className="text-gray-600 hover:text-primary-600 transition-colors">My Orders</Link>
            )}
            {!loading && isAdmin && (
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getItemCount() > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {!loading && (
                user ? (
                  <div className="relative group">
                    <button className="flex items-center p-2 rounded-full hover:bg-gray-100">
                        <User className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
                      <p className="px-4 py-2 text-sm text-gray-500 truncate">Signed in as <strong>{user.name}</strong></p>
                      <div className="border-t border-gray-100"></div>
                      {isAdmin && (
                        <Link href="/admin/dashboard" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      )}
                       {user && !isAdmin && (
                        <Link href="/account/orders" className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                           <LayoutDashboard className="mr-2 h-4 w-4" /> My Orders
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/admin/login" className="hidden md:block px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    Login
                  </Link>
                )
            )}
            
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && !loading && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Products</Link>
            {user && !isAdmin && (
                <Link href="/account/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">My Orders</Link>
            )}
            {isAdmin && (
                <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Admin</Link>
            )}
            {!user && (
                <Link href="/admin/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
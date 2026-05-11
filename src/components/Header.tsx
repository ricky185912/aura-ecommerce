'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ShoppingBagIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  images: string[];
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  useEffect(() => {
    //eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const filtered = products.filter((p: Product) => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5));
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/new', label: 'New' },
    { href: '/trending', label: 'Trending' },
  ];

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return { label: 'Admin', bgColor: 'from-purple-500 to-purple-700' };
      case 'seller':
        return { label: 'Seller', bgColor: 'from-blue-500 to-blue-700' };
      default:
        return null;
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-cream-100/95 backdrop-blur-2xl shadow-md border-b border-raspberry-100/30' 
          : 'bg-cream-50/80 backdrop-blur-md border-b border-cream-200'
      }`}>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 h-14 sm:h-16 md:h-20">
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-100/50 backdrop-blur-sm border border-cream-200 hover:border-raspberry-300 hover:bg-raspberry-50/50 transition-all duration-300 flex-shrink-0"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-gray-600" /> : <Bars3Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-gray-600" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-raspberry-400 to-green-400 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-full h-full bg-gradient-to-br from-raspberry-500 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Image
                    src="/logo.jpeg"
                    alt="AURA Logo"
                    width={24}
                    height={24}
                    className="object-contain rounded-md sm:rounded-lg"
                    priority
                  />
                </div>
              </div>
              <div className="hidden xs:block">
                <span className="text-base sm:text-lg md:text-xl font-bold text-raspberry-700">AURA</span>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] tracking-wider text-cream-600 hidden xs:block">LUXURY DELIVERY</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`group relative px-3 xl:px-5 py-2 rounded-full transition-all duration-300 text-sm ${
                    pathname === link.href 
                      ? 'text-raspberry-600 bg-raspberry-50 font-medium' 
                      : 'text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-4 relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                  placeholder="Search luxury fashion..."
                  className="w-full px-4 py-2 pl-10 bg-white border border-cream-200 rounded-full text-gray-700 placeholder:text-cream-600 text-sm focus:outline-none focus:border-raspberry-300 focus:ring-2 focus:ring-raspberry-100 transition-all duration-300"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-600" />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Mobile Search */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-100/50 backdrop-blur-sm border border-cream-200 hover:border-raspberry-300 transition-all duration-300 flex items-center justify-center"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              {/* Wishlist */}
              <button className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-100/50 backdrop-blur-sm border border-cream-200 hover:border-raspberry-300 transition-all duration-300 items-center justify-center">
                <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-raspberry-600 transition-colors" />
              </button>

              {/* Cart */}
              <Link href="/cart">
                <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-100/50 backdrop-blur-sm border border-cream-200 hover:border-raspberry-300 transition-all duration-300 flex items-center justify-center">
                  <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-raspberry-600 transition-colors" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 bg-raspberry-600 rounded-full text-[8px] sm:text-[10px] text-white flex items-center justify-center font-bold shadow-md">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              </Link>
              
              {/* User Section */}
              {!loading && (
                <div className="relative">
                  {user ? (
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-100/50 backdrop-blur-sm border border-cream-200 hover:border-raspberry-300 transition-all duration-300 flex items-center justify-center"
                      aria-label="User menu"
                    >
                      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-raspberry-600 transition-colors" />
                      {roleBadge && (
                        <div className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r ${roleBadge.bgColor} rounded-full min-w-[14px] h-[14px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center shadow-md border border-white`}>
                          <span className="text-[6px] sm:text-[8px] text-white">●</span>
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Link href="/login">
                        <button className="hidden sm:block btn-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
                          Sign In
                        </button>
                      </Link>
                      <Link href="/register">
                        <button className="hidden sm:block btn-outline px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
                          Sign Up
                        </button>
                      </Link>
                      <Link href="/login" className="sm:hidden">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-100/50 backdrop-blur-sm border border-cream-200 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* User Dropdown */}
                  {isUserMenuOpen && user && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-cream-200 overflow-hidden z-50">
                        <div className="p-3 sm:p-4 border-b border-cream-200 bg-gradient-to-r from-raspberry-50 to-green-50">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-raspberry-500 to-green-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user.name}</p>
                              <p className="text-xs text-cream-700 truncate">{user.email}</p>
                            </div>
                          </div>
                          {roleBadge && (
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 mt-2 bg-gradient-to-r ${roleBadge.bgColor} rounded-full text-xs text-white`}>
                              {roleBadge.label} Account
                            </div>
                          )}
                        </div>
                        
                        <div className="py-1 sm:py-2">
                          {user.role === 'admin' && (
                            <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 transition-colors">
                              Admin Dashboard
                            </Link>
                          )}
                          {user.role === 'seller' && (
                            <Link href="/seller" onClick={() => setIsUserMenuOpen(false)} className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 transition-colors">
                              Seller Dashboard
                            </Link>
                          )}
                          <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 transition-colors">
                            My Orders
                          </Link>
                          <Link href="/wishlist" onClick={() => setIsUserMenuOpen(false)} className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 transition-colors">
                            Wishlist
                          </Link>
                          <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 transition-colors">
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-cream-200">
                          <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                            <ArrowRightOnRectangleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-3 border-t border-cream-200 mt-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 bg-white border border-cream-200 rounded-full text-gray-700 placeholder:text-cream-600 text-sm focus:outline-none focus:border-raspberry-300"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-600" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 bg-white border-t border-cream-200 shadow-xl z-50 py-4 px-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl transition-all text-base ${
                      pathname === link.href 
                        ? 'text-raspberry-600 bg-raspberry-50 font-medium' 
                        : 'text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!user && (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 transition-all text-base">
                      Sign In
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-white bg-raspberry-600 text-center text-base">
                      Create Account
                    </Link>
                  </>
                )}
                
                {user && (
                  <>
                    <div className="h-px bg-cream-200 my-2" />
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 text-base">
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'seller' && (
                      <Link href="/seller" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 text-base">
                        Seller Dashboard
                      </Link>
                    )}
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 text-base">
                      My Orders
                    </Link>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50 text-base">
                      Settings
                    </Link>
                    <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 text-left text-base">
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  );
}
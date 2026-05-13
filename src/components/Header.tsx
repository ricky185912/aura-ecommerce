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
  ArrowRightOnRectangleIcon
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
  const mobileSearchRef = useRef<HTMLDivElement>(null);
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-raspberry-800/85 via-raspberry-700/85 to-green-800/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.15)] border-b border-white/15' 
          : 'bg-gradient-to-r from-raspberry-800/80 via-raspberry-700/80 to-green-800/80 backdrop-blur-sm border-b border-white/15'
      }`}>
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 md:h-20">
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 hover:border-white/30 transition-all duration-300 flex-shrink-0 shadow-sm"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-white" />
              ) : (
                <Bars3Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-white" />
              )}
            </button>

            {/* Logo - AURA Brand (Always Visible) */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-full h-full bg-white/15 rounded-xl flex items-center justify-center shadow-md backdrop-blur-sm border border-white/25">
                  <Image
                    src="/logo.jpeg"
                    alt="AURA"
                    width={24}
                    height={24}
                    className="object-contain rounded-lg sm:w-6 sm:h-6 md:w-7 md:h-7"
                    priority
                  />
                </div>
              </div>
              {/* Brand name - now visible on all screen sizes */}
              <div>
                <span className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                  AURA
                </span>
                <div className="hidden xs:block text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] text-white/65 uppercase font-light">
                  LUXURY DELIVERY
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`group relative px-4 xl:px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                    pathname === link.href 
                      ? 'text-white bg-white/20 backdrop-blur-sm' 
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-6 relative">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                  placeholder="Search luxury fashion..."
                  className="w-full px-5 py-2.5 pl-11 bg-white/15 border border-white/20 rounded-full text-white placeholder:text-white/55 text-sm focus:outline-none focus:border-white/35 focus:ring-2 focus:ring-white/20 transition-all duration-300 shadow-sm backdrop-blur-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/55 group-focus-within:text-white/85 transition-colors" />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-cream-200 overflow-hidden z-50 animate-scale-in">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-raspberry-50/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-cream-100 rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-cream-600">{product.category}</p>
                      </div>
                      <p className="ml-auto text-sm font-medium text-raspberry-600">${product.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>

              {/* Cart */}
              <Link href="/cart">
                <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all duration-300 flex items-center justify-center shadow-sm group">
                  <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-white transition-colors" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-1.5 bg-gradient-to-r from-raspberry-400 to-green-400 rounded-full text-[8px] sm:text-[10px] font-semibold text-white flex items-center justify-center shadow-md">
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
                      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      aria-label="User menu"
                    >
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      {roleBadge && (
                        <div className={`absolute -top-1 -right-1 bg-gradient-to-r ${roleBadge.bgColor} rounded-full w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white shadow-sm`} />
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Link href="/login">
                        <button className="hidden sm:block px-5 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                          Sign In
                        </button>
                      </Link>
                      <Link href="/register">
                        <button className="hidden sm:block px-5 py-2 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full shadow-sm hover:bg-white/30 transition-all duration-300 border border-white/25">
                          Sign Up
                        </button>
                      </Link>
                      <Link href="/login" className="sm:hidden">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm">
                          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* User Dropdown */}
                  {isUserMenuOpen && user && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-cream-200 overflow-hidden z-50 animate-scale-in">
                        <div className="p-4 border-b border-cream-200 bg-gradient-to-r from-raspberry-50/50 to-green-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-raspberry-500 to-green-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                              <p className="text-xs text-cream-600 truncate">{user.email}</p>
                            </div>
                          </div>
                          {roleBadge && (
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 mt-3 bg-gradient-to-r ${roleBadge.bgColor} rounded-full text-[10px] font-medium text-white`}>
                              {roleBadge.label} Account
                            </div>
                          )}
                        </div>
                        
                        <div className="py-2">
                          {user.role === 'admin' && (
                            <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50/50 transition-colors">
                              Admin Dashboard
                            </Link>
                          )}
                          {user.role === 'seller' && (
                            <Link href="/seller" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50/50 transition-colors">
                              Seller Dashboard
                            </Link>
                          )}
                          <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50/50 transition-colors">
                            My Orders
                          </Link>
                          <Link href="/wishlist" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50/50 transition-colors">
                            Wishlist
                          </Link>
                          <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-raspberry-600 hover:bg-raspberry-50/50 transition-colors">
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-cream-200">
                          <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors">
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
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

          {/* Mobile Search Bar - Fixed positioning with working search */}
          {isSearchOpen && (
            <div ref={mobileSearchRef} className="md:hidden py-3 border-t border-white/15 mt-2 animate-fade-up">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                  placeholder="Search luxury fashion..."
                  className="w-full px-5 py-3 pl-11 bg-white/15 border border-white/20 rounded-full text-white placeholder:text-white/55 text-sm focus:outline-none focus:border-white/35 focus:ring-2 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/55" />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
              
              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-xl shadow-xl border border-cream-200 overflow-hidden z-50">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-raspberry-50/50 transition-colors border-b border-cream-100 last:border-0"
                    >
                      <div className="w-10 h-10 bg-cream-100 rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-cream-600">{product.category}</p>
                      </div>
                      <p className="ml-auto text-sm font-medium text-raspberry-600">${product.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="lg:hidden fixed top-16 left-0 right-0 bg-gradient-to-br from-raspberry-800 to-green-800 border-t border-white/15 shadow-xl z-50 py-4 px-5 max-h-[calc(100vh-4rem)] overflow-y-auto animate-fade-up">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl transition-all text-base font-medium ${
                      pathname === link.href 
                        ? 'text-white bg-white/20 backdrop-blur-sm' 
                        : 'text-white/85 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!user && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/15 transition-all text-base">
                      Sign In
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block mt-1 px-4 py-3 rounded-xl text-center bg-white/20 backdrop-blur-sm text-white font-medium text-base shadow-sm border border-white/25">
                      Create Account
                    </Link>
                  </div>
                )}
                
                {user && (
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <div className="px-4 py-3 mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold border border-white/30">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-white/65">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/15 text-base">
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'seller' && (
                      <Link href="/seller" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/15 text-base">
                        Seller Dashboard
                      </Link>
                    )}
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/15 text-base">
                      My Orders
                    </Link>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/15 text-base">
                      Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-white/15 text-base mt-1">
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
      </header>
      
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
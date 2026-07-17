"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'หน้าแรก', href: '#home' },
    { label: 'เกี่ยวกับเรา', href: '#about' },
    { label: 'กลุ่มธุรกิจ', href: '#business' },
    { label: 'คุณภาพและมาตรฐาน', href: '#quality' },
    { label: 'ความยั่งยืน', href: '#sustainability' },
    { label: 'บทความ / ข่าวสาร', href: '#news' },
    { label: 'ติดต่อเรา', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' : 'bg-white py-5'}`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <Logo className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-arigeo-gray hover:text-arigeo-red font-medium text-sm transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a href="#contact" className="bg-arigeo-red hover:bg-arigeo-darkred text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md">
            ติดต่อทีมขาย
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-arigeo-gray"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-6 flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-arigeo-gray hover:text-arigeo-red font-medium text-base py-2 border-b border-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="bg-arigeo-red text-center text-white px-6 py-3 rounded-full font-medium mt-2">
            ติดต่อทีมขาย
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;

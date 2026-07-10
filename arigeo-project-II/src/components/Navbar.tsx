"use client";
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Products', 'Industries', 'Quality', 'Contact'];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo representation */}
          <div className="font-black text-2xl tracking-tighter">
            <span className={scrolled ? 'text-arigeo-black' : 'text-white'}>ARI</span>
            <span className="text-arigeo-red">GEO</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className={`text-sm font-semibold tracking-wide uppercase transition-colors hover:text-arigeo-red ${scrolled ? 'text-arigeo-black' : 'text-white/90'}`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a href="#contact" className="px-6 py-3 rounded-full bg-arigeo-red text-white text-sm font-bold uppercase tracking-wider hover:bg-arigeo-darkred transition-colors shadow-lg">
            Contact Sales
          </a>
        </div>

        <button className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? (
            <svg className={`w-6 h-6 ${scrolled ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className={`w-6 h-6 ${scrolled ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {mobileMenu && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 border-t border-gray-100">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              onClick={() => setMobileMenu(false)}
              className="text-base font-bold text-arigeo-black uppercase tracking-wide border-b border-gray-100 pb-2"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

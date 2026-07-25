"use client";
import React, { useState } from 'react';

const items = [
  { href: '/about', category: 'About us', title: 'Get to know ARIGEO', src: '/images/home/news-corporate-building.png' },
  { href: '/products', category: 'Products', title: 'Products for everyday care', src: '/images/home/news-product-handwash.png' },
  { href: '/innovation', category: 'Innovation', title: 'Innovation starts with people', src: '/images/home/news-lifestyle-couple.png' },
  { href: '/brands', category: 'Our brands', title: 'Brands you can trust', src: '/images/home/hero-products.png' },
  { href: '/sustainability', category: 'Sustainability', title: 'Growing responsibly for the planet', src: '/images/home/news-sustainability-globe.png' },
];

const perView = 3;

const LatestCarousel = ({ heading = 'Latest' }: { heading?: string }) => {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, items.length - perView + 1);
  const goto = (p: number) => setPage(Math.max(0, Math.min(pages - 1, p)));

  return (
    <section className="py-12 px-4 bg-[#F6F6F4] font-sans">
      <h2 className="m-0 mb-8 text-[1.875rem] font-bold leading-[1.2] text-arigeo-black">{heading}</h2>
      <div className="overflow-hidden">
        <ul
          className="list-none m-0 p-0 flex gap-4 transition-transform duration-[450ms] ease-out"
          style={{ transform: `translateX(calc(-${page} * (100% + 16px) / ${perView}))` }}
        >
          {items.map((item) => (
            <li key={item.href} className="min-w-0" style={{ flex: `0 0 calc((100% - 16px * ${perView - 1}) / ${perView})` }}>
              <a href={item.href} className="grid grid-rows-[auto_1fr] gap-4 h-full no-underline text-inherit">
                <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.05em] text-arigeo-red-ink">{item.category}</span>
                  <h3 className="m-0 text-base font-semibold leading-[1.4] text-arigeo-black">{item.title}</h3>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goto(page - 1)}
          disabled={page === 0}
          className={`w-10 h-10 border-2 border-arigeo-black rounded-full bg-transparent inline-flex items-center justify-center ${page === 0 ? 'cursor-default opacity-30' : 'cursor-pointer opacity-100'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#010101" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <ol className="flex gap-3 list-none m-0 p-0">
          {Array.from({ length: pages }).map((_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Go to page ${i + 1}`}
                onClick={() => goto(i)}
                className="w-3 h-3 rounded-full p-0 cursor-pointer border-2"
                style={{ borderColor: i === page ? '#783636' : '#010101', background: i === page ? '#783636' : 'transparent' }}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          aria-label="Next"
          onClick={() => goto(page + 1)}
          disabled={page === pages - 1}
          className={`w-10 h-10 border-2 border-arigeo-black rounded-full bg-transparent inline-flex items-center justify-center ${page === pages - 1 ? 'cursor-default opacity-30' : 'cursor-pointer opacity-100'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#010101" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
};

export default LatestCarousel;

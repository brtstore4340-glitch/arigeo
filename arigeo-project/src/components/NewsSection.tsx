"use client";
import React, { useState } from 'react';

function ArrowIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Real news copy/dates aren't approved yet — "CONTENT REQUIRED" mirrors the
// design system's own gating convention rather than inventing plausible dates.
const articles = [
  { category: 'Corporate', date: 'CONTENT REQUIRED', title: 'CONTENT REQUIRED — News article pending approval', image: '/images/home/news-corporate-building.png' },
  { category: 'Product', date: 'CONTENT REQUIRED', title: 'CONTENT REQUIRED — News article pending approval', image: '/images/home/news-product-handwash.png' },
  { category: 'Sustainability', date: 'CONTENT REQUIRED', title: 'CONTENT REQUIRED — News article pending approval', image: '/images/home/news-sustainability-globe.png' },
  { category: 'Lifestyle', date: 'CONTENT REQUIRED', title: 'CONTENT REQUIRED — News article pending approval', image: '/images/home/news-lifestyle-couple.png' },
];

const perView = 4;

const NewsSection = () => {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, articles.length - perView + 1);
  const go = (d: number) => setPage((p) => Math.max(0, Math.min(pages - 1, p + d)));

  return (
    <section id="news" className="py-20 px-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-end justify-between gap-5 mb-[22px]">
        <div>
          <p className="m-0 mb-2 text-arigeo-red-ink text-xs font-bold tracking-[0.14em] uppercase">Newsroom</p>
          <h2 className="m-0 text-[32px] tracking-[-0.02em] text-arigeo-black font-extrabold">News &amp; Stories</h2>
        </div>
        <div className="flex items-center gap-[18px]">
          <a href="#" className="text-arigeo-red-ink inline-flex gap-2.5 items-center font-bold">
            View all news <ArrowIcon size={16} />
          </a>
          <div className="inline-flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              disabled={page === 0}
              className={`w-10 h-10 border border-[#e1e1e1] rounded-full bg-white inline-flex items-center justify-center ${page === 0 ? 'cursor-default opacity-35' : 'cursor-pointer opacity-100'}`}
            >
              <ArrowIcon size={16} className="rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              disabled={page === pages - 1}
              className={`w-10 h-10 border border-[#e1e1e1] rounded-full bg-white inline-flex items-center justify-center ${page === pages - 1 ? 'cursor-default opacity-35' : 'cursor-pointer opacity-100'}`}
            >
              <ArrowIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-[18px] transition-transform duration-[450ms] ease-out"
          style={{ transform: `translateX(calc(-${page} * (100% + 18px) / ${perView}))` }}
        >
          {articles.map((a, i) => (
            <article
              key={i}
              className="overflow-hidden bg-white border border-[#e3e3e3] rounded-[20px] shadow-[0_5px_18px_rgba(0,0,0,.05)] min-w-0"
              style={{ flex: `0 0 calc((100% - 18px * ${perView - 1}) / ${perView})` }}
            >
              <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${a.image})` }} />
              <div className="min-h-[190px] p-5 flex flex-col">
                <div className="flex items-center justify-between gap-2.5 text-xs text-[#777]">
                  <span className="text-arigeo-black border border-[#aaa] rounded-full px-[11px] py-1 bg-white">{a.category}</span>
                  <time>{a.date}</time>
                </div>
                <h3 className="my-4 text-base leading-[1.45] text-arigeo-black">{a.title}</h3>
                <a
                  href="#"
                  aria-label={`Read: ${a.title}`}
                  className="mt-auto self-end inline-flex items-center justify-center w-9 h-9 rounded-full text-arigeo-red-ink"
                >
                  <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2.5 mt-6">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to news slide ${i + 1}`}
            onClick={() => setPage(i)}
            className={`h-[9px] rounded-full border-0 cursor-pointer ${i === page ? 'w-7 bg-arigeo-red' : 'w-[9px] bg-[#d5d5d5]'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;

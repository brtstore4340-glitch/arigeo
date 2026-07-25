import React from 'react';

const socialItems = [
  { key: 'linkedin', label: 'LinkedIn', path: 'M20.447 20.452h-3.554V14.87c0-1.33-.026-3.04-1.852-3.04-1.853 0-2.136 1.446-2.136 2.94v5.682H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9H7.12zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z' },
  { key: 'instagram', label: 'Instagram', path: 'M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2H7.75zm0 1.8h8.5a3.95 3.95 0 0 1 3.95 3.95v8.5a3.95 3.95 0 0 1-3.95 3.95h-8.5a3.95 3.95 0 0 1-3.95-3.95v-8.5A3.95 3.95 0 0 1 7.75 3.8zM17.25 5.25a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 6.5A5.5 5.5 0 1 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 1.8A3.7 3.7 0 1 1 8.3 12 3.7 3.7 0 0 1 12 8.3z' },
  { key: 'youtube', label: 'YouTube', path: 'M23.498 6.186a2.99 2.99 0 0 0-2.103-2.117C19.541 3.57 12 3.57 12 3.57s-7.541 0-9.395.5A2.99 2.99 0 0 0 .502 6.186C0 8.054 0 12 0 12s0 3.946.502 5.814a2.99 2.99 0 0 0 2.103 2.117c1.854.499 9.395.499 9.395.499s7.541 0 9.395-.499a2.99 2.99 0 0 0 2.103-2.117C24 15.946 24 12 24 12s0-3.946-.502-5.814zM9.6 15.57V8.43L15.84 12 9.6 15.57z' },
  { key: 'facebook', label: 'Facebook', path: 'M13.135 22v-8.034h2.714l.406-3.13h-3.12V8.84c0-.907.252-1.525 1.553-1.525h1.659V4.513c-.287-.038-1.272-.123-2.418-.123-2.39 0-4.028 1.46-4.028 4.142v2.304H8.196v3.13h2.705V22z' },
];

const primaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Innovation', href: '/innovation' },
  { label: 'Our Brands', href: '/brands' },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-arigeo-line-strong bg-white font-sans">
      <a
        href="#top"
        aria-label="Page Top"
        className="absolute right-[clamp(18px,3vw,34px)] bottom-full mb-[18px] w-[46px] h-[46px] grid place-items-center border border-[rgba(17,17,17,0.14)] rounded-full bg-white shadow-[0_10px_24px_rgba(17,17,17,0.12)]"
      >
        <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-arigeo-black rotate-45 translate-x-0.5 translate-y-0.5" />
      </a>

      <div className="flex min-h-[104px] items-center justify-center gap-7 border-b border-arigeo-line-strong text-center flex-col py-5">
        <h2 className="m-0 text-[clamp(20px,2vw,28px)] font-extrabold">Follow us</h2>
        <div className="flex gap-3 flex-wrap justify-center">
          {socialItems.map((item) => (
            <button
              key={item.key}
              type="button"
              title="Awaiting Official URL"
              aria-label={`${item.label} — Awaiting official URL`}
              className="w-[46px] h-[46px] rounded-full grid place-items-center bg-white text-arigeo-black border border-[rgba(17,17,17,0.16)] cursor-help"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d={item.path} fill="currentColor" /></svg>
            </button>
          ))}
        </div>
      </div>

      <nav aria-label="Footer navigation" className="flex min-h-[78px] items-center justify-center flex-wrap border-b border-arigeo-line-strong">
        {primaryLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className={`flex min-h-11 items-center px-[18px] border-r border-arigeo-line-strong text-[#333] text-sm font-bold ${i === 0 ? 'border-l' : ''}`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-[auto_minmax(0,460px)] gap-7 items-center justify-center py-[34px]">
        <a href="/" aria-label="ARIGEO home" className="inline-flex items-center">
          <img src="/images/logos/arigeo-transparent.png" alt="ARIGEO logo" className="h-[38px] w-auto object-contain" />
        </a>
        <p className="m-0 text-[#666] text-[13px] leading-[1.8]">
          Trusted household and skincare products that combine advanced innovation with safety and care.
        </p>
      </div>

      <div className="border-t border-[rgba(17,17,17,0.1)] bg-[#f7f7f7] py-[18px]">
        <div className="max-w-[1440px] mx-auto w-[min(1440px,calc(100%-48px))] min-h-11 flex items-center justify-between flex-wrap gap-3.5">
          <p className="m-0 text-xs text-[#666]">Copyright © Arigeo Co., Ltd. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap">
            <a href="#" className="text-xs text-[#555]">Terms of Use</a>
            <a href="#" className="text-xs text-[#555]">Privacy Policy</a>
            <a href="#" className="text-xs text-[#555]">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

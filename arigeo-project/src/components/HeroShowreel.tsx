"use client";
import React, { useEffect, useRef, useState } from 'react';
import Button from './primitives/Button';

const SLIDES = [
  { id: 'cooking', src: '/images/home/hero-lifestyle-cooking.jpg', position: '78% 30%' },
  { id: 'family', src: '/images/home/hero-lifestyle-family-2.jpg', position: '52% 26%' },
  { id: 'household', src: '/images/home/hero-lifestyle-family-household.jpg', position: '42% 28%' },
  { id: 'innovation', src: '/images/home/hero-lifestyle-innovation.jpg', position: '46% 30%' },
  { id: 'sustainability', src: '/images/home/hero-lifestyle-sustainability.jpg', position: '38% 46%' },
  { id: 'about', src: '/images/home/hero-lifestyle-about-us.png', position: '62% 60%' },
];

const TAGLINE = ["We don't follow categories.", 'We create them.'];

function PauseIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>);
}
function PlayIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
}

const HeroShowreel = ({ intervalMs = 6500 }: { intervalMs?: number }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), intervalMs);
    return () => clearInterval(timerRef.current);
  }, [paused, intervalMs]);

  return (
    <section className="relative isolate overflow-hidden w-full bg-[#0b0b0b] h-[clamp(560px,80vh,680px)] font-sans">
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[900ms] ${i === active ? 'z-[1] opacity-100 animate-hero-wipe' : 'z-0 opacity-0'}`}
          >
            <img src={slide.src} alt="" className="w-full h-full object-cover" style={{ objectPosition: slide.position }} />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse 62% 55% at 50% 50%, rgba(0,0,0,.32), transparent 72%), linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.06) 30%, rgba(0,0,0,.22) 65%, rgba(0,0,0,.12) 100%)',
        }}
      />

      <div className="flex absolute inset-0 m-auto z-20 w-[min(760px,calc(100%-48px))] flex-col items-center justify-center gap-7 text-center">
        <h1
          className="m-0 text-white font-bold text-[clamp(28px,3.6vw,46px)] leading-[1.25] max-w-[24ch]"
          style={{ textShadow: '0 1px 2px #783636, 0 2px 14px #783636' }}
        >
          {TAGLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <span
                className={`block transition-all ease-[cubic-bezier(0.22,0.36,0.36,1)] duration-[900ms] ${show ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'}`}
                style={{ transitionDelay: show ? `${i * 120}ms` : '0ms' }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
        <span
          className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: show ? '340ms' : '0ms' }}
        >
          <Button href="/about#core-values">Our core value</Button>
        </span>
      </div>

      <div className="absolute z-[7] right-[clamp(16px,3vw,32px)] bottom-[clamp(20px,3vw,32px)] flex items-center gap-3.5">
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <span key={s.id} className={`w-5 h-[3px] rounded-[3px] ${i === active ? 'bg-white' : 'bg-white/35'}`} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play' : 'Pause'}
          className="w-11 h-11 rounded-full border border-white/35 bg-black/30 text-white inline-flex items-center justify-center cursor-pointer"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </section>
  );
};

export default HeroShowreel;

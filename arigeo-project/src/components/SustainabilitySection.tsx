"use client";
import React from 'react';

const SustainabilitySection = () => {
  return (
    <>
      <section id="sustainability" className="py-20 px-6 max-w-7xl mx-auto font-sans">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-arigeo-red-ink text-xs font-bold tracking-[0.14em] uppercase mb-3">Sustainability</p>
            <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.2] text-arigeo-black mb-6">
              Growing responsibly for a better tomorrow
            </h2>
            <p className="text-arigeo-gray text-[clamp(15px,1.1vw,16px)] leading-[1.8] mb-6">
              We grow responsibly through product choices, operations and partnerships that respect people and the planet.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-arigeo-black text-[15px]">
                <span className="font-bold text-arigeo-red">✓</span>
                <span>Safer, more sustainable products</span>
              </li>
              <li className="flex gap-3 text-arigeo-black text-[15px]">
                <span className="font-bold text-arigeo-red">✓</span>
                <span>Responsible sourcing practices</span>
              </li>
              <li className="flex gap-3 text-arigeo-black text-[15px]">
                <span className="font-bold text-arigeo-red">✓</span>
                <span>Community and environmental partnerships</span>
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/images/home/hero-lifestyle-sustainability.jpg"
              alt="Sustainability"
              className="w-full h-auto object-cover"
              width={915}
              height={667}
            />
          </div>
        </div>
      </section>

      <section className="shell newsletter-wrap bg-arigeo-red">
        <div className="newsletter py-24 px-6 max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-3">ติดตามข่าวสารจาก ARIGEO</h2>
            <p className="text-white/90">รับข่าวสารล่าสุดเกี่ยวกับนวัตกรรม ผลิตภัณฑ์ และการใช้ชีวิตประจำวัน</p>
          </div>
          <form noValidate className="flex gap-3 max-w-md">
            <label className="sr-only" htmlFor="email">อีเมลของคุณ</label>
            <input
              id="email"
              type="email"
              required
              placeholder="อีเมลของคุณ"
              aria-invalid="false"
              className="flex-1 px-4 py-3 rounded-lg text-arigeo-black placeholder-arigeo-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              defaultValue=""
            />
            <button
              type="submit"
              className="px-6 py-3 bg-arigeo-red-ink text-white font-bold rounded-lg hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              สมัครรับข่าวสาร
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SustainabilitySection;

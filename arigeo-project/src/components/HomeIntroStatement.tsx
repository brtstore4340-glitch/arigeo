import React from 'react';

const HomeIntroStatement = () => {
  return (
    <section className="px-6 max-w-7xl mx-auto py-[clamp(64px,6vw,104px)] pb-[clamp(42px,5vw,78px)] bg-white font-sans">
      <div className="grid gap-[clamp(16px,2vw,24px)] max-w-[980px]">
        <p className="m-0 text-arigeo-red-ink text-[13px] font-extrabold tracking-[0.08em] uppercase">ARIGEO Purpose</p>
        <h2 className="m-0 max-w-[820px] text-arigeo-black text-[clamp(30px,4vw,56px)] font-extrabold leading-[1.14]">
          Brightening everyday life with products people can trust.
        </h2>
        <p className="m-0 max-w-[760px] text-arigeo-gray text-[clamp(16px,1.35vw,19px)] leading-[1.85]">
          ARIGEO brings together household care, skincare, innovation and responsible growth so families can choose practical products with confidence.
        </p>
      </div>
    </section>
  );
};

export default HomeIntroStatement;

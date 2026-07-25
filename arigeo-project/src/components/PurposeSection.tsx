import React from 'react';

const PurposeSection = () => {
  return (
    <section id="purpose" className="py-[clamp(72px,7vw,116px)] bg-white font-sans">
      <div className="grid gap-3 max-w-[840px] mb-[clamp(28px,4vw,48px)] px-6 max-w-7xl mx-auto">
        <p className="m-0 text-arigeo-red-ink text-[13px] font-extrabold tracking-[0.08em] uppercase">Purpose</p>
        <h2 className="m-0 text-arigeo-black text-[clamp(30px,4vw,56px)] font-extrabold leading-[1.12]">
          Creating better everyday life through care, quality and innovation
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-arigeo-line-strong bg-white">
        <div className="min-w-0 border border-arigeo-line-strong border-t-0 border-l-0 transition-[opacity,transform] duration-[680ms] ease-out min-h-0 bg-card-green opacity-100 translate-y-0" style={{ transitionDelay: '0ms' }}>
          <a href="/about" className="block h-full text-inherit">
            <div className="flex flex-col gap-6 p-[clamp(28px,3.4vw,44px)]">
              <div className="overflow-hidden aspect-[16/10]">
                <img src="/images/home/purpose-about.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid gap-3.5">
                <h3 className="m-0 text-[clamp(22px,2vw,32px)] font-extrabold leading-[1.16] text-arigeo-black">About Us</h3>
                <p className="m-0 text-arigeo-gray text-[clamp(14px,1.05vw,16px)] leading-[1.85]">We develop high-quality household and skincare products designed around how people actually live.</p>
              </div>
              <span className="inline-flex items-center gap-3 text-sm font-extrabold text-arigeo-black">
                <span className="w-11 h-11 rounded-full inline-grid place-items-center border border-[rgba(17,17,17,0.18)] bg-white">
                  <span className="w-2 h-2 rotate-45 -translate-x-px translate-y-px border-t-2 border-r-2 border-arigeo-black"></span>
                </span>
                Read more
              </span>
            </div>
          </a>
        </div>
        <div className="min-w-0 border border-arigeo-line-strong border-t-0 border-l-0 transition-[opacity,transform] duration-[680ms] ease-out min-h-0 bg-card-blue opacity-100 translate-y-0" style={{ transitionDelay: '90ms' }}>
          <a href="/brands" className="block h-full text-inherit">
            <div className="flex flex-col gap-6 p-[clamp(28px,3.4vw,44px)]">
              <div className="overflow-hidden aspect-[16/10]">
                <img src="/images/home/purpose-brands.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid gap-3.5">
                <h3 className="m-0 text-[clamp(22px,2vw,32px)] font-extrabold leading-[1.16] text-arigeo-black">Our Brands</h3>
                <p className="m-0 text-arigeo-gray text-[clamp(14px,1.05vw,16px)] leading-[1.85]">Our brands help people make practical, reliable choices for cleaner homes and healthier daily routines.</p>
              </div>
              <span className="inline-flex items-center gap-3 text-sm font-extrabold text-arigeo-black">
                <span className="w-11 h-11 rounded-full inline-grid place-items-center border border-[rgba(17,17,17,0.18)] bg-white">
                  <span className="w-2 h-2 rotate-45 -translate-x-px translate-y-px border-t-2 border-r-2 border-arigeo-black"></span>
                </span>
                Read more
              </span>
            </div>
          </a>
        </div>
        <div className="min-w-0 border border-arigeo-line-strong border-t-0 border-l-0 transition-[opacity,transform] duration-[680ms] ease-out min-h-0 bg-card-gray opacity-100 translate-y-0" style={{ transitionDelay: '180ms' }}>
          <a href="/innovation" className="block h-full text-inherit">
            <div className="flex flex-col gap-6 p-[clamp(28px,3.4vw,44px)]">
              <div className="overflow-hidden aspect-[16/10]">
                <img src="/images/home/purpose-innovation.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid gap-3.5">
                <h3 className="m-0 text-[clamp(22px,2vw,32px)] font-extrabold leading-[1.16] text-arigeo-black">Innovation</h3>
                <p className="m-0 text-arigeo-gray text-[clamp(14px,1.05vw,16px)] leading-[1.85]">We solve everyday problems through focused research, formulation discipline and useful technology.</p>
              </div>
              <span className="inline-flex items-center gap-3 text-sm font-extrabold text-arigeo-black">
                <span className="w-11 h-11 rounded-full inline-grid place-items-center border border-[rgba(17,17,17,0.18)] bg-white">
                  <span className="w-2 h-2 rotate-45 -translate-x-px translate-y-px border-t-2 border-r-2 border-arigeo-black"></span>
                </span>
                Read more
              </span>
            </div>
          </a>
        </div>
        <div className="min-w-0 border border-arigeo-line-strong border-t-0 border-l-0 transition-[opacity,transform] duration-[680ms] ease-out min-h-0 bg-white opacity-100 translate-y-0" style={{ transitionDelay: '270ms' }}>
          <a href="/careers" className="block h-full text-inherit">
            <div className="flex flex-col gap-6 p-[clamp(28px,3.4vw,44px)]">
              <div className="overflow-hidden aspect-[16/10]">
                <img src="/images/home/purpose-careers.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid gap-3.5">
                <h3 className="m-0 text-[clamp(22px,2vw,32px)] font-extrabold leading-[1.16] text-arigeo-black">Careers</h3>
                <p className="m-0 text-arigeo-gray text-[clamp(14px,1.05vw,16px)] leading-[1.85]">We build a culture where people can contribute fully, grow their capability and do meaningful work together.</p>
              </div>
              <span className="inline-flex items-center gap-3 text-sm font-extrabold text-arigeo-black">
                <span className="w-11 h-11 rounded-full inline-grid place-items-center border border-[rgba(17,17,17,0.18)] bg-white">
                  <span className="w-2 h-2 rotate-45 -translate-x-px translate-y-px border-t-2 border-r-2 border-arigeo-black"></span>
                </span>
                Read more
              </span>
            </div>
          </a>
        </div>
        <div className="min-w-0 border border-arigeo-line-strong border-t-0 border-l-0 transition-[opacity,transform] duration-[680ms] ease-out col-span-full relative min-h-[clamp(280px,25vw,360px)] bg-[#111] opacity-100 translate-y-0" style={{ transitionDelay: '360ms' }}>
          <a href="/sustainability" className="block h-full text-white">
            <div className="relative min-h-[clamp(280px,25vw,360px)]">
              <img src="/images/home/hero-lifestyle-sustainability.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-x-0 top-[35%] bottom-0" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,.68))' }}></div>
              <div className="absolute z-[2] left-12 right-12 bottom-10 max-w-[620px] text-white">
                <h3 className="m-0 mb-3 text-[clamp(24px,2.15vw,36px)] font-extrabold leading-[1.16]">Sustainability</h3>
                <p className="m-0 mb-5 text-[clamp(14px,1.05vw,16px)] leading-[1.85] opacity-90">We grow responsibly through product choices, operations and partnerships that respect people and the planet.</p>
                <span className="inline-flex items-center gap-3 text-sm font-extrabold">
                  <span className="w-11 h-11 rounded-full inline-grid place-items-center border border-white/50">
                    <span className="w-2 h-2 rotate-45 -translate-x-px translate-y-px border-t-2 border-r-2 border-white"></span>
                  </span>
                  Read more
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;

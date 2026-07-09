"use strict";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Smartphone, Zap, Server } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card w-fit border-cyan/30">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
              <span className="text-xs md:text-sm text-cyan font-medium">Premium Website • AI Automation • SEO Ready</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              สร้างเว็บไซต์ระดับพรีเมียม <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-emerald">ระบบ AI และระบบอัตโนมัติ</span><br />
              ให้ธุรกิจของคุณเติบโตเร็วขึ้น
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-xl">
              Marcuxz Web ออกแบบและพัฒนาเว็บไซต์ที่ไม่ได้แค่สวย แต่ต้องค้นเจอบน Google โหลดเร็ว ใช้งานง่าย และเปลี่ยนผู้เข้าชมให้กลายเป็นลูกค้าได้จริง
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-cyan hover:bg-cyan/90 text-black font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                เริ่มปรึกษาฟรี <ArrowRight size={18} />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-card glass-card-hover text-white font-medium"
              >
                ดูบริการของเรา
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>SEO-ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Smartphone size={16} className="text-emerald" />
                <span>Mobile-first</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Zap size={16} className="text-emerald" />
                <span>Fast loading</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Server size={16} className="text-emerald" />
                <span>Vercel deployment</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
            {/* Visual Representation of Dashboard / Code */}
            <div className="w-full glass-card p-4 md:p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-emerald/5 opacity-50"></div>
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">marcuxz-web.vercel.app</div>
              </div>

              <div className="space-y-4">
                <div className="h-8 w-1/3 bg-white/5 rounded"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="h-24 bg-white/5 rounded-lg border border-white/5 flex flex-col p-3 gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
                      <Zap size={14} className="text-cyan" />
                    </div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                    <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                  </div>
                  <div className="h-24 bg-white/5 rounded-lg border border-white/5 flex flex-col p-3 gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-emerald" />
                    </div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                    <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                  </div>
                  <div className="hidden md:flex h-24 bg-white/5 rounded-lg border border-white/5 flex-col p-3 gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Server size={14} className="text-purple-400" />
                    </div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                    <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="h-32 bg-white/5 rounded-lg border border-white/5 mt-4 p-4 relative overflow-hidden">
                  <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan/10 to-transparent"></div>
                  {/* Mock Chart Lines */}
                  <svg className="w-full h-full text-cyan/50" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0 40 L10 35 L20 38 L30 25 L40 30 L50 15 L60 20 L70 5 L80 10 L90 2 L100 8" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

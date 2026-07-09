"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "ใช้เวลาทำเว็บไซต์กี่วัน?",
      a: "ระยะเวลาขึ้นอยู่กับขนาดของโปรเจกต์ แพ็กเกจเริ่มต้นใช้เวลาประมาณ 7-14 วัน ส่วนระบบที่มีความซับซ้อนและ AI Automation อาจใช้เวลา 3-6 สัปดาห์"
    },
    {
      q: "เว็บไซต์ติด Google ได้ไหม?",
      a: "ได้แน่นอน เราวางโครงสร้าง SEO ตั้งแต่เริ่มต้น รวมถึงการตั้งค่า Schema, Sitemap และ Core Web Vitals ให้เว็บไซต์ของคุณพร้อมสำหรับการจัดอันดับที่ดี"
    },
    {
      q: "แก้ไขข้อมูลเองได้ไหม?",
      a: "สามารถแก้ไขได้ เรามีระบบจัดการเนื้อหา (CMS) แบบ Headless หรือ Dashboard เฉพาะที่ใช้งานง่ายให้คุณดูแลเนื้อหาได้ด้วยตัวเอง"
    },
    {
      q: "มีค่าใช้จ่ายรายเดือนหรือไม่?",
      a: "ไม่มีค่าใช้จ่ายแอบแฝงสำหรับตัวเว็บไซต์หลัก (ยกเว้นกรณีที่คุณต้องการใช้บริการเสริมเช่น โดเมนรายปี, API ของ AI บางตัว, หรือบริการดูแลรักษารายเดือนที่เราสามารถตกลงกันได้)"
    },
    {
      q: "รองรับมือถือไหม?",
      a: "รองรับ 100% เราออกแบบด้วยแนวคิด Mobile-first เพื่อให้แสดงผลและใช้งานได้ดีเยี่ยมในทุกขนาดหน้าจอ"
    },
    {
      q: "ช่วย deploy ขึ้น Vercel ให้ไหม?",
      a: "ใช่ เราดำเนินการ Deploy บน Vercel ให้ฟรีในทุกแพ็กเกจ พร้อมตั้งค่า CI/CD เพื่อให้เว็บอัปเดตอัตโนมัติและโหลดเร็วทั่วโลก"
    },
    {
      q: "ต่อระบบ AI หรือ Chatbot ได้ไหม?",
      a: "ได้ครับ เราสามารถ Integrate AI API เช่น OpenAI, Gemini หรือสร้าง Custom Chatbot เพื่อตอบคำถามลูกค้าอัตโนมัติบนเว็บไซต์ของคุณได้"
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-near-black/50 border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">คำถามที่พบบ่อย</h2>
          <p className="text-gray-400 text-lg">
            ข้อสงสัยที่ลูกค้ามักจะถามเราก่อนเริ่มโปรเจกต์
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-card overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-300 ${openIdx === idx ? "rotate-180 text-cyan" : ""}`} 
                />
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIdx === idx ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

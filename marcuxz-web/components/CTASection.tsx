import Link from "next/link";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background visual */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan/5 -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto glass-card border-cyan/20 p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald/10 rounded-full blur-[80px]"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            พร้อมเปลี่ยนไอเดียของคุณให้เป็น<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-emerald">ระบบที่ใช้งานได้จริงหรือยัง?</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            คุยเป้าหมายของคุณก่อน แล้วเราจะช่วยวางทางเลือกที่เหมาะกับงบ เวลา และเป้าหมายธุรกิจ เพื่อผลลัพธ์ที่ดีที่สุดสำหรับคุณ
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="https://line.me/R/ti/p/@marcuxzweb" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00B900] hover:bg-[#009900] text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,185,0,0.3)]"
            >
              <MessageCircle size={20} />
              ติดต่อผ่าน LINE (@marcuxzweb)
            </Link>
            
            <Link 
              href="mailto:contact@marcuxzweb.com" 
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-card glass-card-hover text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              ส่งอีเมลปรึกษาฟรี
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>อีเมล: contact@marcuxzweb.com</span>
            <span>โทร: 080-XXX-XXXX (Placeholder)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

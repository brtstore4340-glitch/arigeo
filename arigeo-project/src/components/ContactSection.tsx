import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-arigeo-red text-white relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-arigeo-darkred/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div className="animate-fade-up hover-lift opacity-0">
            <h2 className="text-sm font-bold text-white/80 tracking-wider uppercase mb-3">Partner With Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">มองหาพันธมิตรด้านสุขภาพ เคมีภัณฑ์ หรือการเกษตร?</h3>
            <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-lg">
              ทีมงาน ARIGEO พร้อมให้คำแนะนำและนำเสนอผลิตภัณฑ์ที่เหมาะสมกับความต้องการขององค์กรคุณ เพื่อสร้างความสำเร็จร่วมกันอย่างยั่งยืน
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium">โทรศัพท์</p>
                  <p className="text-lg font-bold">02-XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium">อีเมล</p>
                  <p className="text-lg font-bold">contact@arigeo.co.th</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium">ที่ตั้งสำนักงาน</p>
                  <p className="text-base">กรุงเทพมหานคร, ประเทศไทย</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in opacity-0 stagger-2">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl text-foreground">
              <h4 className="text-2xl font-bold mb-6">ส่งข้อความถึงเรา</h4>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-arigeo-gray">ชื่อ - นามสกุล *</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-arigeo-red focus:ring-1 focus:ring-arigeo-red transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-arigeo-gray">องค์กร / บริษัท *</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-arigeo-red focus:ring-1 focus:ring-arigeo-red transition-all" placeholder="Company Name" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-arigeo-gray">อีเมล *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-arigeo-red focus:ring-1 focus:ring-arigeo-red transition-all" placeholder="john@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-arigeo-gray">กลุ่มธุรกิจที่สนใจ *</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-arigeo-red focus:ring-1 focus:ring-arigeo-red transition-all bg-white">
                    <option>ยาและเวชภัณฑ์</option>
                    <option>เครื่องมือแพทย์</option>
                    <option>เคมีภัณฑ์</option>
                    <option>ผลิตภัณฑ์เพื่อการเกษตร</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-arigeo-gray">ข้อความ</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-arigeo-red focus:ring-1 focus:ring-arigeo-red transition-all" placeholder="ระบุรายละเอียดที่ต้องการสอบถาม..."></textarea>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <button type="button" className="flex-1 bg-arigeo-red hover:bg-arigeo-darkred text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    ติดต่อทีมขาย
                  </button>
                  <button type="button" className="flex-1 bg-white border-2 border-arigeo-red text-arigeo-red hover:bg-arigeo-red/5 py-3.5 rounded-xl font-bold transition-all">
                    ขอข้อมูลผลิตภัณฑ์
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;

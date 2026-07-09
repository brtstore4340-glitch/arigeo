import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-gray-400 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/images/logos/arigeo.png" alt="Arigeo Logo" className="h-10 w-auto object-contain brightness-0 invert" />
              
            </div>
            <p className="text-sm leading-relaxed mb-6">
              ผู้จัดจำหน่ายยา เวชภัณฑ์ เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตร มุ่งเน้นคุณภาพ มาตรฐาน ความปลอดภัย และการเติบโตอย่างยั่งยืน
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">เมนูลัด</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" className="hover:text-arigeo-red transition-colors">หน้าแรก</a></li>
              <li><a href="#about" className="hover:text-arigeo-red transition-colors">เกี่ยวกับเรา</a></li>
              <li><a href="#quality" className="hover:text-arigeo-red transition-colors">คุณภาพและมาตรฐาน</a></li>
              <li><a href="#sustainability" className="hover:text-arigeo-red transition-colors">ความยั่งยืน</a></li>
              <li><a href="#news" className="hover:text-arigeo-red transition-colors">ข่าวสารและบทความ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">กลุ่มธุรกิจ</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-arigeo-red transition-colors">ยาและเวชภัณฑ์</a></li>
              <li><a href="#" className="hover:text-arigeo-red transition-colors">เครื่องมือแพทย์</a></li>
              <li><a href="#" className="hover:text-arigeo-red transition-colors">เคมีภัณฑ์</a></li>
              <li><a href="#" className="hover:text-arigeo-red transition-colors">ผลิตภัณฑ์เพื่อการเกษตร</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">ติดต่อเรา</h5>
            <ul className="space-y-3 text-sm">
              <li>บริษัท อะริเกโอ จำกัด</li>
              <li>123 อาคารออฟฟิศ ชั้น 10</li>
              <li>ถนนสุขุมวิท กรุงเทพมหานคร 10110</li>
              <li className="pt-2 text-arigeo-red font-medium">โทร: 02-XXX-XXXX</li>
              <li className="text-arigeo-red font-medium">อีเมล: contact@arigeo.co.th</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 ARIGEO COMPANY LIMITED. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

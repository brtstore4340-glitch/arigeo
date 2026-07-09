import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter glow-text inline-block mb-4">
              Marcuxz<span className="text-cyan">Web</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              รับสร้างเว็บไซต์ระดับพรีเมียม ระบบ AI และระบบอัตโนมัติ สำหรับธุรกิจที่ต้องการเติบโตจริงและสร้างยอดขายอย่างยั่งยืน
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">บริการของเรา</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#services" className="text-gray-400 hover:text-cyan transition-colors">Landing Page</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-cyan transition-colors">Corporate Website</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-cyan transition-colors">SEO Optimization</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-cyan transition-colors">AI & Automation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-cyan transition-colors">หน้าแรก</Link></li>
              <li><Link href="#workflow" className="text-gray-400 hover:text-cyan transition-colors">ขั้นตอนการทำงาน</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-cyan transition-colors">แพ็กเกจ</Link></li>
              <li><Link href="#faq" className="text-gray-400 hover:text-cyan transition-colors">คำถามที่พบบ่อย</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">LINE: @marcuxzweb</li>
              <li className="text-gray-400">Email: contact@marcuxzweb.com</li>
              <li className="text-gray-400">Tel: 080-XXX-XXXX</li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {currentYear} Marcuxz Web. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { MonitorSmartphone, Search, Bot } from "lucide-react";

export default function TransformationSection() {
  return (
    <section className="py-20 md:py-32 bg-near-black/50 border-y border-white/5 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Marcuxz เปลี่ยนเว็บไซต์ของคุณให้เป็น<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-cyan">ระบบดิจิทัลที่ใช้งานได้จริง</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 glass-card-hover group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan/10 rounded-full blur-xl group-hover:bg-cyan/20 transition-all"></div>
            <MonitorSmartphone size={40} className="text-cyan mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">Premium Website</h3>
            <p className="text-gray-400">
              เว็บไซต์สวย เร็ว มืออาชีพ และพร้อมขาย ออกแบบตามหลัก UX/UI เพื่อการใช้งานที่ลื่นไหล
            </p>
          </div>

          <div className="glass-card p-8 glass-card-hover group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald/10 rounded-full blur-xl group-hover:bg-emerald/20 transition-all"></div>
            <Search size={40} className="text-emerald mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">SEO Foundation</h3>
            <p className="text-gray-400">
              วางโครงสร้างให้ Google เข้าใจตั้งแต่วันแรก โค้ดสะอาด โหลดไว พร้อม Schema Markup ครบถ้วน
            </p>
          </div>

          <div className="glass-card p-8 glass-card-hover group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
            <Bot size={40} className="text-purple-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">AI Automation</h3>
            <p className="text-gray-400">
              ลดงานซ้ำ เพิ่มความเร็วให้ทีม และเชื่อมระบบหลังบ้านได้อัตโนมัติ เพื่อให้คุณโฟกัสกับการเติบโต
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

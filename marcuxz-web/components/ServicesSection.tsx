import Link from "next/link";
import { ArrowRight, LayoutTemplate, Building2, LineChart, MessageSquare, Workflow, LayoutDashboard, Rocket } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      title: "Landing Page สำหรับธุรกิจ",
      desc: "หน้าเว็บที่ออกแบบมาเพื่อปิดการขายโดยเฉพาะ",
      result: "เพิ่ม Conversion Rate ให้แคมเปญโฆษณา",
      icon: <LayoutTemplate size={32} className="text-cyan" />,
    },
    {
      title: "Corporate Website",
      desc: "เว็บไซต์บริษัทที่น่าเชื่อถือและให้ข้อมูลครบถ้วน",
      result: "สร้างภาพลักษณ์องค์กรระดับมืออาชีพ",
      icon: <Building2 size={32} className="text-emerald" />,
    },
    {
      title: "SEO Website",
      desc: "เว็บไซต์ที่ปรับแต่งโครงสร้างให้ติดอันดับง่าย",
      result: "เพิ่ม Organic Traffic ระยะยาว",
      icon: <LineChart size={32} className="text-blue-400" />,
    },
    {
      title: "AI Chatbot / Web Chat",
      desc: "ผู้ช่วยตอบคำถาม 24 ชั่วโมง",
      result: "ไม่พลาดลูกค้าแม้ในเวลานอกทำการ",
      icon: <MessageSquare size={32} className="text-purple-400" />,
    },
    {
      title: "Automation Workflow",
      desc: "เชื่อมต่อข้อมูลเว็บไซต์กับระบบหลังบ้าน",
      result: "ลดงานซ้ำซ้อนประหยัดเวลาแอดมิน",
      icon: <Workflow size={32} className="text-pink-400" />,
    },
    {
      title: "Dashboard / Internal Tool",
      desc: "ระบบจัดการข้อมูลสำหรับทีมภายใน",
      result: "ตัดสินใจทางธุรกิจได้แม่นยำขึ้น",
      icon: <LayoutDashboard size={32} className="text-orange-400" />,
    },
    {
      title: "Vercel Deployment & Perf.",
      desc: "บริการ Deploy และปรับจูนความเร็วสูงสุด",
      result: "เว็บโหลดไว ใช้งานได้ไม่มีสะดุด",
      icon: <Rocket size={32} className="text-yellow-400" />,
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">บริการของเรา</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            เราให้บริการพัฒนาเว็บไซต์และระบบดิจิทัลแบบครบวงจร ที่มุ่งเน้นผลลัพธ์ทางธุรกิจเป็นหลัก
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col h-full glass-card-hover group">
              <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:bg-white/10 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-400 mb-4 flex-grow">{service.desc}</p>
              
              <div className="pt-4 border-t border-white/10 mt-auto">
                <p className="text-xs font-medium text-emerald mb-4">ผลลัพธ์: {service.result}</p>
                <Link href="#contact" className="text-sm text-cyan flex items-center gap-1 group-hover:gap-2 transition-all">
                  ดูรายละเอียด <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

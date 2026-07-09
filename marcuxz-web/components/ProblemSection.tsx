import { XCircle } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    "เว็บโหลดช้า ลูกค้ารอไม่ไหวและกดออก",
    "Google หาไม่เจอ เสียโอกาสทางธุรกิจ",
    "ลูกค้าเข้าแล้วไม่รู้ว่าต้องทำอะไรต่อ (No Call-to-Action)",
    "ดีไซน์ไม่สร้างความน่าเชื่อถือ ดูไม่เป็นมืออาชีพ",
    "ไม่มีระบบช่วยลดงานซ้ำซ้อนให้ทีม",
    "ไม่มี analytics หรือ tracking ที่ใช้ตัดสินใจได้",
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            เว็บไซต์ส่วนใหญ่สวย <span className="text-red-400">แต่ไม่ช่วยให้ธุรกิจโต</span>
          </h2>
          <p className="text-gray-400 text-lg">
            หากเว็บไซต์ของคุณเป็นเพียงแค่โบรชัวร์ออนไลน์ที่ไม่มีคนเข้าถึง คุณกำลังสูญเสียโอกาสในการสร้างยอดขายทุกวัน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="glass-card p-6 flex items-start gap-4 border-red-500/10 bg-red-950/10">
              <XCircle className="text-red-400 shrink-0 mt-1" size={20} />
              <p className="text-gray-300">{problem}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

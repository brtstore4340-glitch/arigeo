import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter Website",
      desc: "สำหรับเริ่มต้น",
      features: [
        "Landing page 1 หน้า",
        "Responsive ทุกขนาดหน้าจอ",
        "Basic SEO",
        "Vercel Deploy",
      ],
      recommended: false,
    },
    {
      name: "Growth Website",
      desc: "สำหรับธุรกิจที่ต้องการโต",
      features: [
        "เว็บไซต์ 5-8 หน้า (Sections)",
        "Advanced SEO structure",
        "Contact form & Lead Gen",
        "Analytics Integration",
        "Performance optimization",
      ],
      recommended: true,
    },
    {
      name: "AI Business System",
      desc: "สำหรับธุรกิจที่ต้องการระบบเฉพาะ",
      features: [
        "Website + AI/Automation",
        "Dashboard / Workflow",
        "API Integration",
        "Custom Feature Development",
      ],
      custom: true,
      recommended: false,
    }
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 relative">
      <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-cyan/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">ขอบเขตงานชัดเจน โปร่งใส<br className="hidden sm:block" />ไม่มีค่าใช้จ่ายแอบแฝง</h2>
          <p className="text-gray-400 text-lg">
            เลือกแพ็กเกจที่เหมาะกับขนาดและเป้าหมายธุรกิจของคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`glass-card p-8 flex flex-col relative ${plan.recommended ? 'border-cyan/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] transform md:-translate-y-2' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Recommended
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.desc}</p>
              
              <div className="text-3xl font-bold text-white mb-8">
                {plan.custom ? "Custom Quote" : "ติดต่อสอบถาม"}
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-emerald shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="#contact" 
                className={`w-full py-3 rounded-full text-center font-semibold transition-all ${
                  plan.recommended 
                    ? 'bg-cyan hover:bg-cyan/90 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                ปรึกษาแพ็กเกจนี้
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

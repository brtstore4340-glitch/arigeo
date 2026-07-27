import React from 'react';
import { Leaf, Users, Sprout } from 'lucide-react';

const SustainabilitySection = () => {
  const pillars = [
    {
      title: 'Safer Products',
      subtitle: 'ผลิตภัณฑ์ที่คำนึงถึงความปลอดภัย',
      icon: <Leaf className="w-10 h-10" />,
    },
    {
      title: 'Responsible Sourcing',
      subtitle: 'คัดเลือกคู่ค้าอย่างรับผิดชอบ',
      icon: <Users className="w-10 h-10" />,
    },
    {
      title: 'Sustainable Growth',
      subtitle: 'สนับสนุนการเติบโตที่ยั่งยืน',
      icon: <Sprout className="w-10 h-10" />,
    },
  ];

  return (
    <section id="sustainability" className="py-24 relative text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/domo/asset-8.png" alt="Sustainability Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-arigeo-black/90 via-arigeo-darkred/80 to-arigeo-black/90"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up hover-lift opacity-0">
          <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">Sustainability</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">เติบโตอย่างรับผิดชอบ เพื่ออนาคตที่ยั่งยืน</h3>
          <p className="text-lg text-gray-200">
            ARIGEO เชื่อว่าการเติบโตทางธุรกิจต้องเดินไปพร้อมกับความรับผิดชอบต่อผู้ใช้ สังคม และสิ่งแวดล้อม เราสนับสนุนการใช้ผลิตภัณฑ์อย่างเหมาะสม ลดความเสี่ยงจากการใช้งานผิดวิธี และส่งเสริมแนวทางที่ปลอดภัยต่อคนและธรรมชาติ
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className={`bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center hover:bg-white/15 transition-colors duration-300 animate-fade-up hover-lift opacity-0 stagger-${index + 1}`}
            >
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center text-arigeo-red mb-6">
                {pillar.icon}
              </div>
              <h4 className="text-2xl font-bold mb-3">{pillar.title}</h4>
              <p className="text-gray-300">{pillar.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;

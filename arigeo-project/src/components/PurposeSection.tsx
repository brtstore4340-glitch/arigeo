import React from 'react';
import { ShieldCheck, HeartHandshake, TrendingUp } from 'lucide-react';

const PurposeSection = () => {
  const cards = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-arigeo-red" />,
      title: 'คัดสรรอย่างมีมาตรฐาน',
      description: 'เรามุ่งเน้นการคัดเลือกผลิตภัณฑ์จากผู้ผลิตที่ได้รับการรับรองมาตรฐานสากล เพื่อความมั่นใจในทุกการใช้งาน',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-arigeo-red" />,
      title: 'ส่งมอบด้วยความรับผิดชอบ',
      description: 'ให้ความสำคัญกับกระบวนการจัดเก็บ ขนส่ง และควบคุมคุณภาพอย่างเข้มงวดจนถึงมือผู้รับ',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-arigeo-red" />,
      title: 'เติบโตไปพร้อมกับสังคม',
      description: 'สนับสนุนผลิตภัณฑ์ที่เป็นมิตรกับผู้ใช้งานและสิ่งแวดล้อม เพื่อการพัฒนาอย่างยั่งยืนของทุกภาคส่วน',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up hover-lift opacity-0">
          <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">จุดมุ่งหมายของเรา</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">ARIGEO เพื่อคุณภาพชีวิตที่ดีกว่า</h3>
          <p className="text-lg text-arigeo-gray leading-relaxed">
            ARIGEO ไม่ใช่แค่ผู้จัดจำหน่ายสินค้า แต่เป็นพันธมิตรที่คัดสรรผลิตภัณฑ์คุณภาพ ใช้งานได้จริง และตอบโจทย์ทั้งภาคสุขภาพ ภาคอุตสาหกรรม และภาคการเกษตร
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index}
              className={`bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover-lift animate-fade-up hover-lift opacity-0 stagger-${index + 1}`}
            >
              <div className="w-16 h-16 bg-arigeo-red/10 rounded-2xl flex items-center justify-center mb-6">
                {card.icon}
              </div>
              <h4 className="text-xl font-bold text-foreground mb-4">{card.title}</h4>
              <p className="text-arigeo-gray leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;

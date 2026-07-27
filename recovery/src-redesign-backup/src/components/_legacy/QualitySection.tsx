import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const QualitySection = () => {
  const steps = [
    {
      num: '01',
      title: 'Product Selection',
      description: 'คัดเลือกผลิตภัณฑ์จากแหล่งที่น่าเชื่อถือ'
    },
    {
      num: '02',
      title: 'Supplier Verification',
      description: 'ตรวจสอบผู้ผลิตและคู่ค้า'
    },
    {
      num: '03',
      title: 'Quality Review',
      description: 'พิจารณาคุณภาพ เอกสาร และมาตรฐานที่เกี่ยวข้อง'
    },
    {
      num: '04',
      title: 'Safe Distribution',
      description: 'จัดเก็บและส่งมอบอย่างเหมาะสม'
    },
    {
      num: '05',
      title: 'Customer Support',
      description: 'ให้คำแนะนำและดูแลหลังการขาย'
    }
  ];

  return (
    <section id="quality" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-arigeo-light/50 skew-x-12 translate-x-32 z-0"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="animate-fade-up hover-lift opacity-0">
            <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">Quality & Standards</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">คุณภาพและมาตรฐานคือหัวใจของเรา</h3>
            <p className="text-lg text-arigeo-gray mb-8 leading-relaxed">
              ARIGEO ให้ความสำคัญกับการคัดเลือกผลิตภัณฑ์ การตรวจสอบแหล่งที่มา การจัดเก็บ การขนส่ง และการให้ข้อมูลที่ถูกต้อง เพื่อให้ลูกค้าได้รับผลิตภัณฑ์ที่เหมาะสม ปลอดภัย และเชื่อถือได้
            </p>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-arigeo-light flex items-center justify-center text-arigeo-red font-bold border border-gray-100 group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300">
                      {step.num}
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="w-px h-12 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-foreground text-lg">{step.title}</h4>
                    <p className="text-arigeo-gray">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in opacity-0 stagger-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-arigeo-black h-[600px] flex items-center justify-center">
              <img src="/images/domo/asset-7.png" alt="Certified Excellence" className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-arigeo-black/90 via-arigeo-black/40 to-transparent"></div>
              
              <div className="relative text-center z-10 p-8 animate-float">
                <CheckCircle2 className="w-32 h-32 text-arigeo-red mx-auto mb-8 opacity-90 drop-shadow-lg" />
                <h3 className="text-white text-3xl font-bold mb-4 drop-shadow-md">Certified Excellence</h3>
                <p className="text-gray-200 text-lg drop-shadow-md">มาตรฐานที่องค์กรชั้นนำไว้วางใจ</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default QualitySection;

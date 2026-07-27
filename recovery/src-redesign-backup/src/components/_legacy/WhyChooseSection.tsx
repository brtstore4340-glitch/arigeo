import React from 'react';
import { Check } from 'lucide-react';

const WhyChooseSection = () => {
  const reasons = [
    'ครอบคลุมหลายกลุ่มธุรกิจ ทั้งสุขภาพ เคมีภัณฑ์ และเกษตร',
    'เข้าใจลึกซึ้งทั้งภาคสุขภาพและภาคการเกษตร',
    'ให้ความสำคัญกับมาตรฐานและความปลอดภัยสูงสุด',
    'ทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำอย่างใกล้ชิด',
    'ยืดหยุ่นและปรับตัวต่อความต้องการของลูกค้าองค์กร',
    'มุ่งสร้างความสัมพันธ์และพันธมิตรระยะยาวกับคู่ค้า',
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="animate-fade-up hover-lift opacity-0">
            <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">Why Arigeo</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-8">ทำไมองค์กรชั้นนำจึงเลือก ARIGEO</h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((reason, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-arigeo-red/10 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-arigeo-red" />
                  </div>
                  <p className="text-arigeo-gray font-medium">{reason}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-10 border-t border-gray-100 flex items-center gap-6">
              <div className="text-4xl font-bold text-arigeo-red">100+</div>
              <p className="text-arigeo-gray text-sm font-medium">องค์กรและพันธมิตร<br/>ที่ไว้วางใจเรา</p>
            </div>
          </div>
          
          <div className="relative animate-fade-in opacity-0 stagger-2">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
              <img src="/images/domo/img-2.png" alt="Partners & Trust" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

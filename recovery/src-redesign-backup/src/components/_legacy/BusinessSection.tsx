import React from 'react';
import { Pill, Stethoscope, FlaskConical, Tractor } from 'lucide-react';

const BusinessSection = () => {
  const businesses = [
    {
      id: 1,
      title: 'ยาและเวชภัณฑ์',
      description: 'จัดจำหน่ายยา เวชภัณฑ์ และผลิตภัณฑ์ด้านสุขภาพ สำหรับร้านยา คลินิก โรงพยาบาล และหน่วยงานที่เกี่ยวข้อง',
      icon: <Pill className="w-10 h-10 text-white" />,
      color: 'bg-arigeo-red', // arigeo-red
    },
    {
      id: 2,
      title: 'เครื่องมือแพทย์',
      description: 'อุปกรณ์และเครื่องมือแพทย์ที่ช่วยสนับสนุนการดูแลผู้ป่วย การตรวจประเมิน และการปฏิบัติงานของบุคลากรทางการแพทย์',
      icon: <Stethoscope className="w-10 h-10 text-white" />,
      color: 'bg-arigeo-darkred', // arigeo-darkred
    },
    {
      id: 3,
      title: 'เคมีภัณฑ์',
      description: 'เคมีภัณฑ์คุณภาพสำหรับงานอุตสาหกรรม ห้องปฏิบัติการ การผลิต และการใช้งานเฉพาะทาง โดยให้ความสำคัญกับความปลอดภัย',
      icon: <FlaskConical className="w-10 h-10 text-white" />,
      color: 'bg-arigeo-black', // arigeo-gray
    },
    {
      id: 4,
      title: 'ผลิตภัณฑ์เพื่อการเกษตร',
      description: 'โซลูชันเพื่อภาคการเกษตรที่ช่วยเพิ่มประสิทธิภาพการผลิต สนับสนุนการเติบโตของพืช และส่งเสริมการจัดการฟาร์มอย่างยั่งยืน',
      icon: <Tractor className="w-10 h-10 text-white" />,
      color: 'bg-arigeo-red', // arigeo-red
    },
  ];

  return (
    <section id="business" className="py-24 bg-arigeo-light relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-fade-up hover-lift opacity-0">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">Business Fields</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">กลุ่มธุรกิจของเรา</h3>
          </div>
          <p className="text-arigeo-gray max-w-md">
            ครอบคลุมทุกความต้องการด้านสุขภาพ อุตสาหกรรม และการเกษตร ด้วยผลิตภัณฑ์ที่ได้มาตรฐานและบริการระดับมืออาชีพ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {businesses.map((business, index) => (
            <div 
              key={business.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col sm:flex-row animate-fade-up hover-lift opacity-0 stagger-${index + 1}`}
            >
              <div className={`relative sm:w-1/3 flex items-center justify-center overflow-hidden ${business.color}`}>
                <img src={`/images/domo/asset-${index + 9}.png`} alt={business.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                  {business.icon}
                </div>
              </div>
              <div className="p-8 sm:w-2/3 flex flex-col justify-center bg-white">
                <h4 className="text-2xl font-bold text-foreground mb-4 group-hover:text-arigeo-red transition-colors">{business.title}</h4>
                <p className="text-arigeo-gray leading-relaxed">{business.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;

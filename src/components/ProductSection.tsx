import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ProductSection = () => {
  const categories = [
    { title: 'Pharmaceuticals', desc: 'ยาและเวชภัณฑ์คุณภาพสูง', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Medical Supplies', desc: 'วัสดุสิ้นเปลืองทางการแพทย์', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Medical Devices', desc: 'อุปกรณ์และเครื่องมือแพทย์', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Laboratory Chemicals', desc: 'เคมีภัณฑ์สำหรับห้องปฏิบัติการ', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Industrial Chemicals', desc: 'เคมีภัณฑ์สำหรับอุตสาหกรรม', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Agricultural Products', desc: 'ผลิตภัณฑ์เพื่อการเกษตร', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Farm Solutions', desc: 'โซลูชันการจัดการฟาร์ม', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
    { title: 'Health & Wellness Products', desc: 'ผลิตภัณฑ์เพื่อสุขภาพองค์รวม', color: 'bg-arigeo-light text-arigeo-black group-hover:bg-arigeo-red group-hover:text-white transition-colors duration-300' },
  ];

  return (
    <section className="py-24 bg-arigeo-light relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up hover-lift opacity-0">
          <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">Our Categories</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">ผลิตภัณฑ์และโซลูชัน</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer animate-fade-up hover-lift opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${cat.color}`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-arigeo-red transition-colors">{cat.title}</h4>
              <p className="text-sm text-arigeo-gray mb-4">{cat.desc}</p>
              
              <div className="flex items-center text-sm font-medium text-arigeo-red opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                สอบถามข้อมูล <ArrowUpRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;

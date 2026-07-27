import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const NewsSection = () => {
  const articles = [
    {
      date: '12 ก.ค. 2569',
      category: 'Healthcare',
      title: 'แนวทางการเลือกเวชภัณฑ์สำหรับองค์กรและสถานพยาบาล',
      desc: 'เกณฑ์การตัดสินใจและข้อควรระวังในการจัดซื้อเวชภัณฑ์ เพื่อคุณภาพและความปลอดภัยสูงสุดของผู้รับบริการ',
      image: '/images/domo/img-3.png',
    },
    {
      date: '05 ก.ค. 2569',
      category: 'Industry',
      title: 'ความสำคัญของการจัดเก็บเคมีภัณฑ์อย่างปลอดภัย',
      desc: 'อัปเดตมาตรฐานการจัดเก็บและขนส่งเคมีภัณฑ์อุตสาหกรรม เพื่อลดความเสี่ยงและเพิ่มประสิทธิภาพในการทำงาน',
      image: '/images/domo/img-4.png',
    },
    {
      date: '28 มิ.ย. 2569',
      category: 'Agriculture',
      title: 'เกษตรสมัยใหม่กับการใช้ผลิตภัณฑ์อย่างยั่งยืน',
      desc: 'แนวโน้มการทำเกษตรกรรมที่ควบคู่ไปกับการรักษาสิ่งแวดล้อม และโซลูชันที่ช่วยสนับสนุนเกษตรกรไทย',
      image: '/images/domo/img-5.png',
    },
  ];

  return (
    <section id="news" className="py-24 bg-arigeo-light">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6 animate-fade-up hover-lift opacity-0">
          <div>
            <h2 className="text-sm font-bold text-arigeo-red tracking-wider uppercase mb-3">Insights & News</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">ความรู้และข่าวสาร</h3>
          </div>
          <button className="text-arigeo-red font-medium flex items-center gap-2 hover:gap-3 transition-all">
            ดูบทความทั้งหมด <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer animate-fade-up hover-lift opacity-0 stagger-${index + 1}`}
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-arigeo-gray/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-wider">
                  <span className="text-arigeo-red">{article.category}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {article.date}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-arigeo-red transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-arigeo-gray text-sm line-clamp-3">
                  {article.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

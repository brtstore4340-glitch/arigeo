export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Marcuxz Web",
  "description": "รับสร้างเว็บไซต์ระดับพรีเมียม โหลดเร็ว รองรับ SEO พร้อมระบบ AI และระบบอัตโนมัติ สำหรับธุรกิจ",
  "url": "https://marcuxzweb.com",
  "telephone": "+6600000000",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TH"
  },
  "priceRange": "$$"
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Marcuxz Web",
  "url": "https://marcuxzweb.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://marcuxzweb.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ใช้เวลาทำเว็บไซต์กี่วัน?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ระยะเวลาขึ้นอยู่กับขนาดของโปรเจกต์ แพ็กเกจเริ่มต้นใช้เวลาประมาณ 7-14 วัน ส่วนระบบที่มีความซับซ้อนและ AI Automation อาจใช้เวลา 3-6 สัปดาห์"
      }
    },
    {
      "@type": "Question",
      "name": "เว็บไซต์ติด Google ได้ไหม?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ได้แน่นอน เราวางโครงสร้าง SEO ตั้งแต่เริ่มต้น รวมถึงการตั้งค่า Schema, Sitemap และ Core Web Vitals ให้เว็บไซต์ของคุณพร้อมสำหรับการจัดอันดับที่ดี"
      }
    },
    {
      "@type": "Question",
      "name": "ช่วย deploy ขึ้น Vercel ให้ไหม?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ใช่ เราดำเนินการ Deploy บน Vercel ให้ฟรีในทุกแพ็กเกจ พร้อมตั้งค่า CI/CD เพื่อให้เว็บอัปเดตอัตโนมัติและโหลดเร็วทั่วโลก"
      }
    }
  ]
};

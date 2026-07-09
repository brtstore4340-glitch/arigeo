export default function WorkflowSection() {
  const steps = [
    { num: "01", title: "Decode เป้าหมายธุรกิจ", desc: "วิเคราะห์และทำความเข้าใจธุรกิจของคุณ เพื่อกำหนดทิศทางที่ถูกต้อง" },
    { num: "02", title: "วางโครงสร้างเว็บและ SEO", desc: "วางสถาปัตยกรรมข้อมูล (Information Architecture) และโครงสร้าง SEO" },
    { num: "03", title: "ออกแบบ UI/UX", desc: "ดีไซน์หน้าตาเว็บไซต์ให้สวยงาม ทันสมัย และใช้งานง่ายสำหรับผู้ใช้" },
    { num: "04", title: "พัฒนาเว็บไซต์", desc: "เขียนโค้ดด้วย Next.js และเทคโนโลยีล่าสุด เพื่อประสิทธิภาพสูงสุด" },
    { num: "05", title: "Optimize Performance", desc: "ปรับแต่งความเร็ว การแสดงผล และทดสอบตามมาตรฐาน Lighthouse" },
    { num: "06", title: "Deploy Vercel", desc: "นำขึ้นระบบผ่าน Vercel เพื่อความเสถียรและรวดเร็วในระดับโลก" },
    { num: "07", title: "ส่งมอบพร้อมคู่มือ", desc: "ส่งมอบงานพร้อมสอนการใช้งานเบื้องต้น เพื่อให้คุณดูแลต่อได้" },
  ];

  return (
    <section id="workflow" className="py-20 md:py-32 bg-near-black/30 border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">ขั้นตอนการทำงานของเรา</h2>
          <p className="text-gray-400 text-lg">
            เรามีกระบวนการที่เป็นระบบ ชัดเจน เพื่อให้คุณมั่นใจได้ว่างานที่ออกมาจะมีคุณภาพตรงตามเป้าหมาย
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Creating a staggered layout for the workflow */}
             {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`glass-card p-6 relative overflow-hidden ${idx === 6 ? "md:col-span-2 lg:col-span-2" : ""}`}
              >
                <div className="text-5xl font-black text-white/5 absolute -right-2 -bottom-4">{step.num}</div>
                <div className="text-cyan font-mono text-sm mb-3">STEP {step.num}</div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{step.title}</h3>
                <p className="text-sm text-gray-400 relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TechStackSection() {
  const techs = [
    "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel", 
    "SEO", "Schema", "Analytics", "AI API", "Supabase", "OpenAI", "Gemini"
  ];

  return (
    <section className="py-16 md:py-24 border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            เทคโนโลยีที่ใช้สร้างเว็บให้เร็ว เสถียร และขยายต่อได้
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
          {techs.map((tech, idx) => (
            <div 
              key={idx} 
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-cyan/10 hover:border-cyan/30 hover:text-cyan transition-all cursor-default"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

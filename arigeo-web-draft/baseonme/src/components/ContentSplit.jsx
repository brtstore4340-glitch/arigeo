import { ArrowRight, SprayCan, Droplets } from 'lucide-react';
import { images } from '@/lib/siteData';

const sections = [
  {
    title: 'Household',
    description: 'Smart solutions for a clean, safe and comfortable home for everyone.',
    icon: SprayCan,
    image: images.household,
  },
  {
    title: 'Skincare',
    description: 'Thoughtfully formulated skincare for healthy, beautiful skin every day.',
    icon: Droplets,
    image: images.skincare,
  },
];

export default function ContentSplit() {
  return (
    <section id="products" className="py-20 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-border bg-white group hover:shadow-lg transition-shadow duration-300"
          >
            {/* Text */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="mb-6">
                <section.icon size={40} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{section.title}</h3>
              <p className="text-muted-foreground mb-6">{section.description}</p>
              <button className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Explore Products <ArrowRight size={18} />
              </button>
            </div>
            {/* Image */}
            <div className="flex-1 min-h-[200px] sm:min-h-[300px]">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
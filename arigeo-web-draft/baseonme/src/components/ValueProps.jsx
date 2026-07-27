import { FlaskConical, Globe, Heart } from 'lucide-react';

const values = [
  {
    icon: FlaskConical,
    title: 'Innovation for Better Living',
    description:
      'We continuously create and improve products that deliver better performance and elevate everyday life.',
  },
  {
    icon: Globe,
    title: 'Sustainability for the Future',
    description:
      'We are committed to reducing our environmental impact and building a better world for future generations.',
  },
  {
    icon: Heart,
    title: 'Safety & Quality You Can Trust',
    description:
      'Every product is developed and tested with high standards to ensure safety, quality and reliability.',
  },
];

export default function ValueProps() {
  return (
    <section id="innovation" className="py-20 px-6 bg-secondary">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <value.icon size={36} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
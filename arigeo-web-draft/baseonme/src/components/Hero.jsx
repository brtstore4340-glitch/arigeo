import { ArrowRight } from 'lucide-react';
import { images } from '@/lib/siteData';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white min-h-[90vh] flex items-center">
      {/* Soft red circle — top right */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-primary/10 blur-[80px]" />

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Copy */}
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 text-balance">
            Elevating Everyday Life Through <span className="text-primary">Innovation</span>{' '}
            People Understand
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
            ARIGEO develops trusted household and skincare products that combine advanced innovation
            with safety and care—bringing quality to everyday life for everyone.
          </p>
          <button className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Discover More <ArrowRight size={18} />
          </button>
        </div>

        {/* Right: Product image */}
        <div className="relative">
          <img
            src={images.heroProducts}
            alt="ARIGEO product range"
            className="w-full max-w-xl mx-auto"
          />
        </div>
      </div>

      {/* Pagination — bottom left */}
      <div className="absolute bottom-8 left-6 md:left-12 flex gap-2 z-10">
        <div className="w-10 h-1 bg-primary rounded-full" />
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>
    </section>
  );
}
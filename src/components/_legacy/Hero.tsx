import {useTranslations} from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative bg-arigeo-black text-white overflow-hidden min-h-[600px] flex items-center">
      {/* Background Abstract Pattern / Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-arigeo-black via-arigeo-black/90 to-transparent z-10" />
      
      {/* We can place an actual image here later using next/image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-50"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000')" }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {t('headline')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            {t('description')}
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#products" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm text-white bg-arigeo-red hover:bg-red-700 transition-colors"
            >
              {t('ctaPrimary')}
            </a>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-400 text-base font-medium rounded-sm text-white hover:bg-white/10 transition-colors"
            >
              {t('ctaSecondary')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
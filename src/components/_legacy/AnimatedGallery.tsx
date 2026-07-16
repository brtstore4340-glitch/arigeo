import React from 'react';

const AnimatedGallery = () => {
  // Use images from the domo folder
  const images = Array.from({ length: 8 }, (_, i) => `/images/domo/asset-${i + 1}.png`);
  
  // Duplicate for seamless infinite scrolling
  const displayImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden bg-arigeo-light py-12 border-b border-gray-100">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 mb-4">
          <span className="w-2 h-2 rounded-full bg-arigeo-red"></span>
          <span className="text-xs font-medium text-arigeo-gray uppercase tracking-wider">Arigeo Company Limited</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4">
          ยกระดับคุณภาพชีวิต ด้วยเวชภัณฑ์และผลิตภัณฑ์เกษตรที่<span className="text-arigeo-red">ได้มาตรฐานสากล</span>
        </h1>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="relative w-full flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-[slide_30s_linear_infinite] w-max py-4">
          {displayImages.map((src, idx) => (
            <div 
              key={idx} 
              className="w-72 h-48 mx-4 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-float" 
              style={{ animationDelay: `${(idx % 8) * 0.3}s` }}
            >
              <img src={src} alt={`Gallery Image ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedGallery;

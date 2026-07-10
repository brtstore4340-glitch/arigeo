import React from 'react';

const AnimatedGallery = () => {
  // Use images from the domo folder
  const images = Array.from({ length: 8 }, (_, i) => `/images/domo/asset-${i + 1}.png`);
  
  // Duplicate for seamless infinite scrolling
  const displayImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden bg-arigeo-light py-12 border-b border-gray-100">
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

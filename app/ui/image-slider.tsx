'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: { url: string }[];
  baseUrl: string;
  altText?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, baseUrl, altText = 'Image' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[320px] lg:h-[600px] overflow-hidden rounded-lg">
      {/* Image */}
      <Image
        src={baseUrl + images[currentIndex].url}
        alt={`${altText} ${currentIndex + 1}`}
        fill
        className="object-cover transition duration-500 ease-in-out"
        priority
      />

      {/* Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-black p-2 text-4xl transition"
        aria-label="Previous image"
      >
        &#8592;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-4xl p-2 transition"
        aria-label="Next image"
      >
        &#8594;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;

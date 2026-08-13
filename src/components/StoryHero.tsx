import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface StoryHeroProps {
  backgroundImages?: {
    desktop: string[];
    mobile: string[];
  };
}

// Your local images
const defaultBackgrounds = {
  desktop: [
    '/hero/1_desktop.png',
    '/hero/2_desktop.png',
    '/hero/3_desktop.png',
  ],
  mobile: [
    '/hero/1_mobile.png',
    '/hero/2_mobile.png',
    '/hero/3_mobile.png',
  ],
};

export function StoryHero({ 
  backgroundImages = defaultBackgrounds,
}: StoryHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.desktop.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgroundImages.desktop.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get current images based on screen size
  const currentImages = isMobile ? backgroundImages.mobile : backgroundImages.desktop;

  return (
    <section
      className="relative w-full overflow-hidden bg-ink"
      aria-label="Background slider"
    >
      {/* Background Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0"
          >
            <picture>
              {/* Mobile image */}
              <source
                media="(max-width: 767px)"
                srcSet={backgroundImages.mobile[currentIndex] || backgroundImages.mobile[0]}
              />
              {/* Desktop image (default) */}
              <img
                src={backgroundImages.desktop[currentIndex] || backgroundImages.desktop[0]}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-[50%_28%]"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
        
        {/* Minimal gradients - just enough for text overlay if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/30 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-transparent" />
      </div>

      {/* Empty content - just the slider */}
      <div className="relative min-h-[55vh] sm:min-h-[62vh] lg:min-h-[68vh]" />

      {/* Slider Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2">
        {backgroundImages.desktop.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all sm:h-1.5 ${
              index === currentIndex
                ? 'w-6 bg-gold/60 sm:w-8'
                : 'w-2 bg-cream/10 hover:bg-cream/20 sm:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? backgroundImages.desktop.length - 1 : prev - 1))}
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-ink/60 p-1.5 text-mist/40 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-cream sm:left-4 sm:p-2 lg:block"
        aria-label="Previous image"
      >
        <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % backgroundImages.desktop.length)}
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-ink/60 p-1.5 text-mist/40 backdrop-blur-sm transition-all hover:bg-ink/80 hover:text-cream sm:right-4 sm:p-2 lg:block"
        aria-label="Next image"
      >
        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </section>
  );
}
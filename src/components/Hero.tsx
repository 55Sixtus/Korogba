import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BUSINESS_INFO } from '../data/mockData';

interface HeroProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
}

export default function Hero({ onOpenReservation, onExploreMenu }: HeroProps) {
  const heroImages = [
    '/assets/aistudio/image_e1aae617.png', // VIP Lounge
    '/assets/aistudio/image_1cd32473.png', // Rooftop Pergola Bar
    '/assets/aistudio/image_970bc4c1.png', // Dining Pavilion
    '/assets/aistudio/image_f66ec26e.png'  // Garden Terrace
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section id="home" className="relative min-h-[94vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background Slideshow with Smooth Transition */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
            style={{ transition: 'opacity 1s ease-in-out, transform 10s ease-out' }}
          >
            <img
              src={img}
              alt="KÓRÓGBÁ Atmosphere"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-[#08080b]/75 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-black/85" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Unboxed Editorial Eyebrow */}
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#dfba73] mb-6">
          {BUSINESS_INFO.slogan}
        </p>

        {/* Main Title */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight text-balance">
          An African Experience, <br />
          <span className="gold-gradient font-cormorant italic font-normal">Reimagined.</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300/90 font-light mb-10 leading-relaxed">
          Step into Lagos's premier island sanctuary of exquisite dining, artisanal mixology, exotic shisha, and high-energy nightlife at Royal Estate 2, Isheri-Igando Road.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            onClick={onOpenReservation}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#dfba73] via-[#c59f51] to-[#a67c2c] text-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#c59f51]/20 cursor-pointer"
          >
            Reserve Your Table
          </button>

          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-black/40 hover:bg-white/5 border border-[#dfba73]/40 hover:border-[#dfba73] text-white font-semibold text-xs uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer"
          >
            Explore Curated Menu
          </button>
        </div>

        {/* Slideshow Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentIdx ? 'w-8 bg-[#bf953f]' : 'w-2 bg-neutral-700'}`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Quick Venue Stats */}
        <div className="mt-14 pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="glass-card p-4 rounded-xl border border-[#bf953f]/10">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">24 Hours</span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1 block">Mon-Wed, Fri-Sun</span>
          </div>
          <div className="glass-card p-4 rounded-xl border border-[#bf953f]/10">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">Royal Estate 2</span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1 block">Isheri-Igando Road</span>
          </div>
          <div className="glass-card p-4 rounded-xl border border-[#bf953f]/10">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">Indoor Lounge</span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1 block">& Outdoor Terrace</span>
          </div>
          <div className="glass-card p-4 rounded-xl border border-[#bf953f]/10">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">Exotic Shisha</span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1 block">& Signature Grills</span>
          </div>
        </div>

      </div>
    </section>
  );
}

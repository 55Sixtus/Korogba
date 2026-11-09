import { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/mockData';

interface HeroProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
}

export default function Hero({ onOpenReservation, onExploreMenu }: HeroProps) {
  const heroImages = [
    '/assets/aistudio/image_e1aae617.png', // Indoor Lounge
    '/assets/aistudio/image_1cd32473.png', // Pergola Bar
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
    <section id="home" className="relative min-h-[96vh] flex items-center justify-center overflow-hidden py-24">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-[#08080b]/80 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-black/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Unboxed Editorial Eyebrow */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-black/60 border border-[#dfba73]/40 backdrop-blur-md shadow-lg">
          <p className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#dfba73]">
            {BUSINESS_INFO.slogan}
          </p>
        </div>

        {/* Main Title */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 sm:mb-8 leading-tight text-balance drop-shadow-2xl">
          An African Experience, <br />
          <span className="gold-gradient font-poppins italic font-light">Reimagined.</span>
        </h1>

        {/* Description Container with Changing Animated Background */}
        <div className="relative max-w-2xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950/80 via-black/90 to-neutral-950/80 border border-[#dfba73]/50 backdrop-blur-xl shadow-2xl shadow-[#dfba73]/10 overflow-hidden group">
          {/* Subtle Animated Shimmer Beam */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#dfba73]/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <p className="relative z-10 text-base sm:text-lg text-white font-medium leading-relaxed tracking-wide drop-shadow">
            Step into Lagos's premier island sanctuary of exquisite dining, artisanal mixology, exotic shisha, and high-energy nightlife at <strong className="text-[#dfba73] font-semibold">Royal Estate 2, Isheri-Igando Road</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onOpenReservation}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#dfba73] via-[#c59f51] to-[#a67c2c] text-black font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#c59f51]/30 cursor-pointer"
          >
            Reserve Your Table
          </button>

          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-black/60 hover:bg-white/10 border border-[#dfba73]/60 hover:border-[#dfba73] text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-lg"
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
              className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentIdx ? 'w-10 bg-[#bf953f]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'}`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Quick Venue Stats */}
        <div className="mt-16 pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="glass-card p-4 rounded-2xl border border-[#bf953f]/20 bg-black/40 backdrop-blur-md">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">24 Hours</span>
            <span className="text-xs text-neutral-300 uppercase tracking-wider mt-1 block font-medium">Mon-Wed, Fri-Sun</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-[#bf953f]/20 bg-black/40 backdrop-blur-md">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">Royal Estate 2</span>
            <span className="text-xs text-neutral-300 uppercase tracking-wider mt-1 block font-medium">Isheri-Igando Road</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-[#bf953f]/20 bg-black/40 backdrop-blur-md">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">Indoor Lounge</span>
            <span className="text-xs text-neutral-300 uppercase tracking-wider mt-1 block font-medium">& Outdoor Terrace</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-[#bf953f]/20 bg-black/40 backdrop-blur-md">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold gold-gradient">Exotic Shisha</span>
            <span className="text-xs text-neutral-300 uppercase tracking-wider mt-1 block font-medium">& Signature Grills</span>
          </div>
        </div>

      </div>
    </section>
  );
}

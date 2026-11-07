import { useState } from 'react';
import { X, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface Zone {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  capacity: string;
  bestFor: string;
}

export default function Story() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const zones: Zone[] = [
    {
      title: 'The Outdoor Pergola Bar',
      subtitle: 'Open-Air Garden Terrace & Match Viewing',
      description: 'An open-air garden terrace with warm ambient lighting, large screens for live sports viewing, and a fully stocked bar serving chilled beverages, draft beers, and tropical cocktails.',
      image: '/assets/aistudio/image_1cd32473.png',
      features: ['Live Sports Screenings', 'Warm Pendant Lighting', 'Draft & Bottled Beers', 'Breezy Open-Air Seating'],
      capacity: 'Up to 80 Guests',
      bestFor: 'Casual Hangouts, Match Days & Evening Relaxation'
    },
    {
      title: 'The Indoor Cocktail Lounge',
      subtitle: 'Sultry Botanical Sanctuary & Music',
      description: 'A stylish indoor retreat featuring overhead botanical decor, ambient mood lighting, premium spirit displays, and comfortable plush seating for relaxed evenings.',
      image: '/assets/aistudio/image_e1aae617.png',
      features: ['Overhead Botanical Ceiling', 'Ambient Mood Lighting', 'Premium Bottle Service', 'Air-Conditioned Comfort'],
      capacity: 'Up to 50 Guests',
      bestFor: 'Intimate Dates, Cocktail Evenings & VIP Seating'
    },
    {
      title: 'The Restaurant & Dining Room',
      subtitle: 'Authentic Culinary Pavilion',
      description: 'Handcrafted wooden slat screens and woven pendant lighting create an authentic, warm ambiance for dining on our signature grills and seafood platters with friends and family.',
      image: '/assets/aistudio/image_970bc4c1.png',
      features: ['Handcrafted Architectural Canopies', 'Woven Basket Pendant Lights', 'Dedicated Table Service', 'Family-Friendly Setup'],
      capacity: 'Up to 60 Guests',
      bestFor: 'Family Dinners, Suya Platters & Group Feasts'
    }
  ];

  return (
    <section id="story" className="py-24 bg-[#08080b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-3">
            Our Heritage & Atmosphere
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            Where African Heritage Meets <span className="gold-gradient font-cormorant italic font-normal">Modern Luxury</span>
          </h2>
          <p className="text-neutral-300/90 text-base sm:text-lg font-light leading-relaxed">
            Located in the heart of Royal Estate 2 along Isheri-Igando Road, <strong className="text-white font-medium">KÓRÓGBÁ Island Bar, Restaurant & Lounge</strong> was conceived as a royal sanctuary for Lagosians seeking an elevated social escape. We fuse rich cultural traditions with contemporary hospitality.
          </p>
        </div>

        {/* Venue Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {zones.map((zone, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedZone(zone)}
              className="glass-card rounded-2xl overflow-hidden border border-[#bf953f]/20 hover:border-[#bf953f]/60 transition-all duration-300 group flex flex-col cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={zone.image}
                  alt={zone.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#bf953f]/30 text-[#dfba73] text-[10px] font-semibold uppercase tracking-wider">
                  Explore Zone
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2 group-hover:text-[#bf953f] transition-colors">
                    {zone.title}
                  </h3>
                  <p className="text-xs text-[#dfba73] font-medium mb-3">{zone.subtitle}</p>
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    {zone.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-[#bf953f] font-semibold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>Explore Experience</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Zone Detail Modal */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-2xl w-full glass-card rounded-3xl p-6 sm:p-8 border border-[#bf953f]/40 my-8">
            <button
              onClick={() => setSelectedZone(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#bf953f] transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 rounded-2xl overflow-hidden mb-6 border border-neutral-800">
              <img src={selectedZone.image} alt={selectedZone.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-semibold text-[#dfba73] uppercase tracking-widest block mb-1">{selectedZone.subtitle}</span>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">{selectedZone.title}</h3>
              </div>
            </div>

            <p className="text-neutral-200 text-sm leading-relaxed font-light mb-6">
              {selectedZone.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-xs font-semibold text-[#dfba73] uppercase tracking-wider block mb-1">Capacity</span>
                <p className="text-white text-sm font-medium">{selectedZone.capacity}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-xs font-semibold text-[#dfba73] uppercase tracking-wider block mb-1">Ideal For</span>
                <p className="text-white text-sm font-medium">{selectedZone.bestFor}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-3">Zone Highlights & Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedZone.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-800/80">
                    <CheckCircle2 className="w-4 h-4 text-[#dfba73] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#home"
                onClick={() => setSelectedZone(null)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#dfba73] via-[#c59f51] to-[#a67c2c] text-black font-bold text-xs uppercase tracking-widest text-center shadow-lg hover:brightness-110 transition-all"
              >
                Reserve Table in this Zone
              </a>
              <button
                onClick={() => setSelectedZone(null)}
                className="w-full py-3.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

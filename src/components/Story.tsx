export default function Story() {
  const zones = [
    {
      title: 'The Outdoor Pergola Bar',
      description: 'An open-air garden terrace with warm ambient lighting, large screens, and a fully stocked bar serving chilled beverages and cocktails.',
      image: '/assets/aistudio/image_1cd32473.png'
    },
    {
      title: 'The Indoor Cocktail Lounge',
      description: 'A stylish indoor retreat featuring overhead botanical decor, ambient mood lighting, and comfortable seating for relaxed evenings.',
      image: '/assets/aistudio/image_e1aae617.png'
    },
    {
      title: 'The Restaurant & Dining Room',
      description: 'Handcrafted wooden slat screens and woven pendant lighting create an authentic ambiance for dining with friends and family.',
      image: '/assets/aistudio/image_970bc4c1.png'
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
              className="glass-card rounded-2xl overflow-hidden border border-[#bf953f]/20 hover:border-[#bf953f]/60 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={zone.image}
                  alt={zone.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-3 group-hover:text-[#bf953f] transition-colors">
                    {zone.title}
                  </h3>
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    {zone.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-[#bf953f] font-semibold tracking-wider uppercase">
                  <span>Explore Experience</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

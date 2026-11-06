import { UtensilsCrossed, Wine, Flame, Music, Crown } from 'lucide-react';

export default function ExperienceSection() {
  const experiences = [
    {
      title: 'Fine Restaurant & Grills',
      subtitle: 'Culinary Masterpieces',
      description: 'Savor authentic Nigerian grills, seafood platters, and chef specialties cooked to absolute perfection over open coals.',
      icon: <UtensilsCrossed className="w-5 h-5 text-[#dfba73]" />,
    },
    {
      title: 'Island Bar & Mixology',
      subtitle: 'Artisanal Cocktails',
      description: 'Enjoy premium imported cognacs, iced local beers, and handcrafted tropical cocktails designed by expert mixologists.',
      icon: <Wine className="w-5 h-5 text-[#dfba73]" />,
    },
    {
      title: 'Exotic Shisha Lounge',
      subtitle: 'Sensory Relaxation',
      description: 'Unwind with smooth, rich tobacco blends and multi-fruit shisha bowls in our ambient terrace and lounge spaces.',
      icon: <Flame className="w-5 h-5 text-[#dfba73]" />,
    },
    {
      title: 'Nightlife & DJ Sets',
      subtitle: 'Afrobeat & Amapiano',
      description: 'Experience Lagos nightlife at its finest with live DJ sets, curated lighting, and relaxed lounge seating.',
      icon: <Music className="w-5 h-5 text-[#dfba73]" />,
    },
    {
      title: 'Private Celebrations & Gatherings',
      subtitle: 'Royal Hospitality',
      description: 'Host memorable birthday parties, anniversary dinners, and private gatherings with attentive hospitality service.',
      icon: <Crown className="w-5 h-5 text-[#dfba73]" />,
    },
  ];

  return (
    <section id="experiences" className="py-24 bg-[#08080b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-3">
            The Pillars of Hospitality
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            Designed for <span className="gold-gradient font-cormorant italic font-normal">Royalty</span>
          </h2>
          <p className="text-neutral-300/90 text-base sm:text-lg font-light leading-relaxed">
            Every corner of KÓRÓGBÁ Island has been crafted to deliver an unmatched sensory escape in Isheri-Igando.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-8 border border-neutral-800/80 hover:border-[#dfba73]/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 text-[#dfba73]">
                {exp.icon}
              </div>

              <span className="text-xs font-medium text-[#dfba73] tracking-widest uppercase block mb-2">
                {exp.subtitle}
              </span>

              <h3 className="font-cinzel text-xl font-bold text-white mb-3 group-hover:text-[#dfba73] transition-colors">
                {exp.title}
              </h3>

              <p className="text-neutral-300/80 text-sm font-light leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}

          {/* Callout Card */}
          <div className="glass-card rounded-2xl p-8 border border-[#dfba73]/30 bg-gradient-to-br from-[#121218] via-[#15151e] to-[#08080b] flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-[#dfba73] tracking-widest uppercase block mb-2">
                Open 24 Hours
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white mb-3">
                Ready for the Royal Treatment?
              </h3>
              <p className="text-neutral-300/80 text-sm font-light leading-relaxed mb-6">
                Join us round the clock (Mon–Wed, Fri–Sun) for premier dining, bottle service, and nightlife in Lagos.
              </p>
            </div>
            
            <a
              href="#location"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfba73] hover:text-white transition-colors"
            >
              <span>View Location & Hours</span>
              <span>→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

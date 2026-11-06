import { BUSINESS_INFO } from '../data/mockData';
import { MapPin, Phone, Instagram, ExternalLink, Clock } from 'lucide-react';

export default function LocationContact() {
  return (
    <section id="location" className="py-24 bg-[#08080b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-3">
            Visit The Island
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            Location & <span className="gold-gradient font-cormorant italic font-normal">Opening Hours</span>
          </h2>
          <p className="text-neutral-300/90 text-base sm:text-lg font-light leading-relaxed">
            We are ready to welcome you to a royal experience in Lagos. Find us easily or reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Info Card */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-[#bf953f]/30">
            <h3 className="font-cinzel text-2xl font-bold text-white mb-6">
              {BUSINESS_INFO.name}
            </h3>

            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-[#bf953f]/30 flex items-center justify-center text-[#bf953f] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#bf953f] block mb-1">Official Address</span>
                  <p className="text-neutral-200 text-base font-medium">{BUSINESS_INFO.address}</p>
                  <a
                    href={BUSINESS_INFO.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#bf953f] hover:underline font-semibold mt-2"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-[#bf953f]/30 flex items-center justify-center text-[#bf953f] shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#bf953f] block mb-1">Telephone Enquiries</span>
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="text-neutral-200 text-base font-medium hover:text-[#bf953f] transition-colors">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-[#bf953f]/30 flex items-center justify-center text-[#bf953f] shrink-0 mt-1">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#bf953f] block mb-1">Social Media</span>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <a
                      href={BUSINESS_INFO.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-200 hover:text-[#bf953f] text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Instagram (@korogbaisland)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={BUSINESS_INFO.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-200 hover:text-[#bf953f] text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <span>TikTok (@korogba.island)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Opening Schedule Card */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-[#bf953f]/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-[#bf953f]/30 flex items-center justify-center text-[#bf953f]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-white">Opening Schedule</h3>
                <span className="text-xs text-[#bf953f] font-medium">Round-the-clock royal hospitality</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {BUSINESS_INFO.schedule.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <span className="text-sm font-medium text-white">{item.day}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.closed ? 'bg-red-950/60 border border-red-800/50 text-red-400' : 'bg-[#bf953f]/15 border border-[#bf953f]/40 text-[#bf953f]'}`}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
              <a
                href={BUSINESS_INFO.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#bf953f] via-[#d4af37] to-[#aa771c] text-black font-bold text-sm shadow-lg hover:shadow-[#bf953f]/30 transition-all inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-black" />
                <span>Get Directions to Royal Estate 2</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

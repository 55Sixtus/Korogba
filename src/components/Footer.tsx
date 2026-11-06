import { BUSINESS_INFO } from '../data/mockData';
import { MapPin, Phone, Instagram, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070709] border-t border-[#bf953f]/20 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#bf953f]/50 bg-black flex items-center justify-center">
                <img 
                  src="/assets/aistudio/image_22442516.png" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-cinzel font-bold text-white tracking-wider block">
                  KÓRÓGBÁ
                </span>
                <span className="text-[10px] tracking-widest text-[#bf953f] uppercase font-sans">
                  Island Lounge
                </span>
              </div>
            </div>
            <p className="text-sm font-light text-neutral-400 mb-4 leading-relaxed">
              {BUSINESS_INFO.tagline}. Lagos's premier oasis of exquisite dining, artisanal cocktails, and royal nightlife.
            </p>
            <span className="text-xs font-semibold text-[#bf953f] uppercase tracking-wider block">
              {BUSINESS_INFO.slogan}
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel font-bold text-white text-base mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#home" className="hover:text-[#bf953f] transition-colors">Home</a></li>
              <li><a href="#story" className="hover:text-[#bf953f] transition-colors">Our Story & Zones</a></li>
              <li><a href="#menu" className="hover:text-[#bf953f] transition-colors">Curated Menu</a></li>
              <li><a href="#experiences" className="hover:text-[#bf953f] transition-colors">Hospitality Pillars</a></li>
              <li><a href="#events" className="hover:text-[#bf953f] transition-colors">Events & VIP Lockouts</a></li>
              <li><a href="#gallery" className="hover:text-[#bf953f] transition-colors">Visual Gallery</a></li>
            </ul>
          </div>

          {/* Opening Schedule */}
          <div>
            <h4 className="font-cinzel font-bold text-white text-base mb-4">Opening Schedule</h4>
            <ul className="space-y-2 text-xs">
              {BUSINESS_INFO.schedule.map((item, idx) => (
                <li key={idx} className="flex justify-between py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-300">{item.day}</span>
                  <span className={item.closed ? 'text-red-400 font-semibold' : 'text-[#bf953f] font-semibold'}>{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-cinzel font-bold text-white text-base mb-4">Contact & Location</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#bf953f] shrink-0 mt-1" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-4 h-4 text-[#bf953f] shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-[#bf953f] transition-colors">{BUSINESS_INFO.phone}</a>
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#bf953f] transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={BUSINESS_INFO.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#bf953f] transition-colors text-xs font-semibold"
                  title="TikTok"
                >
                  TikTok
                </a>
                <a
                  href={BUSINESS_INFO.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#bf953f] transition-colors"
                  title="Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KÓRÓGBÁ Island Bar, Restaurant & Lounge. All rights reserved.</p>
          <p className="text-neutral-400">Royal Estate 2, Isheri-Igando Road, Lagos, Nigeria</p>
        </div>

      </div>
    </footer>
  );
}

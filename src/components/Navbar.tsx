import { useState, useEffect } from 'react';
import { Menu, X, Calendar, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenReservation: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenReservation, onOpenAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Story', href: '#story' },
    { name: 'Menu', href: '#menu' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#location' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0b0b0e]/95 backdrop-blur-md border-b border-[#bf953f]/20 shadow-xl py-3.5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-[#bf953f]/40 shadow-md group-hover:scale-105 transition-transform bg-black flex items-center justify-center">
            <img 
              src="/assets/aistudio/image_22442516.png" 
              alt="KÓRÓGBÁ Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-cinzel font-bold text-lg sm:text-xl tracking-wider text-white group-hover:text-[#bf953f] transition-colors">
              KÓRÓGBÁ
            </span>
            <span className="block text-[10px] tracking-widest text-[#bf953f] uppercase font-sans">
              Island Lounge
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-neutral-300 hover:text-[#bf953f] transition-colors tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            title="Management Portal"
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#bf953f] hover:border-[#bf953f]/40 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#bf953f]" />
          </button>

          <button
            onClick={onOpenReservation}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#bf953f] via-[#d4af37] to-[#aa771c] text-black font-semibold text-sm shadow-lg hover:shadow-[#bf953f]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve a Table</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenReservation}
            className="px-4 py-2 rounded-full bg-[#bf953f] text-black font-semibold text-xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-200 hover:text-[#bf953f] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0b0b0e]/98 backdrop-blur-xl border-b border-[#bf953f]/30 py-6 px-6 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-[#bf953f] transition-colors py-1 border-b border-neutral-800/60"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#bf953f]" />
                <span>Management Portal</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

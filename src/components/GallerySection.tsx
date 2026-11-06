import { useState } from 'react';
import { GALLERY_IMAGES } from '../data/mockData';
import { Maximize2, X } from 'lucide-react';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_IMAGES[0] | null>(null);

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-3">
            Visual Atmosphere
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            The Kórógbá <span className="gold-gradient font-cormorant italic font-normal">Gallery</span>
          </h2>
          <p className="text-neutral-300/90 text-base sm:text-lg font-light leading-relaxed">
            Authentic photography of our royal crest emblem, outdoor pergola bar, indoor cocktail lounge, and Isheri garden terrace.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="glass-card rounded-2xl overflow-hidden border border-[#bf953f]/20 hover:border-[#bf953f]/60 transition-all duration-300 group cursor-pointer relative"
            >
              <div className="relative h-72 overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={img.image}
                  alt={img.title}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${img.id === 'logo-official' ? 'object-contain p-8 bg-black/90' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                
                <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-[#bf953f]/30 text-[#bf953f] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6">
                <span className="text-xs font-semibold text-[#bf953f] uppercase tracking-wider block mb-1">
                  {img.category}
                </span>
                <h3 className="font-cinzel text-xl font-bold text-white mb-2">
                  {img.title}
                </h3>
                <p className="text-neutral-300 text-xs font-light line-clamp-2">
                  {img.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full glass-card rounded-2xl p-6 border border-[#bf953f]/40">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#bf953f] transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6 rounded-xl overflow-hidden bg-black max-h-[65vh] flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[60vh] object-contain w-full"
              />
            </div>

            <span className="text-xs font-semibold text-[#bf953f] uppercase tracking-wider block mb-1">
              {selectedImage.category}
            </span>
            <h3 className="font-cinzel text-2xl font-bold text-white mb-2">
              {selectedImage.title}
            </h3>
            <p className="text-neutral-300 text-sm font-light">
              {selectedImage.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

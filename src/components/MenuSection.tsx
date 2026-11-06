import { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../data/mockData';
import { MenuItem } from '../types';
import { fetchMenuItems } from '../lib/korogbaService';
import { Search } from 'lucide-react';

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState<'food' | 'drinks' | 'shisha'>('food');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);

  useEffect(() => {
    fetchMenuItems().then(fetched => {
      if (fetched && fetched.length > 0) {
        setItems(fetched);
      }
    });
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-24 bg-[#0a0a0e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-3">
            Royal Culinary Arts
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            The Kórógbá <span className="gold-gradient font-cormorant italic font-normal">Curated Menu</span>
          </h2>
          <p className="text-neutral-300/90 text-base sm:text-lg font-light leading-relaxed">
            Indulge in authentic Nigerian grills, exotic signature cocktails, and premium shisha blends crafted to perfection.
          </p>
        </div>

        {/* Category Segmented Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          
          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-md">
            {[
              { id: 'food', label: 'Food & Grills' },
              { id: 'drinks', label: 'Drinks & Cocktails' },
              { id: 'shisha', label: 'Shisha Lounge' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#dfba73] text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search dishes or drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#dfba73] transition-colors"
            />
          </div>

        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 border border-neutral-800/80 hover:border-[#dfba73]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[11px] font-medium text-[#dfba73] tracking-widest uppercase block mb-1">
                      {item.subcategory}
                    </span>
                    <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#dfba73] transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-medium tracking-wider text-[#dfba73] uppercase whitespace-nowrap pt-1">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-neutral-300/80 text-sm font-light leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="font-cinzel text-lg font-bold text-white tabular-nums">
                  {item.price}
                </span>
                <span className="text-xs text-neutral-400 font-light">
                  Dine-in & VIP Service
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-400">
            <p>No menu items found matching your search.</p>
          </div>
        )}

      </div>
    </section>
  );
}

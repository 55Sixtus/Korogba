import { useState, useEffect } from 'react';
import { EVENTS, BUSINESS_INFO } from '../data/mockData';
import { EventItem } from '../types';
import { fetchEvents, createEventEnquiry } from '../lib/korogbaService';
import { Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function EventsSection() {
  const [eventsList, setEventsList] = useState<EventItem[]>(EVENTS);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Birthday Celebration',
    guestCount: '20-50 Guests',
    preferredDate: '',
    details: ''
  });

  useEffect(() => {
    fetchEvents().then(fetched => {
      if (fetched && fetched.length > 0) {
        setEventsList(fetched);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const guestNum = parseInt(formData.guestCount.split('-')[0]) || 20;
    const res = await createEventEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      eventType: formData.eventType,
      guestCount: guestNum,
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      details: formData.details
    });
    setIsSubmitting(false);
    if (res.success) {
      setInquirySubmitted(true);
    } else {
      setErrorMsg(res.error || `Unable to submit enquiry at this time. Please call KÓRÓGBÁ directly at ${BUSINESS_INFO.phone}.`);
    }
  };

  return (
    <section id="events" className="py-24 bg-[#0b0b0e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-3">
            Nightlife & Private Celebrations
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            Events & <span className="gold-gradient font-cormorant italic font-normal">VIP Lockouts</span>
          </h2>
          <p className="text-neutral-300/90 text-base sm:text-lg font-light leading-relaxed">
            From Afrobeat Fridays to exclusive private celebrations, experience Lagos nights in royal style.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {eventsList.map((event) => (
            <div
              key={event.id}
              className="glass-card rounded-2xl overflow-hidden border border-[#bf953f]/20 hover:border-[#bf953f]/60 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/80 border border-neutral-800 text-[#dfba73] text-[11px] font-medium uppercase tracking-wider">
                  {event.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-[#bf953f] font-semibold mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                  </div>

                  <h3 className="font-cinzel text-xl font-bold text-white mb-3 group-hover:text-[#bf953f] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-neutral-300 text-sm font-light leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>

                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#bf953f] hover:border-[#bf953f]/50 text-center text-xs font-semibold uppercase tracking-wider transition-all block"
                >
                  Enquire for VIP Table
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Private Event Inquiry Box */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#bf953f]/30 max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-3">
              Book a Private Event or Celebration
            </h3>
            <p className="text-neutral-300 text-sm font-light">
              Planning a birthday, anniversary, or corporate party at Royal Estate 2? Fill out the form below and our management team will reach out immediately.
            </p>
          </div>

          {inquirySubmitted ? (
            <div className="text-center py-12 bg-neutral-900/80 rounded-2xl border border-[#bf953f]/30">
              <CheckCircle2 className="w-16 h-16 text-[#bf953f] mx-auto mb-4 animate-bounce" />
              <h4 className="font-cinzel text-2xl font-bold text-white mb-2">Inquiry Received Successfully!</h4>
              <p className="text-neutral-300 text-sm max-w-md mx-auto mb-6">
                Thank you, {formData.name}. Our hospitality manager will contact you via {formData.phone} shortly.
              </p>
              <button
                onClick={() => setInquirySubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[#bf953f] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <div>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs text-center">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adebayo Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +234 803 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. adebayo@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                >
                  <option>Birthday Celebration</option>
                  <option>Anniversary Dinner</option>
                  <option>Corporate Social</option>
                  <option>VIP Lounge Lockout</option>
                  <option>Other Gathering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Estimated Guest Count</label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                >
                  <option>10 - 20 Guests</option>
                  <option>20 - 50 Guests</option>
                  <option>50 - 100 Guests</option>
                  <option>100+ Guests (Full Venue)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">Additional Details & Special Requests</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your celebration, music preferences, or catering requests..."
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                ></textarea>
              </div>

              <div className="md:col-span-2 text-center">
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#bf953f] via-[#d4af37] to-[#aa771c] text-black font-bold text-base shadow-xl hover:shadow-[#bf953f]/40 hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Submit Event Enquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
        </div>

      </div>
    </section>
  );
}

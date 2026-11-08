import { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, CheckCircle2, Send, ShieldAlert, Mail, Shirt, Compass } from 'lucide-react';
import { BUSINESS_INFO } from '../data/mockData';
import { Reservation } from '../types';
import { createReservation } from '../lib/korogbaService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReservation: (res: Reservation) => void;
}

export default function ReservationModal({ isOpen, onClose, onAddReservation }: ReservationModalProps) {
  const [submittedRes, setSubmittedRes] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailSentStatus, setEmailSentStatus] = useState(true);
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 4,
    seatingArea: 'Outdoor Pergola Bar',
    specialRequests: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await createReservation(formData);

    if (res.success) {
      const newReservation: Reservation = {
        id: `REQ-${Date.now().toString().slice(-6)}`,
        guestName: formData.guestName,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        seatingArea: formData.seatingArea,
        specialRequests: formData.specialRequests || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      onAddReservation(newReservation);
      setSubmittedRes(newReservation);
      setEmailSentStatus(true);
    } else {
      setErrorMsg(
        res.error || 
        `We were unable to record your reservation request at this moment. Please call us directly at ${BUSINESS_INFO.phone} to reserve your table.`
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-[#bf953f]/40 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#bf953f] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRes ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 block mb-2">Request Received • Pending Review</span>
            <h3 className="font-cinzel text-2xl font-bold text-white mb-2">Table Reservation Request Saved</h3>
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
              Thank you, <strong className="text-white">{submittedRes.guestName}</strong>. Your table request for <strong className="text-white">{submittedRes.guests} guests</strong> at <strong className="text-[#bf953f]">{submittedRes.seatingArea}</strong> for <strong className="text-white">{submittedRes.date} at {submittedRes.time}</strong> has been successfully logged.
            </p>

            {/* Confirmation Email Dispatch Box */}
            {emailSentStatus && (
              <div className="mb-6 p-4 rounded-2xl bg-neutral-900/90 border border-[#bf953f]/40 text-left space-y-3 shadow-lg">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <Mail className="w-4 h-4 text-[#bf953f]" />
                  <span className="text-xs font-bold text-[#dfba73] uppercase tracking-wider">Confirmation Email Dispatched</span>
                  <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">Sent Successfully</span>
                </div>
                <p className="text-xs text-neutral-300">
                  A booking confirmation email has been dispatched to <strong className="text-white">{submittedRes.email || 'your email address'}</strong> containing your reference ID <span className="font-mono text-[#dfba73] font-bold">{submittedRes.id}</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#dfba73] font-semibold">
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Dress Code Policy</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-light">Smart casual to elegant evening wear. Athletic sportswear and slippers are not permitted.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#dfba73] font-semibold">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Location & Access</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] font-light">{BUSINESS_INFO.address}. Secure parking available on site.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 mb-6">
              <div className="text-amber-300 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Tables are subject to management approval. Our team will contact {submittedRes.phone} to confirm.</span>
              </div>
            </div>

            <button
              onClick={() => { setSubmittedRes(null); onClose(); }}
              className="px-8 py-3 rounded-full bg-[#bf953f] text-black font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer"
            >
              Return Back Home
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#dfba73] uppercase block mb-2">
                Table Reservation
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                Request a Royal Table
              </h3>
              <p className="text-neutral-300/80 text-xs sm:text-sm font-light mt-1">
                Submit your reservation request. A confirmation email with dress code and location details will be sent instantly.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Adeleke"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 903 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">Email Address (For Confirmation)</label>
                  <input
                    type="email"
                    required
                    placeholder="oluwaseun@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#bf953f]" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#bf953f]" /> Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#bf953f]" /> Guests
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
                    className="w-full px-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                  >
                    {[1,2,3,4,5,6,8,10,12,15,20].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#bf953f]" /> Seating Area Preference
                </label>
                <select
                  value={formData.seatingArea}
                  onChange={(e) => setFormData({...formData, seatingArea: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                >
                  <option>Outdoor Pergola Bar</option>
                  <option>Indoor Cocktail Lounge</option>
                  <option>Isheri Garden Terrace</option>
                  <option>Restaurant & Dining Room</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">Special Requests or Occasion</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Celebrating a birthday, bottle service preference..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                ></textarea>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#bf953f] via-[#d4af37] to-[#aa771c] text-black font-bold text-base shadow-xl hover:shadow-[#bf953f]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Sending Confirmation & Saving...' : 'Submit Reservation Request'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-full bg-neutral-900/80 border border-neutral-700/80 hover:border-[#bf953f]/50 text-neutral-300 hover:text-[#bf953f] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Return Back Home
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

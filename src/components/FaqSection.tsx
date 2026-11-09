import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/mockData';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is the dress code at KÓRÓGBÁ?',
      answer: 'We encourage smart casual to elegant evening wear. Athletic sportswear, slippers, or flip-flops are not permitted during evening lounge hours. Dress to impress for our royal atmosphere.'
    },
    {
      question: 'Do I need a table reservation in advance?',
      answer: 'While walk-ins are always welcome at our outdoor pergola bar and terrace, table reservations are strongly recommended for weekend nights, live Afrobeat events, and VIP lounge seating to guarantee immediate accommodation.'
    },
    {
      question: 'Is secure parking available on site?',
      answer: `Yes, we provide secure, well-lit parking within Royal Estate 2, Isheri-Igando Road, backed by dedicated security personnel to ensure your vehicle's safety throughout your visit.`
    },
    {
      question: 'What are your operating hours?',
      answer: 'We are open 24 hours on Monday, Tuesday, Wednesday, Friday, Saturday, and Sunday. Thursdays are closed for weekly venue maintenance and sanitation.'
    },
    {
      question: 'Are there age restrictions for entry?',
      answer: 'KÓRÓGBÁ operates as an adult dining and nightlife lounge. Evening bar and lounge entry is restricted to guests aged 18 and above. Valid identification may be requested.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all Nigerian debit cards (Mastercard, Visa, Verve), instant bank transfers, and cash payments for all dining, drinks, and shisha services.'
    },
    {
      question: 'Can I host a private birthday or corporate celebration?',
      answer: `Absolutely! You can submit a private event enquiry through our website or call our management directly at ${BUSINESS_INFO.phone} to arrange VIP table lockouts and custom packages.`
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#0a0a0e] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#dfba73]/30">
            <HelpCircle className="w-3.5 h-3.5 text-[#dfba73]" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[#dfba73] uppercase">
              Visitor Information
            </span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="gold-gradient font-poppins italic font-light">Questions</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
            Everything you need to know about visiting KÓRÓGBÁ Island Bar, Restaurant & Lounge.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-neutral-800/80 overflow-hidden transition-all duration-300 hover:border-[#dfba73]/40"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-cinzel font-bold text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#dfba73] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#dfba73]/15 border-[#dfba73]/40' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-neutral-300/90 text-sm font-light leading-relaxed border-t border-neutral-900 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

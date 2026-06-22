import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQProps {
  faqs: FAQItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  return (
    <section id="faq" className="py-24 bg-[#0b0b0b] text-white overflow-hidden relative border-b border-white/5">
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-[#E8401C]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full animate-fade-in-up">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#F5C518]">
              Giải Đáp Thắc Mắc
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 select-none">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="w-20 h-1 bg-[#E8401C] mx-auto mb-5 rounded-full"></div>
          <p className="text-white/60 text-sm sm:text-base font-normal">
            Tìm hiểu nhanh các thắc mắc cốt lõi nhất về dịch vụ, kịch bản sáng tạo và cam kết thực thi của chúng tôi.
          </p>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-3xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'bg-white/[0.06] border-[#E8401C]/30 shadow-lg shadow-[#E8401C]/5'
                    : 'bg-white/[0.01] border-white/10 hover:border-white/20'
                }`}
              >
                
                {/* Header click bar */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3.5">
                    <HelpCircle className={`w-5.5 h-5.5 shrink-0 transition-colors ${isOpen ? 'text-[#E8401C]' : 'text-white/40'}`} />
                    <span className="font-bold sm:text-base text-sm leading-snug pr-4 text-white">
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* Rotating Arrow Indicator */}
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white transition-all duration-300 ${isOpen ? 'rotate-180 bg-[#E8401C]/20 text-[#E8401C]' : ''}`}>
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  </div>
                </button>

                {/* Sliding content fold */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="p-6 text-white/70 text-xs sm:text-sm leading-relaxed bg-black/10 font-normal">
                    {faq.answer}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

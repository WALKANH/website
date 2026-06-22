import { Check, Sparkles } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingProps {
  plans: PricingPlan[];
  onSelectPlan: (planName: string) => void;
}

export default function Pricing({ plans, onSelectPlan }: PricingProps) {
  return (
    <section id="pricing" className="py-24 bg-[#111111] relative border-b border-white/5 overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#E8401C]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#E8401C] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#E8401C]">
              Báo Giá Trọng Gói
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Bảng Giá Dịch Vụ Phân Khúc Cạnh Tranh
          </h2>
          <div className="w-20 h-1 bg-[#E8401C] mx-auto mb-5 rounded-full"></div>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Phù hợp với mọi quy định ngân sách marketing của doanh nghiệp vừa, nhỏ (KOC) và cả tập đoàn lớn (KOL).
          </p>
        </div>

        {/* Pricing Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                plan.isPopular
                  ? 'bg-gradient-to-br from-[#E8401C] to-[#911f0a] text-white shadow-[0_0_30px_rgba(232,64,28,0.4)] scale-105 border-2 border-white/25 z-10 hover:scale-[1.07]'
                  : 'bg-white/[0.03] text-white border border-white/10 h-full hover:scale-[1.02] shadow-2xl'
              }`}
            >
              {/* Featured Tag */}
              {plan.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#F5C518] text-black py-1 px-4.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  Phổ biến nhất
                </div>
              )}

              <div>
                <h3 className="text-xl font-extrabold mb-2 text-white">
                  {plan.name}
                </h3>
                <p className={`text-xs leading-normal mb-8 max-w-[280px] font-medium ${plan.isPopular ? 'text-white/70' : 'text-white/50'}`}>
                  {plan.description}
                </p>

                {/* Price tag */}
                <div className="mb-8 flex items-baseline gap-1.5">
                  <span className="text-[14px] font-bold text-white/80">VNĐ</span>
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight ${plan.isPopular ? 'text-white' : 'text-[#F5C518]'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-xs font-semibold ${plan.isPopular ? 'text-white/70' : 'text-white/50'}`}>
                    / {plan.period}
                  </span>
                </div>

                {/* Features list */}
                <div className={`border-t pt-7 mb-8 ${plan.isPopular ? 'border-white/10' : 'border-white/5'}`}>
                  <span className="text-xs font-extrabold uppercase tracking-widest block mb-4 text-white/80">
                    Quyền Lợi Gói:
                  </span>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-xs sm:text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.isPopular ? 'bg-white/10 text-white' : 'bg-[#E8401C]/10 text-[#E8401C]'}`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={plan.isPopular ? 'text-white/90' : 'text-white/80'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button CTA */}
              <button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-3.5 px-6 rounded-xl text-sm font-extrabold transition-all duration-300 cursor-pointer text-center ${
                  plan.isPopular
                    ? 'bg-white text-[#911f0a] hover:bg-[#F5C518] hover:text-black hover:shadow-xl active:scale-95'
                    : 'bg-white/5 border border-white/10 hover:bg-[#E8401C] hover:border-transparent text-white hover:shadow-lg hover:shadow-[#E8401C]/25 active:scale-95'
                }`}
              >
                Đặt Lịch Gói Này
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

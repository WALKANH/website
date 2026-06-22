import { ArrowRight, Users, Sparkles, Award, Smile } from 'lucide-react';

interface HeroProps {
  onScrollToContact: () => void;
  onScrollToPortfolio: () => void;
}

export default function Hero({ onScrollToContact, onScrollToPortfolio }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#0b0b0b] flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            
            <div className="inline-flex self-center lg:self-start items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#F5C518]">
                Media & Influencer Marketing Agent TP.HCM
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-white mb-8 text-center lg:text-left">
              Kết Nối<br />
              <span className="text-[#E8401C]">Thương Hiệu</span><br />
              Triệu Khán Giả
            </h1>

            <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-normal">
              TieuSong Media (TS Media) mang đến giải pháp booking KOL/KOC và sản xuất nội dung sáng tạo đột phá, giúp doanh nghiệp bùng nổ tương tác tại thị trường Việt Nam.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <button
                id="hero-contact-cta"
                onClick={onScrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#E8401C] hover:bg-white hover:text-[#111111] text-white font-bold rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-[#E8401C]/30 cursor-pointer text-sm"
              >
                Nhận Tư Vấn Ngay
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" />
              </button>
              
              <button
                id="hero-portfolio-cta"
                onClick={onScrollToPortfolio}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all duration-300 hover:scale-[1.03] cursor-pointer text-sm"
              >
                Xem Portfolio
              </button>
            </div>

          </div>

          {/* Hero Right Visual Column - Floating Stat Badges */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[450px] flex items-center justify-center">
            
            {/* Visual Center Circle Emblem */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/10 flex items-center justify-center bg-gradient-to-tr from-brand-red/5 to-white/[0.02] shadow-inner">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-brand-red/20 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-black rounded-full border-2 border-brand-red flex items-center justify-center font-black text-4xl sm:text-5xl tracking-tighter shadow-2xl shadow-brand-red/45">
                  <span className="text-white">T</span>
                  <span className="text-brand-gold">S</span>
                </div>
              </div>

              {/* Orbital line details */}
              <div className="absolute w-full h-full border border-dashed border-white/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
            </div>

            {/* Stat Badge 1: KOL List (Floating Top-Left) */}
            <div className="absolute top-4 left-4 sm:top-10 sm:left-6 bg-[#161616]/90 border border-white/10 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl hover:-translate-y-2.5 transition-transform duration-300 max-w-[190px]">
              <div className="w-10 h-10 rounded-xl bg-brand-red/15 flex items-center justify-center text-brand-red shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-lg leading-tight">200+</span>
                <span className="text-gray-400 font-medium text-[11px] uppercase tracking-wide">KOLs & KOCs</span>
              </div>
            </div>

            {/* Stat Badge 2: Campaigns (Floating Bottom-Right) */}
            <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-6 bg-[#161616]/90 border border-white/10 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl hover:-translate-y-2.5 transition-transform duration-300 max-w-[210px]">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-lg leading-tight">500+</span>
                <span className="text-gray-400 font-medium text-[11px] uppercase tracking-wide">Dự Án Thành Công</span>
              </div>
            </div>

            {/* Stat Badge 3: Satisfaction (Floating Top-Right/Center) */}
            <div className="absolute top-1/4 right-0 sm:top-1/3 bg-[#161616]/90 border border-white/10 p-3.5 rounded-2xl flex items-center gap-3 shadow-xl hover:-translate-y-2.5 transition-transform duration-300">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Smile className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base leading-tight">98%</span>
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Hài Lòng</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

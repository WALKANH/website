import { useState } from 'react';
import { Eye, Heart, BarChart } from 'lucide-react';
import { Campaign } from '../types';

interface PortfolioProps {
  campaigns: Campaign[];
}

export default function Portfolio({ campaigns }: PortfolioProps) {
  const [filter, setFilter] = useState<'All' | 'KOL' | 'TVC' | 'Lookbook' | 'Seeding'>('All');

  const categories = [
    { label: 'Tất cả', value: 'All' },
    { label: 'Booking KOL/KOC', value: 'KOL' },
    { label: 'Sản xuất TVC', value: 'TVC' },
    { label: 'Chụp Lookbook', value: 'Lookbook' },
    { label: 'Seeding & Phủ sóng', value: 'Seeding' },
  ];

  const filteredCampaigns = filter === 'All'
    ? campaigns
    : campaigns.filter(c => c.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-[#0b0b0b] text-white overflow-hidden relative border-t border-b border-white/5">
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F5C518]/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#E8401C] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#E8401C]">
              Dự Án Đã Triển Khai
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Chiêm Ngưỡng Portfolio Sáng Tạo
          </h2>
          <div className="w-20 h-1 bg-[#E8401C] mx-auto mb-5 rounded-full"></div>
          <p className="text-white/60 text-base max-w-2xl mx-auto font-normal">
            Những ý tưởng táo bạo kết tinh từ tư duy vượt trội, hiện thực hóa các chiến dịch truyền thông bùng nổ của chúng tôi.
          </p>
        </div>

        {/* Categories Filtler Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value as any)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                filter === cat.value
                  ? 'bg-[#E8401C] text-white shadow-lg shadow-[#E8401C]/30'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group relative bg-[#161616] rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-[#E8401C]/40 transition-all duration-500 h-[380px]"
            >
              {/* Campaign background image */}
              <img
                src={campaign.image}
                alt={campaign.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70"
              />

              {/* Backdrop Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-all duration-300"></div>

              {/* Absolute label category */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#E8401C] text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-md tracking-wider shadow">
                  {campaign.category}
                </span>
              </div>

              {/* Bottom detail text - animates upwards on hover */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 transition-all duration-300">
                <span className="text-[#F5C518] font-bold text-[10px] tracking-wider uppercase mb-1.5 block">
                  {campaign.client}
                </span>
                
                <h3 className="text-white text-lg font-bold leading-snug group-hover:text-[#E8401C] transition-colors duration-200 mb-4">
                  {campaign.title}
                </h3>

                {/* Statistics panel - smooth sliding up */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-white/50 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-white font-extrabold text-xs">{campaign.reach}</span>
                      <span className="text-white/40 text-[9px] uppercase tracking-wide">Số Tiếp Cận</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-white/50 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-white font-extrabold text-xs">{campaign.engagement}</span>
                      <span className="text-white/40 text-[9px] uppercase tracking-wide">Tương Tác</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow Outline Border (hover effect) */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E8401C] rounded-3xl transition-all duration-300 pointer-events-none"></div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

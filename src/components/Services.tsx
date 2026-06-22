import { MessageSquare, Video, Camera, Share2, PenTool, Check, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
  onScrollToContact: () => void;
}

export default function Services({ services, onScrollToContact }: ServicesProps) {
  // Safe mapping of icon name to Lucide Icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-brand-red" />;
      case 'Video':
        return <Video className="w-6 h-6 text-brand-red" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-brand-red" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-brand-red" />;
      case 'PenTool':
        return <PenTool className="w-6 h-6 text-brand-red" />;
      default:
        return <MessageSquare className="w-6 h-6 text-brand-red" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#111111] text-white relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E8401C]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in-up">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#F5C518]">
              Dịch Vụ Chiến Lược
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Giải Pháp Đột Phá Truyền Thông Số
          </h2>
          <div className="w-20 h-1 bg-[#E8401C] mx-auto mb-5 rounded-full"></div>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-normal">
            Chúng tôi cung cấp hệ thống dịch vụ 360 độ từ đo lường hiệu quả đến sản xuất trực tiếp, giúp doanh nghiệp thiết lập vị thế dẫn đầu thị trường.
          </p>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-[#E8401C]/50 hover:bg-white/[0.06] shadow-2xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between ${
                index === 3 || index === 4 ? 'lg:col-span-1' : ''
              }`}
            >
              <div>
                {/* Custom Icon Wrapper with Hover Animation */}
                <div className="w-14 h-14 bg-[#E8401C]/20 border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E8401C] transition-colors duration-300">
                  <div className="group-hover:scale-110 group-hover:text-white transition-transform duration-300">
                    {getIconComponent(service.icon)}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#E8401C] transition-colors duration-300 mb-3 flex items-center gap-2">
                  {service.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>

                {/* Bullets List */}
                <div className="border-t border-white/5 pt-5 mt-5">
                  <span className="text-white font-bold text-xs uppercase tracking-wider mb-3 block">
                    Danh mục thực hiện:
                  </span>
                  <ul className="space-y-2.5">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-white/70 text-xs">
                        <Check className="w-4 h-4 text-[#F5C518] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Trigger Link */}
              <div className="mt-8 pt-4 border-t border-white/5">
                <button
                  onClick={onScrollToContact}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8401C] hover:text-white group-hover:gap-2.5 transition-all duration-200 cursor-pointer"
                >
                  Nhận tư vấn ngay
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

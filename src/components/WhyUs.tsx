import { Users, Award, TrendingUp, Smile, CheckCircle } from 'lucide-react';
import { TrustPoint } from '../types';

interface WhyUsProps {
  points: TrustPoint[];
}

export default function WhyUs({ points }: WhyUsProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Users':
        return <Users className="w-8 h-8 text-brand-gold" />;
      case 'Award':
        return <Award className="w-8 h-8 text-brand-gold" />;
      case 'TrendingUp':
        return <TrendingUp className="w-8 h-8 text-brand-gold" />;
      case 'Smile':
        return <Smile className="w-8 h-8 text-brand-gold" />;
      default:
        return <CheckCircle className="w-8 h-8 text-brand-gold" />;
    }
  };

  return (
    <section id="why-us" className="py-24 bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Why Us Left Copy */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#F5C518]">
                Tại Sao Chọn Chúng Tôi
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6 text-center lg:text-left">
              Định Hình Sự Khác Biệt Bằng Chất Lượng Chiến Dịch
            </h2>
            <div className="w-20 h-1 bg-[#E8401C] mx-auto lg:mx-0 mb-6 rounded-full"></div>
            
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 font-normal text-center lg:text-left">
              TS Media không chỉ đơn thuần là phân phối thông tin, chúng tôi là kiến trúc sư xây dựng kế hoạch bùng nổ thương hiệu. Chúng tôi cam kết hành trình cộng tác rõ ràng từ cam kết KPI đến đồng hành kiểm soát kịch bản chặt chẽ.
            </p>

            <div className="space-y-4 text-left hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E8401C] flex items-center justify-center text-white font-bold text-xs">✓</div>
                <span className="text-white/80 font-medium text-sm">Cam kết KPI thật bằng hợp đồng pháp lý</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E8401C] flex items-center justify-center text-white font-bold text-xs">✓</div>
                <span className="text-white/80 font-medium text-sm">Hỗ trợ nhanh, làm kịch bản chuyên sâu</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E8401C] flex items-center justify-center text-white font-bold text-xs">✓</div>
                <span className="text-white/80 font-medium text-sm">Ekip trang bị phòng quay chuẩn quốc tế</span>
              </div>
            </div>
          </div>

          {/* Why Us Right Statistics Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {points.map((point) => (
              <div
                key={point.id}
                className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:border-[#E13F1D]/40 hover:bg-white/[0.05] shadow-2xl transition-all duration-300 group hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center mb-5 group-hover:bg-[#F5C518] transition-colors duration-300">
                  <span className="group-hover:scale-105 transition-transform">
                    {getIcon(point.iconName)}
                  </span>
                </div>

                <div className="font-extrabold text-3xl sm:text-4xl text-[#F5C518] mb-2 group-hover:text-white transition-colors duration-300">
                  {point.stat}
                </div>

                <h3 className="font-bold text-base text-white mb-2">
                  {point.title}
                </h3>

                <p className="text-white/60 text-xs leading-relaxed font-normal">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

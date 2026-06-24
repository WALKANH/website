import { MouseEvent } from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-[#080808] text-white/50 border-t border-white/5 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          
          {/* Footer Logo & Slogan (4 columns) */}
          <div className="lg:col-span-4 text-left">
            <div className="flex items-center space-x-3 mb-5">
              <div className="relative w-11 h-11 bg-black rounded-lg border-2 border-[#E8401C] flex items-center justify-center font-extrabold text-xl tracking-tighter shadow-md shadow-[#E8401C]/20">
                <span className="text-white">T</span>
                <span className="text-[#F5C518]">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight uppercase tracking-wide">
                  TieuSong
                </span>
                <span className="text-[#F5C518] font-mono text-[10px] tracking-widest uppercase">
                  Media & Services
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/40 leading-relaxed mb-6 max-w-sm font-normal">
              TieuSong Media (TS Media) - Đơn vị tiên phong nâng cánh thương hiệu Việt tỏa sáng trên trường số hóa thông qua các giải pháp booking KOL/KOC bùng nổ của chúng tôi.
            </p>

            {/* Social channels lists */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#E8401C] hover:bg-white/10 hover:border-[#E8401C] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 shrink-0" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#E8401C] hover:bg-white/10 hover:border-[#E8401C] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 shrink-0" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#E8401C] hover:bg-[#ff0000]/10 hover:border-[#ff0000] transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 shrink-0" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#E8401C] hover:bg-white/10 hover:border-[#E8401C] transition-all duration-300 group"
                aria-label="TikTok"
              >
                {/* Custom SVG for TikTok */}
                <svg
                  className="w-4 h-4 fill-current text-gray-300 group-hover:text-[#E8401C]"
                  viewBox="0 0 448 512"
                >
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.13c8.89,0,17.14,1.13,25.33,3.13v81.1c-8.19-2.02-16.44-3.12-25.33-3.12a81.44,81.44,0,1,0,81.43,81.44V0h81.39a110,110,0,0,0,110,110v99.91Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column (3 columns) */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-white transition-colors block"
                >
                  Dịch vụ truyền thông
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  onClick={(e) => handleLinkClick(e, 'portfolio')}
                  className="hover:text-white transition-colors block"
                >
                  Dấu ấn Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  onClick={(e) => handleLinkClick(e, 'process')}
                  className="hover:text-white transition-colors block"
                >
                  Quy trình hợp tác
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleLinkClick(e, 'pricing')}
                  className="hover:text-white transition-colors block"
                >
                  Báo giá gói cước
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleLinkClick(e, 'faq')}
                  className="hover:text-white transition-colors block"
                >
                  Giải đáp FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Location Column (5 columns) */}
          <div className="lg:col-span-5 text-left">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5">
              Thông Tin Liên Hệ
            </h4>
            
            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E8401C] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  VP : Lầu 3, 538/185 Đoàn Văn Bơ, phường Khánh Hội, Ho Chi Minh City, Vietnam
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#E8401C] shrink-0" />
                <span>
                  Đường dây nóng: <a href="tel:0901234567" className="text-white font-bold hover:text-[#E8401C]">0901 234 567</a>
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E8401C] shrink-0" />
                <span>
                  Thư điện tử: <a href="mailto:contact@tieusongmedia.vn" className="text-white font-bold hover:text-[#E8401C]">contact@tieusongmedia.vn</a>
                </span>
              </li>
            </ul>

            {/* Mini Map representation block */}
            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
              <div className="flex flex-col text-left">
                <span className="text-white font-semibold text-xs leading-normal">
                  Văn Phòng TP.HCM
                </span>
                <span className="text-[10px] text-white/50 font-medium">
                  Mở cửa: 8:00 - 18:00 (Thứ 2 - Thứ Bảy)
                </span>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#E8401C]/15 text-[#E8401C] hover:bg-[#E8401C] hover:text-white text-xs font-bold rounded-lg transition-all duration-300 flex items-center gap-1 cursor-pointer"
              >
                Chỉ Đường
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Base Details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <p>© {currentYear} TieuSong Media & Services. Bảo lưu mọi quyền.</p>
          <div className="flex items-center space-x-6">
            <a href="#navbar" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            <a href="#navbar" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

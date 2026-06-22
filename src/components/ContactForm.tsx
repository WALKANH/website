import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle, Sparkles, X, Clock } from 'lucide-react';

interface ContactFormProps {
  preselectedPlan: string;
}

export default function ContactForm({ preselectedPlan }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Booking KOL/KOC',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Synchronize dropdown when plan selected out of pricing cards
  useEffect(() => {
    if (preselectedPlan) {
      setFormData(prev => ({
        ...prev,
        service: preselectedPlan
      }));
    }
  }, [preselectedPlan]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return;
    }

    setIsLoading(true);

    // Simulate reliable API integration with agency backend
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      // Reset details but maintain default dropdown
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Booking KOL/KOC',
        message: ''
      });
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 bg-[#0b0b0b] relative text-white overflow-hidden border-t border-b border-white/5">
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-[#E8401C]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Toast success notification */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-[100] bg-[#111] border border-[#E8401C] rounded-2xl p-5 shadow-2xl max-w-sm sm:max-w-md w-full animate-fade-in-up flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 shrink-0" />
            </div>
            
            <div className="flex-1 text-left">
              <h4 className="text-white font-extrabold text-sm mb-1">
                Gửi Thông Tin Thành Công!
              </h4>
              <p className="text-white/60 text-xs leading-normal">
                Cảm ơn bạn, dữ liệu đã gửi tới TS Media. Chuyên viên sẽ trực tiếp liên hệ lại với bạn trong vòng 2 giờ tới!
              </p>
            </div>

            <button
              onClick={() => setShowToast(false)}
              className="text-white/40 hover:text-white shrink-0 p-1 cursor-pointer"
              aria-label="Dismiss Alert"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Details Column - Left */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse"></span>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#F5C518]">
                  Liên Hệ Hợp Tác
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight text-center lg:text-left">
                Khởi Động Chiến Dịch Bùng Nổ Ngay
              </h2>
              <div className="w-20 h-1 bg-[#E8401C] mx-auto lg:mx-0 mb-6 rounded-full"></div>
              
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 text-center lg:text-left">
                Bạn đã sẵn sàng vượt mặt các đối thủ cạnh tranh? Điền thông tin vào phiếu kế hoạch bên cạnh để nhận báo cáo phân tích đối thủ chi phí & đề xuất KOL hoàn toàn miễn phí từ các chuyên gia tư vấn hàng đầu.
              </p>
            </div>

            {/* Direct Contacts List */}
            <div className="space-y-6 my-8">
              <div className="flex items-center gap-4.5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8401C] shadow-inner">
                  <Phone className="w-5 h-5 shrink-0" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[#a0a0a0] text-[10px] uppercase font-bold tracking-widest">
                    Đường dây nóng 24/7
                  </span>
                  <a href="tel:0901234567" className="font-extrabold text-base text-white hover:text-[#E8401C] transition-colors">
                    0901 234 567
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4.5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8401C] shadow-inner">
                  <Mail className="w-5 h-5 shrink-0" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[#a0a0a0] text-[10px] uppercase font-bold tracking-widest">
                    Hòm thư điện tử
                  </span>
                  <a href="mailto:contact@tieusongmedia.vn" className="font-extrabold text-base text-white hover:text-[#E8401C] transition-colors">
                    contact@tieusongmedia.vn
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4.5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8401C] shadow-inner">
                  <MapPin className="w-5 h-5 shrink-0" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[#a0a0a0] text-[10px] uppercase font-bold tracking-widest">
                    Địa chỉ Văn Phòng
                  </span>
                  <span className="font-extrabold text-sm text-white leading-tight">
                    Tầng 12, Toà Nhà Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh
                  </span>
                </div>
              </div>
            </div>

            {/* Timing notice badge */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4.5 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs text-white/60 leading-snug text-left">
                Thời gian phản hồi cam kết: <strong className="text-white">Dưới 2 giờ</strong> từ lúc tiếp nhận thông tin (Giờ hành chính TP.HCM).
              </span>
            </div>

          </div>

          {/* Booking Contact Form Card - Right */}
          <div className="lg:col-span-7 bg-white/[0.03] p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Họ và Tên <span className="text-[#E8401C]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#1e1e1e] text-white border border-white/15 hover:border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-[#252525]/80 focus:outline-none focus:ring-2 focus:ring-[#E8401C]/40 focus:border-[#E8401C] transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Số Điện Thoại <span className="text-[#E8401C]">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                    className="w-full bg-[#1e1e1e] text-white border border-white/15 hover:border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-[#252525]/80 focus:outline-none focus:ring-2 focus:ring-[#E8401C]/40 focus:border-[#E8401C] transition-all"
                  />
                </div>

              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Địa chỉ Email Doanh Nghiệp
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-[#1e1e1e] text-white border border-white/15 hover:border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-[#252525]/80 focus:outline-none focus:ring-2 focus:ring-[#E8401C]/40 focus:border-[#E8401C] transition-all"
                />
              </div>

              {/* Service interested drop-down */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="service" className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Dịch Vụ / Gói Quan Tâm
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-[#1e1e1e] text-white border border-white/15 hover:border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-[#252525]/80 focus:outline-none focus:ring-2 focus:ring-[#E8401C]/40 focus:border-[#E8401C] transition-all"
                >
                  <option value="Booking KOL/KOC">Booking KOL/KOC</option>
                  <option value="Sản xuất TVC & Video">Sản xuất TVC & Video</option>
                  <option value="Chụp ảnh Lookbook">Chụp ảnh Lookbook</option>
                  <option value="Seeding Đa Nền Tảng">Seeding Đa Nền Tảng</option>
                  <option value="Sáng Tạo Content Đa Kênh">Sáng Tạo Content Đa Kênh</option>
                  <option value="Gói Thử Nghiệm (Basic)">Gói Thử Nghiệm (Basic)</option>
                  <option value="Gói Phủ Sóng (Standard)">Gói Phủ Sóng (Standard)</option>
                  <option value="Gói Đột Phá (Premium)">Gói Đột Phá (Premium)</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="message" className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                  Mô Tả Nhu Cầu Hoặc Kênh Kinh Doanh/Sản Phẩm
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ghi chú về phân khúc sản phẩm, kế hoạch chiến dịch hoặc ngân sách dự tính..."
                  className="w-full bg-[#1e1e1e] text-white border border-white/15 hover:border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-[#252525]/80 focus:outline-none focus:ring-2 focus:ring-[#E8401C]/40 focus:border-[#E8401C] transition-all"
                />
              </div>

              {/* Submit triggers Loader */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center py-4 px-6 bg-[#E8401C] hover:bg-white hover:text-black border border-transparent text-white font-extrabold rounded-full text-base shadow-xl shadow-[#E8401C]/25 transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-95 text-center leading-normal hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang Gửi Dữ Liệu...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Đăng Ký Tư Vấn Ngay
                  </div>
                )}
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}

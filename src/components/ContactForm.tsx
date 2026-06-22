import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle, Sparkles, X, Clock, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import { saveLeadToFirestore, auth, fetchUserLeads, logoutUser, isAdmin } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthModal from './AuthModal';

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

  // Client states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLeads, setUserLeads] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Track the most recently submitted lead in local state
  const [submittedLead, setSubmittedLead] = useState<{
    id: string;
    name: string;
    phone: string;
    email: string;
    service: string;
    message: string;
    timestamp: string;
  } | null>(null);

  // Monitor auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Pre-fill user profile fields
        setFormData(prev => ({
          ...prev,
          name: user.displayName || prev.name,
          email: user.email || prev.email
        }));
        // Retrieve past bookings
        loadCustomerHistory(user.email || '');
      } else {
        setUserLeads([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadCustomerHistory = async (email: string) => {
    if (!email) return;
    setIsLoadingHistory(true);
    try {
      const history = await fetchUserLeads(email);
      setUserLeads(history);
    } catch (err) {
      console.error('Không thể tải lịch sử đăng ký của khách hàng:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return;
    }

    setIsLoading(true);

    try {
      const docId = await saveLeadToFirestore({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        message: formData.message,
      });

      const currentTimestamp = new Date().toISOString();

      setSubmittedLead({
        id: docId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        message: formData.message,
        timestamp: currentTimestamp
      });

      if (formData.email) {
        loadCustomerHistory(formData.email);
      }

      setShowToast(true);
      // Reset details but maintain user identity and default service
      setFormData(prev => ({
        name: currentUser?.displayName || '',
        phone: '',
        email: currentUser?.email || '',
        service: 'Booking KOL/KOC',
        message: ''
      }));
    } catch (err) {
      console.error('Lỗi lưu thông tin liên hệ:', err);
    } finally {
      setIsLoading(false);
    }
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
            
            {/* Customer/Admin Session Dashboard Welcome bar */}
            <div className={`flex items-center justify-between mb-6 p-4 rounded-2xl relative z-10 ${
              currentUser && isAdmin(currentUser.email) 
                ? 'bg-[#F5C518]/5 border border-[#F5C518]/25 shadow-[0_0_15px_rgba(245,197,24,0.05)]' 
                : 'bg-white/[0.02] border border-white/5'
            }`}>
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs uppercase ${
                      isAdmin(currentUser.email)
                        ? 'bg-[#F5C518]/20 border-[#F5C518]/30 text-[#F5C518]'
                        : 'bg-[#E8401C]/20 border-[#E8401C]/30 text-[#E8401C]'
                    }`}>
                      {currentUser.displayName ? currentUser.displayName[0] : <UserIcon className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <p className={`text-[9px] uppercase font-bold tracking-wider ${isAdmin(currentUser.email) ? 'text-[#F5C518]' : 'text-white/40'}`}>
                        {isAdmin(currentUser.email) ? '🔑 Tài khoản Quản trị viên' : 'Tài khoản khách hàng'}
                      </p>
                      <p className="text-xs font-black text-white">{currentUser.displayName || currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => logoutUser()}
                    className="inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 transition-all font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="text-left">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-[#E8401C]" />
                      Hợp tác tư vấn dự án
                    </h4>
                    <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">Đặt lịch hoặc Đăng nhập thành viên để tự động lưu và theo dõi tiến độ tư doanh nghiệp.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-[#F5C518]/10 hover:bg-[#F5C518]/25 border border-[#F5C518]/30 text-[#F5C518] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Đăng Nhập / Đăng Ký
                  </button>
                </div>
              )}
            </div>

            {submittedLead ? (
              <div className="space-y-6 relative z-10 text-left animate-in fade-in slide-in-from-bottom-5 duration-300">
                {/* Header Status */}
                <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      Gửi Thành Công!
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-green-500 text-black uppercase tracking-widest animate-pulse">
                        ONLINE
                      </span>
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Thông tin yêu cầu tư vấn đã được hệ thống mã hóa và tiếp nhận trực tiếp từ trình duyệt của bạn!
                    </p>
                  </div>
                </div>

                {/* Secure Routing Log */}
                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-[10px] uppercase font-black text-[#E8401C] tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8401C]" />
                      Nhật ký điểm đến quốc tế (Secure Destination Logs)
                    </span>
                    <span className="text-[9px] font-mono text-white/50">v1.2 - live</span>
                  </div>
                  
                  <div className="space-y-2 text-xs font-mono text-white/70">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/40">Cơ sở dữ liệu đám mây:</span>
                      <span className="text-white font-bold bg-[#E8401C]/10 px-2 py-0.5 rounded border border-[#E8401C]/30 text-[10.5px]">Google Cloud Firestore</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/40">Bộ sưu tập đích:</span>
                      <span className="text-white font-bold">/leads</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-white/40">Mã liên hệ (Document ID):</span>
                      <span className="text-[#F5C518] font-bold break-all select-all bg-white/5 px-1.5 py-0.5 rounded border border-white/5 transition-all">{submittedLead.id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/40">Thời điểm lưu:</span>
                      <span className="text-white">{new Date(submittedLead.timestamp).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/40">Trạng thái đồng bộ:</span>
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                        Auto-Sync Google Sheets Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* Display Submitted Details */}
                <div className="border border-white/10 bg-white/[0.01] rounded-2xl p-4 space-y-3">
                  <h5 className="text-[10px] uppercase font-black text-white/40 tracking-wider">Thông tin đã cung cấp (Client Payload)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div>
                      <p className="text-white/40 text-[9px] uppercase font-bold">👤 Họ và tên khách</p>
                      <p className="text-white font-extrabold mt-0.5">{submittedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] uppercase font-bold">📞 Số điện thoại</p>
                      <p className="text-white font-extrabold mt-0.5">{submittedLead.phone}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] uppercase font-bold">✉️ Địa chỉ email</p>
                      <p className="text-white font-semibold mt-0.5">{submittedLead.email || '(Không cung cấp)'}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] uppercase font-bold">🏷️ Gói dịch vụ đăng ký</p>
                      <p className="text-[#E8401C] font-black mt-0.5">{submittedLead.service}</p>
                    </div>
                  </div>
                  {submittedLead.message && (
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-white/40 text-[9px] uppercase font-bold mb-1">💬 Ghi chú đính kèm</p>
                      <p className="text-white/80 italic text-xs leading-relaxed bg-white/5 p-2.5 border border-white/5 rounded-xl">"{submittedLead.message}"</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-left">
                  <p className="text-[11px] text-amber-500 leading-relaxed font-semibold">
                    💡 <strong>Lưu ý cho Admin/Sếp:</strong> Sếp có thể lăn xuống cuối trang, click nút <strong>"Mở Bảng Admin"</strong> để theo dõi, quản trị hoặc tải tài liệu Excel/Đồng bộ trực tiếp tệp leads này lên Google Sheets!
                  </p>
                </div>

                {/* User Options */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setSubmittedLead(null)}
                    type="button"
                    className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                  >
                    Tạo phiếu yêu cầu khác
                  </button>
                  {(!currentUser || !isAdmin(currentUser.email)) && (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      type="button"
                      className="flex-1 py-3 px-6 bg-[#E8401C] hover:bg-[#ff512d] text-white font-black rounded-full text-xs uppercase tracking-wider transition-all text-center cursor-pointer shadow-lg shadow-[#E8401C]/25"
                    >
                      Đăng Nhập Quản Lý
                    </button>
                  )}
                </div>
              </div>
            ) : (
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
                    className="w-full bg-[#1e1e1e] text-white border border-[#141414] hover:border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-[#252525]/80 focus:outline-none focus:ring-2 focus:ring-[#E8401C]/40 focus:border-[#E8401C] transition-all"
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
                      <Send className="w-5 h-5 animate-pulse" />
                      Đăng Ký Tư Vấn Ngay
                    </div>
                  )}
                </button>

                {/* Secure Footnote badging */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/45">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>Dữ liệu lưu trữ bảo mật bằng Cloud Firestore Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" />
                    <span>Đồng bộ tự động với Google Sheets của Agency</span>
                  </div>
                </div>

                {/* Customer Online Logs Timeline inside client box */}
                {currentUser && isAdmin(currentUser.email) ? (
                  <div className="mt-8 pt-6 border-t border-amber-500/20 space-y-3">
                    <div className="p-4 bg-[#F5C518]/5 border border-[#F5C518]/20 rounded-2xl text-left space-y-2">
                      <p className="text-xs font-black text-[#F5C518] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F5C518]" />
                        Báo cáo nội bộ TS Media
                      </p>
                      <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                        Chào sếp! Hiện tại sếp đang đăng nhập bằng tài khoản <strong className="text-white">Quản trị viên</strong>. Hệ thống tự động kích hoạt bảng thống kê chi tiết, kiểm tra dữ liệu khách hàng đăng ký và bảng tích hợp Google Sheets thời gian thực ngay bên dưới thanh footer của website này.
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-[10px] text-amber-500/80 font-bold">
                        <span>Kéo xuống cuối trang để mở Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ) : currentUser && userLeads.length > 0 ? (
                  <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Lịch sử yêu cầu tư vấn đã lưu ({userLeads.length})
                      </h4>
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Thời gian thực</span>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {userLeads.map((lead, idx) => (
                        <div key={lead.id || idx} className="p-3.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl transition-all flex items-center justify-between gap-3 text-xs">
                          <div className="text-left space-y-1">
                            <p className="font-extrabold text-white text-xs">{lead.service}</p>
                            <p className="text-[10px] text-white/45 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#E8401C]" />
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN') : 'Mới'}
                            </p>
                            {lead.message && (
                              <p className="text-[10px] text-white/30 italic truncate max-w-[250px]">
                                "{lead.message}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/15 text-[9px] font-black uppercase tracking-wider">
                              Đã Tiếp Nhận
                            </span>
                            <span className="text-[10px] text-[#F5C518] font-bold">Sales đang xử lý</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

              </form>
            )}

          </div>

        </div>

      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => {
          setCurrentUser(user);
          if (user.email) {
            loadCustomerHistory(user.email);
          }
        }} 
      />
    </section>
  );
}

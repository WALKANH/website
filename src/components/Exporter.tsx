import { useState } from 'react';
import { Download, Sparkles, Check, Heart } from 'lucide-react';

export default function Exporter() {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);

    // Full featured standalone HTML file text
    const standaloneHTML = `<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TieuSong Media & Services - TS Media Agency</title>
  
  <!-- Font Configuration -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Be Vietnam Pro"', 'sans-serif'],
          },
          colors: {
            brand: {
              red: '#E8401C',
              gold: '#F5C518',
              dark: '#111111',
              card: '#181818'
            }
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Be Vietnam Pro', sans-serif;
      background-color: #ffffff;
      color: #333333;
    }
    .custom-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #111111;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #e8401c;
      border-radius: 3px;
    }
    /* Section observer fade effect */
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body class="custom-scroll overflow-x-hidden">

  <!-- ================= SECTION 1: NAVBAR ================= -->
  <nav id="navbar" class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent py-5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        
        <!-- Logo -->
        <a href="#hero" class="flex items-center space-x-3 group">
          <div class="relative w-11 h-11 bg-black rounded-lg border-2 border-brand-red flex items-center justify-center font-extrabold text-xl tracking-tighter shadow-md">
            <span class="text-white">T</span>
            <span class="text-brand-gold">S</span>
          </div>
          <div class="flex flex-col">
            <span class="text-white font-bold text-lg leading-tight uppercase tracking-wide group-hover:text-brand-red transition-colors">
              TieuSong
            </span>
            <span class="text-gray-400 font-mono text-[9px] tracking-widest uppercase">
              Media & Services
            </span>
          </div>
        </a>

        <!-- Links Desktop -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#services" class="nav-link font-medium text-sm tracking-wide text-gray-300 hover:text-white transition-colors">Dịch vụ</a>
          <a href="#portfolio" class="nav-link font-medium text-sm tracking-wide text-gray-300 hover:text-white transition-colors">Portfolio</a>
          <a href="#process" class="nav-link font-medium text-sm tracking-wide text-gray-300 hover:text-white transition-colors">Quy trình</a>
          <a href="#pricing" class="nav-link font-medium text-sm tracking-wide text-gray-300 hover:text-white transition-colors">Bảng giá</a>
          <a href="#contact" class="nav-link font-medium text-sm tracking-wide text-gray-300 hover:text-white transition-colors">Liên hệ</a>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:block">
          <a href="#contact" class="inline-flex items-center justify-center px-6 py-2.5 bg-brand-red hover:bg-[#ff4e29] text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:scale-105 active:scale-95 text-sm">
            Nhận Tư Vấn
          </a>
        </div>

        <!-- Mobile Menu Trigger -->
        <div class="md:hidden flex items-center">
          <button id="mobile-toggle" class="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md">
            <svg class="h-6 w-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-menu" class="hidden md:hidden fixed inset-x-0 top-[68px] bg-brand-dark border-t border-white/10 p-5 space-y-4 shadow-xl text-left bg-[#111111]">
      <a href="#services" class="mobile-nav-link block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-semibold text-base">Dịch vụ</a>
      <a href="#portfolio" class="mobile-nav-link block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-semibold text-base">Portfolio</a>
      <a href="#process" class="mobile-nav-link block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-semibold text-base">Quy trình</a>
      <a href="#pricing" class="mobile-nav-link block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-semibold text-base">Bảng giá</a>
      <a href="#contact" class="mobile-nav-link block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white font-semibold text-base">Liên hệ</a>
      <a href="#contact" class="mobile-nav-link block mt-6 px-4 py-3.5 bg-brand-red text-center text-white font-bold rounded-lg shadow-lg">Nhận Tư Vấn Miễn Phí</a>
    </div>
  </nav>

  <!-- ================= SECTION 2: HERO ================= -->
  <section id="hero" class="relative min-h-screen bg-[#0b0b0b] flex items-center justify-center overflow-hidden pt-24 pb-16">
    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-red/10 rounded-full filter blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-brand-gold/5 rounded-full filter blur-[110px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center lg:text-left">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-7 flex flex-col justify-center">
          <div class="inline-flex self-center lg:self-start items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 text-xs text-brand-gold font-semibold uppercase tracking-wider">
            ⚡ Agency Booking & Content Số 1 TP.HCM
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Kết Nối <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-gold">Thương Hiệu</span> <br> Với Triệu Khán Giả
          </h1>

          <p class="text-gray-400 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-normal">
            TieuSong Media & Services (TS Media) mang đến giải pháp truyền thông toàn diện: từ booking KOL/KOC bùng nổ tương tác đến sản xuất TVC, ảnh quay Lookbook, Seeding và quản lý nội dung đa nền tảng tối ưu tỷ lệ chuyển đổi.
          </p>

          <div class="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
            <a href="#contact" class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-brand-red hover:bg-[#ff4e29] text-white font-bold rounded-xl shadow-lg shadow-brand-red/35 transition-all duration-300 hover:scale-105 active:scale-95 text-base text-center">
              Đặt Lịch Tư Vấn ngay
            </a>
            <a href="#portfolio" class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 text-base text-center">
              Xem Portfolio
            </a>
          </div>
        </div>

        <div class="lg:col-span-5 relative h-[380px] sm:h-[450px] flex items-center justify-center">
          <div class="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/10 flex items-center justify-center bg-gradient-to-tr from-brand-red/5 to-white/[0.02]">
            <div class="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-brand-red/20 flex items-center justify-center">
              <div class="w-32 h-32 sm:w-40 sm:h-40 bg-black rounded-full border-2 border-brand-red flex items-center justify-center font-black text-4xl sm:text-5xl tracking-tighter shadow-2xl">
                <span class="text-white">T</span>
                <span class="text-brand-gold">S</span>
              </div>
            </div>
          </div>

          <!-- Fast Badges -->
          <div class="absolute top-4 left-4 bg-zinc-900 border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-xl">
            <div class="w-10 h-10 rounded-xl bg-brand-red/20 flex items-center justify-center text-brand-red font-bold">👤</div>
            <div class="flex flex-col text-left">
              <span class="font-extrabold text-white text-base">200+</span>
              <span class="text-gray-400 font-medium text-[10px] uppercase tracking-wide">KOLs & KOCs</span>
            </div>
          </div>

          <div class="absolute bottom-4 right-4 bg-zinc-900 border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-xl">
            <div class="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">🏆</div>
            <div class="flex flex-col text-left">
              <span class="font-extrabold text-white text-base">500+</span>
              <span class="text-gray-400 font-medium text-[10px] uppercase tracking-wide">Chiến dịch</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 3: SERVICES ================= -->
  <section id="services" class="py-24 bg-gray-50 text-gray-900 fade-in">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-extrabold text-brand-red uppercase tracking-wider bg-brand-red/5 px-4.5 py-1.5 rounded-full inline-block mb-3">
          Dịch Vụ Chuyên Nghiệp
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
          Giải Pháp Đột Phá Truyền Thông Số
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto mb-5 rounded-full"></div>
        <p class="text-gray-600 text-sm sm:text-base leading-relaxed">
          Chúng tôi cung cấp hệ thống dịch vụ 360 độ từ đo lường hiệu quả đến sản xuất trực tiếp tại TP.HCM.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Service Card 1 -->
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 text-2xl">
              📲
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">Booking KOL/KOC</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">Mạng lưới người ảnh hưởng phủ rộng mọi lĩnh vực: Thời trang, Làm đẹp, Công nghệ, Ăn uống và Đời sống giúp tiếp cận đúng khách hàng mục tiêu.</p>
            <div class="border-t border-gray-100 pt-5 mt-5">
              <span class="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 block">Chi tiết quyền lợi:</span>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-center gap-2">🟢 Lọc hồ sơ phù hợp nhất</li>
                <li class="flex items-center gap-2">🟢 Đàm phán giá cả trọn gói</li>
                <li class="flex items-center gap-2">🟢 Giám sát và duyệt kịch bản</li>
              </ul>
            </div>
          </div>
          <a href="#contact" class="inline-flex items-center gap-2 text-brand-red font-bold text-xs mt-8">Nhận tư vấn ngay &rarr;</a>
        </div>

        <!-- Service Card 2 -->
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 text-2xl">
              🎬
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">Sản Xuất TVC & Video</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">Sản xuất video quảng cáo ngắn, TVC doanh nghiệp đạt chất lượng điện ảnh chuyên nghiệp từ kịch bản, quay dựng đến hậu kỳ hoàn chỉnh.</p>
            <div class="border-t border-gray-100 pt-5 mt-5">
              <span class="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 block">Chi tiết quyền lợi:</span>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-center gap-2">🟢 Kịch bản phân cảnh độc quyền</li>
                <li class="flex items-center gap-2">🟢 Thiết bị máy quay chuẩn 4k</li>
                <li class="flex items-center gap-2">🟢 Chỉnh màu chuyên nghiệp</li>
              </ul>
            </div>
          </div>
          <a href="#contact" class="inline-flex items-center gap-2 text-brand-red font-bold text-xs mt-8">Nhận tư vấn ngay &rarr;</a>
        </div>

        <!-- Service Card 3 -->
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 text-2xl">
              📸
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">Chụp Lookbook</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">Định hình phong cách chụp ảnh sản phẩm, thời trang thời thượng cao cấp tại studio sang trọng và các ngoại cảnh nổi tiếng Việt Nam.</p>
            <div class="border-t border-gray-100 pt-5 mt-5">
              <span class="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 block">Chi tiết quyền lợi:</span>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-center gap-2">🟢 Ekip nhiếp ảnh gia kỳ cựu</li>
                <li class="flex items-center gap-2">🟢 Định hình layout makeup mẫu</li>
                <li class="flex items-center gap-2">🟢 Bàn giao file gốc cực nét</li>
              </ul>
            </div>
          </div>
          <a href="#contact" class="inline-flex items-center gap-2 text-brand-red font-bold text-xs mt-8">Nhận tư vấn ngay &rarr;</a>
        </div>

        <!-- Service Card 4 -->
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 text-2xl">
              💬
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">Seeding Thừa Nhận</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">Tăng mức độ uy tín thương hiệu lý tưởng thông qua các kịch bản viết bình luận, seeding tự nhiên sâu đậm trong các hội nhóm mxh.</p>
            <div class="border-t border-gray-100 pt-5 mt-5">
              <span class="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 block">Chi tiết quyền lợi:</span>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-center gap-2">🟢 Tài khoản thật uy tín tương tác</li>
                <li class="flex items-center gap-2">🟢 Định hướng theo mục tiêu</li>
                <li class="flex items-center gap-2">🟢 Kiểm soát dư luận tỉ mỉ</li>
              </ul>
            </div>
          </div>
          <a href="#contact" class="inline-flex items-center gap-2 text-brand-red font-bold text-xs mt-8">Nhận tư vấn ngay &rarr;</a>
        </div>

        <!-- Service Card 5 -->
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 text-2xl">
              ✍️
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">Sáng Tạo Content Đa Kênh</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">Lập kế hoạch nội dung hàng tháng bài bản, viết bài thu hút, thiết kế hình ảnh, tối ưu SEO chăm sóc kênh định kỳ hiệu quả.</p>
            <div class="border-t border-gray-100 pt-5 mt-5">
              <span class="text-xs font-bold uppercase text-gray-800 tracking-wider mb-2 block">Chi tiết quyền lợi:</span>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-center gap-2">🟢 Kế hoạch nội dung đa kênh</li>
                <li class="flex items-center gap-2">🟢 Viết bài chuẩn SEO tối ưu</li>
                <li class="flex items-center gap-2">🟢 Thiết kế hình ảnh sống động</li>
              </ul>
            </div>
          </div>
          <a href="#contact" class="inline-flex items-center gap-2 text-brand-red font-bold text-xs mt-8">Nhận tư vấn ngay &rarr;</a>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 4: WHY US ================= -->
  <section id="why-us" class="py-24 bg-zinc-950 text-white relative fade-in">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-5 text-center lg:text-left">
          <span class="text-xs font-extrabold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-4 py-1.5 rounded-full inline-block mb-3.5">
            Tại Sao Chọn Chúng Tôi
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
            Định Hình Sự Khác Biệt Bằng Chất Lượng Chiến Dịch
          </h2>
          <div class="w-16 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto lg:mx-0 mb-6 rounded-full"></div>
          <p class="text-gray-400 text-sm leading-relaxed mb-8">
            TS Media không chỉ đơn thuần là truyền thông, chúng tôi là kiến trúc sư số kiến tạo giá trị tiếp thị. Chúng tôi đem lại cam kết hợp đồng KPI vững chắc.
          </p>
        </div>

        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
          
          <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div class="text-brand-gold text-3xl font-black mb-1">200+</div>
            <h4 class="font-bold text-white text-base mb-1">KOLs & KOCs Độc Quyền</h4>
            <p class="text-gray-400 text-xs">Phù hợp trực tiếp phân khúc sản phẩm nhãn hàng.</p>
          </div>

          <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div class="text-brand-gold text-3xl font-black mb-1">500+</div>
            <h4 class="font-bold text-white text-base mb-1">Chiến Dịch Thành Công</h4>
            <p class="text-gray-400 text-xs">Khẳng định năng lực thông qua các chiến dịch lớn.</p>
          </div>

          <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div class="text-brand-gold text-3xl font-black mb-1">10M+</div>
            <h4 class="font-bold text-white text-base mb-1">Tổng Lượt Tiếp Cận</h4>
            <p class="text-gray-400 text-xs">Lượng view khủng lan tỏa nhanh vượt mong đợi.</p>
          </div>

          <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div class="text-brand-gold text-3xl font-black mb-1">98%</div>
            <h4 class="font-bold text-white text-base mb-1">Khách Hàng Hài Lòng</h4>
            <p class="text-gray-400 text-xs text-left">Phản hồi tích cực cực cao gắn kết lâu dài.</p>
          </div>

        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 5: PORTFOLIO ================= -->
  <section id="portfolio" class="py-24 bg-white text-gray-900 fade-in">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      
      <div class="max-w-3xl mx-auto mb-16">
        <span class="text-xs font-extrabold text-brand-red uppercase tracking-wider bg-brand-red/5 px-4.5 py-1.5 rounded-full inline-block mb-3.5">
          Các Dự Án Đã Thực Hiện
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
          Chiêm Ngưỡng Portfolio Sáng Tạo
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto mb-5 rounded-full"></div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button onclick="filterPortfolio('All')" class="portfolio-btn px-5 py-2.2 bg-brand-red text-white text-xs sm:text-sm font-semibold rounded-full shadow">Tất cả</button>
        <button onclick="filterPortfolio('KOL')" class="portfolio-btn px-5 py-2.2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full">Booking KOL</button>
        <button onclick="filterPortfolio('TVC')" class="portfolio-btn px-5 py-2.2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full">Sản xuất TVC</button>
        <button onclick="filterPortfolio('Lookbook')" class="portfolio-btn px-5 py-2.2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full">Chụp Lookbook</button>
        <button onclick="filterPortfolio('Seeding')" class="portfolio-btn px-5 py-2.2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full">Seeding</button>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        
        <!-- Case 1 -->
        <div class="portfolio-item group relative bg-[#111] rounded-2xl overflow-hidden shadow h-[380px]" data-category="KOL">
          <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover opacity-80" alt="Son MAC">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div class="absolute top-4 left-4"><span class="bg-brand-red text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded">KOL</span></div>
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <span class="text-brand-gold text-[10px] font-bold tracking-wider uppercase mb-1 block">MAC Cosmetics Vietnam</span>
            <h3 class="text-white text-lg font-bold mb-3">Chiến Dịch Chạm Sắc Việt - Son MAC</h3>
            <div class="border-t border-white/10 pt-3 flex gap-4 text-white text-xs">
              <div>📈 Reach: <b class="text-brand-orange text-white">1.2M+</b></div>
              <div>💬 Tác: <b>8.5%</b></div>
            </div>
          </div>
        </div>

        <!-- Case 2 -->
        <div class="portfolio-item group relative bg-[#111] rounded-2xl overflow-hidden shadow h-[380px]" data-category="TVC">
          <img src="https://images.unsplash.com/photo-1540759786422-c60d5eda11da?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover opacity-80" alt="TVC Fami">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div class="absolute top-4 left-4"><span class="bg-brand-red text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded">TVC</span></div>
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <span class="text-brand-gold text-[10px] font-bold tracking-wider uppercase mb-1 block">Sữa Đậu Nành Fami</span>
            <h3 class="text-white text-lg font-bold mb-3">Video Viral Tết Sum Vầy - Vinasoy</h3>
            <div class="border-t border-white/10 pt-3 flex gap-4 text-white text-xs">
              <div>📈 Reach: <b class="text-white">3.5M+</b></div>
              <div>💬 Tác: <b>12.4%</b></div>
            </div>
          </div>
        </div>

        <!-- Case 3 -->
        <div class="portfolio-item group relative bg-[#111] rounded-2xl overflow-hidden shadow h-[380px]" data-category="Lookbook">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover opacity-80" alt="Juno">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div class="absolute top-4 left-4"><span class="bg-brand-red text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded">Lookbook</span></div>
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <span class="text-brand-gold text-[10px] font-bold tracking-wider uppercase mb-1 block">Juno Fashion</span>
            <h3 class="text-white text-lg font-bold mb-3">Lookbook Sunny Days - BST Juno</h3>
            <div class="border-t border-white/10 pt-3 flex gap-4 text-white text-xs">
              <div>📈 Reach: <b class="text-white">850K+</b></div>
              <div>💬 Tác: <b>6.2%</b></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 6: PROCESS ================= -->
  <section id="process" class="py-24 bg-[#111111] text-white fade-in text-center">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="max-w-3xl mx-auto mb-20">
        <span class="text-xs font-extrabold text-brand-red uppercase tracking-wider bg-brand-red/10 px-4.5 py-1.5 rounded-full inline-block mb-3.5">
          Quy Trình Làm Việc
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Lộ Trình Hợp Tác Chuyên Nghiệp
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto mb-5 rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
        
        <div class="flex flex-col">
          <div class="relative w-16 h-16 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 text-2xl">
            💬
            <div class="absolute -top-3 -right-3 bg-brand-red text-white text-[9px] font-bold w-6 h-6 rounded-md border border-[#111] flex items-center justify-center">01</div>
          </div>
          <h3 class="text-lg font-bold mb-2 text-white">1. Tư vấn & Báo giá</h3>
          <p class="text-gray-400 text-xs sm:text-sm">Lắng nghe sản phẩm của doanh nghiệp và gợi ý đề xuất phương án KOL/KOC phân mảnh miễn phí.</p>
        </div>

        <div class="flex flex-col">
          <div class="relative w-16 h-16 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 text-2xl">
            📋
            <div class="absolute -top-3 -right-3 bg-brand-red text-white text-[9px] font-bold w-6 h-6 rounded-md border border-[#111] flex items-center justify-center">02</div>
          </div>
          <h3 class="text-lg font-bold mb-2 text-white">2. Lên kế hoạch</h3>
          <p class="text-gray-400 text-xs sm:text-sm">Xây dựng kịch bản nháp, lên timeline truyền thông rõ ràng và dự toán cam kết doanh số KPI rành mạch.</p>
        </div>

        <div class="flex flex-col">
          <div class="relative w-16 h-16 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 text-2xl">
            ⚡
            <div class="absolute -top-3 -right-3 bg-brand-red text-white text-[9px] font-bold w-6 h-6 rounded-md border border-[#111] flex items-center justify-center">03</div>
          </div>
          <h3 class="text-lg font-bold mb-2 text-white">3. Thực thi chiến dịch</h3>
          <p class="text-gray-400 text-xs sm:text-sm">Quay dựng kịch bản phim, launching đúng lịch trình và seeding hội nhóm rà soát tương tác an toàn.</p>
        </div>

        <div class="flex flex-col">
          <div class="relative w-16 h-16 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center mb-6 text-2xl">
            📊
            <div class="absolute -top-3 -right-3 bg-brand-red text-white text-[9px] font-bold w-6 h-6 rounded-md border border-[#111] flex items-center justify-center">04</div>
          </div>
          <h3 class="text-lg font-bold mb-2 text-white">4. Báo cáo & Nghiệm thu</h3>
          <p class="text-gray-400 text-xs sm:text-sm">Phân tích đo lường thực tế lượng nhấp chuột, views chuyển đổi chi tiết cuối chiến dịch.</p>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 7: TESTIMONIALS ================= -->
  <section id="testimonials" class="py-24 bg-gray-50 text-gray-900 fade-in text-center">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-14">
        <span class="text-xs font-extrabold text-brand-red uppercase tracking-wider bg-brand-red/5 px-4.5 py-1.5 rounded-full inline-block mb-3.5">
          Cảm Nhận Khách Hàng
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
          Dấu Ấn Tin Cậy Từ Đối Tác
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto mb-5 rounded-full"></div>
      </div>

      <!-- Carousel Frame -->
      <div class="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl relative text-left">
        <div class="text-brand-red text-4xl opacity-20 absolute top-6 right-8">“</div>
        
        <div id="testimonial-container" class="space-y-6">
          <p id="test-content" class="text-gray-700 text-sm sm:text-base italic leading-relaxed">
            "TS Media đã giúp chiến dịch ra mắt mùi hương mới của chúng tôi đạt lượng tiếp cận 1.5M view vượt mức mong đợi kỳ vọng. Đội ngũ làm việc cực kỳ tốc độ, báo cáo rõ ràng và dàn KOC độc quyền sáng tạo rất tự nhiên."
          </p>
          
          <div class="flex items-center gap-4.5 border-t border-gray-100 pt-6">
            <img id="test-avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" class="w-12 h-12 rounded-full object-cover">
            <div>
              <h5 id="test-name" class="font-bold text-gray-900 text-sm">Nguyễn Thị Ngọc Mai</h5>
              <span id="test-brand" class="text-xs text-gray-500">Giám Đốc Thương Hiệu — Loli & The Wolf</span>
            </div>
          </div>
        </div>

        <!-- Arrows -->
        <div class="flex justify-end gap-2 mt-6">
          <button onclick="rotateTestimonial(-1)" class="w-9 h-9 rounded-lg bg-gray-100 hover:bg-brand-red hover:text-white transition-colors flex items-center justify-center font-bold font-mono text-sm">&lt;</button>
          <button onclick="rotateTestimonial(1)" class="w-9 h-9 rounded-lg bg-gray-100 hover:bg-brand-red hover:text-white transition-colors flex items-center justify-center font-bold font-mono text-sm">&gt;</button>
        </div>
      </div>

    </div>
  </section>

  <!-- ================= SECTION 8: PRICING ================= -->
  <section id="pricing" class="py-24 bg-white text-gray-900 fade-in text-center">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="max-w-3xl mx-auto mb-16">
        <span class="text-xs font-extrabold text-brand-red uppercase tracking-wider bg-brand-red/5 px-4 py-1.5 rounded-full inline-block mb-3.5">
          Báo Giá Trọn Gói
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
          Bảng Giá Dịch Vụ Phân Khúc Cạnh Tranh
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto mb-5 rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left">
        
        <!-- Basic -->
        <div class="bg-gray-50 border border-gray-150 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Gói Thử Nghiệm (Basic)</h3>
            <p class="text-xs text-gray-500 mb-8">Thích hợp cho nhãn hàng thử nghiệm KOC phủ sóng.</p>
            <div class="mb-8 flex items-baseline gap-1.5">
              <span class="text-xs font-bold text-brand-red">VNĐ</span>
              <span class="text-4xl font-black text-gray-950">15.000.000</span>
              <span class="text-xs text-gray-400">/chiến dịch</span>
            </div>
            <ul class="space-y-3.5 border-t border-gray-200 pt-6 text-xs text-gray-700">
              <li>✔️ Booking 3 KOC quy mô nhỏ</li>
              <li>✔️ 1 video độc quyền dưới 60s</li>
              <li>✔️ Kịch bản nội dung tiêu chuẩn</li>
              <li>✔️ Báo cáo lượng tương tác thực</li>
            </ul>
          </div>
          <a href="#contact" onclick="selectPlanForm('Gói Thử Nghiệm (Basic)')" class="mt-8 block text-center py-3.5 bg-zinc-950 hover:bg-brand-red text-white font-bold text-xs rounded-xl transition-all shadow">CHỌN GÓI NÀY</a>
        </div>

        <!-- Standard -->
        <div class="bg-brand-dark text-white border-2 border-brand-red rounded-3xl p-8 relative scale-105 flex flex-col justify-between">
          <div class="absolute -top-3.5 right-1/2 translate-x-1/2 bg-brand-red text-white py-1 px-4.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">PHỔ BIẾN NHẤT</div>
          <div>
            <h3 class="text-lg font-bold mb-1 text-white">Gói Phủ Sóng (Standard)</h3>
            <p class="text-xs text-gray-400 mb-8">Giải pháp đột phá doanh số, nhận diện cực cao.</p>
            <div class="mb-8 flex items-baseline gap-1.5">
              <span class="text-xs font-bold text-brand-gold">VNĐ</span>
              <span class="text-4xl font-black text-white">45.000.000</span>
              <span class="text-xs text-gray-400">/chiến dịch</span>
            </div>
            <ul class="space-y-3.5 border-t border-white/10 pt-6 text-xs text-gray-300">
              <li>✔️ Booking 8-10 KOC và 1 KOL phụ</li>
              <li>✔️ 1 TVC thương hiệu sắc nét</li>
              <li>✔️ Seeding 5 group lớn trong 1 tuần</li>
              <li>✔️ Cam kết tối thiểu 80% KPI cam kết</li>
            </ul>
          </div>
          <a href="#contact" onclick="selectPlanForm('Gói Phủ Sóng (Standard)')" class="mt-8 block text-center py-3.5 bg-brand-red hover:bg-[#ff4e29] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-brand-red/25">CHỌN GÓI NÀY</a>
        </div>

        <!-- Premium -->
        <div class="bg-gray-50 border border-gray-150 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Gói Đột Phá (Premium)</h3>
            <p class="text-xs text-gray-500 mb-8">Thích hợp phủ góc rộng chiếm lĩnh thị trường.</p>
            <div class="mb-8 flex items-baseline gap-1.5">
              <span class="text-xs font-bold text-brand-red">VNĐ</span>
              <span class="text-4xl font-black text-gray-950">120.000.000</span>
              <span class="text-xs text-gray-400">/chiến dịch</span>
            </div>
            <ul class="space-y-3.5 border-t border-gray-200 pt-6 text-xs text-gray-700">
              <li>✔️ 3 KOL cực lớn + 20 KOC độc quyền</li>
              <li>✔️ 2 TVC quảng cáo rực rỡ nghệ thuật</li>
              <li>✔️ 1 bộ ảnh Lookbook chuyên người mẫu</li>
              <li>✔️ Cam kết bảo mật, cam kết KPI kịch kim</li>
            </ul>
          </div>
          <a href="#contact" onclick="selectPlanForm('Gói Đột Phá (Premium)')" class="mt-8 block text-center py-3.5 bg-zinc-950 hover:bg-brand-red text-white font-bold text-xs rounded-xl transition-all shadow">CHỌN GÓI NÀY</a>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 9: FAQ ================= -->
  <section id="faq" class="py-24 bg-zinc-950 text-white fade-in text-left">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-extrabold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-4 py-1.5 rounded-full inline-block mb-3">
          Giải Đáp Thắc Mắc
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Câu Hỏi Thường Gặp (FAQs)
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-brand-red to-brand-gold mx-auto mb-5 rounded-full"></div>
      </div>

      <div class="space-y-4">
        
        <!-- Accordion 1 -->
        <div class="bg-[#181818] border border-white/5 rounded-2xl overflow-hidden">
          <button onclick="toggleFaq('faq-1')" class="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none">
            <span class="font-bold text-sm sm:text-base">Quy trình lựa chọn KOL/KOC tại TS Media thế nào?</span>
            <span id="faq-1-arrow" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs transition-transform duration-300 rotate-180">&or;</span>
          </button>
          <div id="faq-1-body" class="p-6 border-t border-white/5 bg-[#1e1e1e] text-gray-400 text-xs sm:text-sm">
            Chúng tôi sử dụng thuật toán rà soát tỉ lệ tương tác thật, nhân khẩu học địa bàn TP.HCM và phong cách sáng tạo nội dung của KOL/KOC trước khi gửi báo cáo cho nhãn hàng, cam kết không acc clone ảo.
          </div>
        </div>

        <!-- Accordion 2 -->
        <div class="bg-[#181818] border border-white/5 rounded-2xl overflow-hidden">
          <button onclick="toggleFaq('faq-2')" class="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none">
            <span class="font-bold text-sm sm:text-base">Giá tiền có bao gồm tiền thù lao của KOL chưa?</span>
            <span id="faq-2-arrow" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs transition-transform duration-300">&or;</span>
          </button>
          <div id="faq-2-body" class="hidden p-6 border-t border-white/5 bg-[#1e1e1e] text-gray-400 text-xs sm:text-sm">
            Tất cả báo giá đã bao gồm cát-xê trực tiếp của KOL/KOC độc quyền và chi phí thiết lập sản xuất kịch bản. Các yêu cầu mời thêm KOL ngoài danh mục đề xuất sẽ được bổ sung bản phụ lục rõ ràng.
          </div>
        </div>

        <!-- Accordion 3 -->
        <div class="bg-[#181818] border border-white/5 rounded-2xl overflow-hidden">
          <button onclick="toggleFaq('faq-3')" class="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none">
            <span class="font-bold text-sm sm:text-base">Một dự án trung bình diễn ra trong bao lâu?</span>
            <span id="faq-3-arrow" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs transition-transform duration-300">&or;</span>
          </button>
          <div id="faq-3-body" class="hidden p-6 border-t border-white/5 bg-[#1e1e1e] text-gray-400 text-xs sm:text-sm">
            Thời gian từ khi nhãn hợp hành liên hệ đến khi launching thực tế và báo cáo nghiệm thu rơi vào khoảng 15 - 30 ngày tùy theo khối lượng video cần sản xuất.
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ================= SECTION 10: CONTACT FORM ================= -->
  <section id="contact" class="py-24 bg-gray-50 text-gray-900 fade-in text-left">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Toast Alert Success -->
      <div id="success-toast" class="hidden fixed bottom-5 right-5 z-50 bg-[#111] border border-brand-red rounded-xl p-5 shadow-2xl max-w-sm flex gap-4 text-white">
        <div class="text-green-500 font-bold text-xl">✓</div>
        <div>
          <h4 class="font-bold text-xs">Gửi Thông Tin Thành Công!</h4>
          <p class="text-[10px] text-gray-400 leading-normal">Đội ngũ tư vấn TS Media sẽ gọi điện cho bạn trong vòng 2 tiếng hành chính.</p>
        </div>
        <button onclick="hideToast()" class="text-gray-400 font-bold">x</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span class="text-xs font-extrabold text-brand-red uppercase tracking-wider bg-brand-red/5 px-4.5 py-1.5 rounded-full inline-block mb-3">
              Liên Hệ Hợp Tác
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-6">
              Khởi Động Chiến Dịch Bùng Nổ Ngay
            </h2>
            <div class="w-16 h-1 bg-gradient-to-r from-brand-red to-brand-gold mb-6 rounded-full"></div>
            <p class="text-gray-600 text-sm leading-relaxed mb-8">
              Bắt đầu hành trình bùng nổ chuyển đổi doanh thu thương hiệu cùng TS Media ngay hôm nay. Hãy để lại thông tin để chúng tôi liên lạc tư vấn trực tiếp.
            </p>
          </div>

          <div class="space-y-6 my-8">
            <div class="flex items-center gap-4">
              <span class="text-xl bg-brand-red/10 p-3.5 rounded-xl text-brand-red">📞</span>
              <div>
                <span class="block text-gray-500 text-[9px] uppercase tracking-widest font-bold">Hotline 24/7</span>
                <a href="tel:0901234567" class="font-extrabold text-sm hover:text-brand-red">0901 234 567</a>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xl bg-brand-red/10 p-3.5 rounded-xl text-brand-red">✉️</span>
              <div>
                <span class="block text-gray-500 text-[9px] uppercase tracking-widest font-bold">Email chính</span>
                <a href="mailto:contact@tieusongmedia.vn" class="font-extrabold text-sm hover:text-brand-red">contact@tieusongmedia.vn</a>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xl bg-brand-red/10 p-3.5 rounded-xl text-brand-red">📍</span>
              <div>
                <span class="block text-gray-500 text-[9px] uppercase tracking-widest font-bold">Văn Phòng TP.HCM</span>
                <span class="font-bold text-xs">Toà Nhà Landmark 81, Vinhomes Bình Thạnh, HCM</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
          <form onsubmit="handleFormSubmit(event)" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col space-y-1.5">
                <label class="text-[10px] font-bold text-gray-700 uppercase">Họ và Tên *</label>
                <input type="text" required id="form-name" class="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-red">
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-[10px] font-bold text-gray-700 uppercase">Số Điện Thoại *</label>
                <input type="tel" required id="form-phone" class="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-red">
              </div>
            </div>

            <div class="flex flex-col space-y-1.5">
              <label class="text-[10px] font-bold text-gray-700 uppercase">Email</label>
              <input type="email" placeholder="name@company.com" class="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-red">
            </div>

            <div class="flex flex-col space-y-1.5">
              <label class="text-[10px] font-bold text-gray-700 uppercase">Gói Cước / Dịch Vụ Quan Tâm</label>
              <select id="form-service" class="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-red">
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

            <div class="flex flex-col space-y-1.5">
              <label class="text-[10px] font-bold text-gray-700 uppercase">Nhu Cầu Chi Tiết</label>
              <textarea rows="3" placeholder="Ghi chú về phân khúc sản phẩm, kế hoạch tài chính của bạn..." class="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-red"></textarea>
            </div>

            <button type="submit" class="w-full py-3.5 bg-brand-red hover:bg-[#ff4e29] text-white font-bold text-xs rounded-xl shadow transition-all uppercase">GỬI THÔNG TIN</button>
          </form>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= SECTION 11: FOOTER ================= -->
  <footer class="bg-[#080808] text-[#909090] text-left border-t border-white/5 pt-16 pb-8 text-xs sm:text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/5">
        
        <div class="lg:col-span-4">
          <div class="flex items-center space-x-3 mb-5">
            <div class="w-10 h-10 bg-black rounded-lg border border-brand-red flex items-center justify-center font-extrabold text-lg">
              <span class="text-white font-black">T</span>
              <span class="text-brand-gold font-black">S</span>
            </div>
            <div class="flex flex-col">
              <span class="text-white font-extrabold text-base leading-none block">TIEUSONG</span>
              <span class="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-1">Media & Services</span>
            </div>
          </div>
          <p class="text-[#a0a0a0] max-w-sm mb-6 leading-relaxed text-xs">Phủ sóng đa kênh xã hội, liên hệ booking và tư vấn chiến dịch toàn lực chuyển đổi số.</p>
        </div>

        <div class="lg:col-span-3">
          <h5 class="text-white font-bold text-xs mb-4 uppercase tracking-wider">Đường dẫn</h5>
          <ul class="space-y-3.5 text-xs text-[#909090]">
            <li><a href="#services" class="hover:text-white">Dịch vụ</a></li>
            <li><a href="#portfolio" class="hover:text-white">Dự án đã làm</a></li>
            <li><a href="#process" class="hover:text-white">Quy trình</a></li>
            <li><a href="#pricing" class="hover:text-white">Báo giá</a></li>
          </ul>
        </div>

        <div class="lg:col-span-5 text-left text-xs">
          <h5 class="text-white font-bold text-xs mb-4 uppercase tracking-wider">Trụ Sở Chính</h5>
          <p class="leading-relaxed mb-4">📍 Toà Nhà Landmark 81, Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh</p>
          <p class="mb-2">📞 <a href="tel:0901234567" class="hover:text-white">0901 234 567</a></p>
          <p>✉️ <a href="mailto:contact@tieusongmedia.vn" class="hover:text-white">contact@tieusongmedia.vn</a></p>
        </div>

      </div>

      <div class="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-600 font-medium gap-4">
        <span>&copy; 2026 TieuSong Media & Services. Bảo lưu mọi quyền.</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-white">Điều khoản bảo mật</a>
          <a href="#" class="hover:text-white">Chính sách sử dụng</a>
        </div>
      </div>

    </div>
  </footer>

  <!-- ================= INTERACTIVE SCRIPTS ================= -->
  <script>
    // Sticky Navbar configuration
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (window.scrollY > 20) {
        nav.classList.add('bg-[#111111]/95', 'backdrop-blur-md', 'shadow-2xl', 'border-b', 'border-white/5');
        nav.classList.remove('py-5', 'bg-transparent');
        nav.classList.add('py-3');
      } else {
        nav.classList.remove('bg-[#111111]/95', 'backdrop-blur-md', 'shadow-2xl', 'border-b', 'border-white/5', 'py-3');
        nav.classList.add('py-5', 'bg-transparent');
      }
    });

    // Mobile Toggle Navigation Drawer
    const mobileBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close Menu on Link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });

    // Filter portfolio gallery
    window.filterPortfolio = function(category) {
      document.querySelectorAll('.portfolio-item').forEach(item => {
        if (category === 'All' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      // Toggle button active colours
      document.querySelectorAll('.portfolio-btn').forEach(btn => {
        if (btn.innerText.includes(category === 'All' ? 'Tất cả' : (category === 'KOL' ? 'Booking KOL' : (category === 'TVC' ? 'Sản xuất TVC' : (category === 'Lookbook' ? 'Chụp Lookbook' : 'Seeding'))))) {
          btn.classList.add('bg-brand-red', 'text-white', 'shadow');
          btn.classList.remove('bg-gray-100', 'text-gray-700');
        } else {
          btn.classList.remove('bg-brand-red', 'text-white', 'shadow');
          btn.classList.add('bg-gray-100', 'text-gray-700');
        }
      });
    };

    // FAQ Accordion Fold trigger
    window.toggleFaq = function(id) {
      const body = document.getElementById(id + '-body');
      const arrow = document.getElementById(id + '-arrow');
      
      const isHidden = body.classList.contains('hidden');
      
      // Close all first for accordion behavior
      for (let i = 1; i <= 3; i++) {
        document.getElementById('faq-' + i + '-body').classList.add('hidden');
        document.getElementById('faq-' + i + '-arrow').classList.remove('rotate-180');
      }

      if (isHidden) {
        body.classList.remove('hidden');
        arrow.classList.add('rotate-180');
      }
    };

    // Client Feedback Carousels Rotation
    const testimonials = [
      {
        content: "TS Media đã giúp chiến dịch ra mắt mùi hương mới của chúng tôi đạt lượng tiếp cận 1.5M view vượt mức mong đợi kỳ vọng. Đội ngũ làm việc cực kỳ tốc độ, báo cáo rõ ràng và dàn KOC độc quyền sáng tạo rất tự nhiên.",
        name: "Nguyễn Thị Ngọc Mai",
        brand: "Giám Đốc Thương Hiệu — Loli & The Wolf",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
      },
      {
        content: "Dịch vụ chụp ảnh Lookbook và quay video ngắn của các bạn thực sự mang đẳng cấp khác biệt. Tinh tế từ layout trang điểm đến xử lý ánh sáng ngoại cảnh. Nhờ bộ hình sang xịn mịn này mà doanh thu BST mới tăng vọt 45%.",
        name: "Hoàng Quốc Bảo",
        brand: "Nhà Sáng Lập — Urbantoy Clothing",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
      },
      {
        content: "Hài lòng nhất là tinh thần trách nghiệm cao trong khâu Seeding hội nhóm. Các bạn bám sát kịch bản, kiểm soát chặt chẽ các luồng ý kiến trái chiều, tạo uy tín mạnh giúp các hợp đồng nhà phố của bên mình tăng trưởng rõ rệt.",
        name: "Phạm Thuỳ Dương",
        brand: "Trưởng Phòng Truyền Thông — Nội Thất Decox Design",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
      }
    ];

    let activeTest = 0;
    window.rotateTestimonial = function(dir) {
      activeTest = (activeTest + dir + testimonials.length) % testimonials.length;
      document.getElementById('test-content').innerText = '"' + testimonials[activeTest].content + '"';
      document.getElementById('test-name').innerText = testimonials[activeTest].name;
      document.getElementById('test-brand').innerText = testimonials[activeTest].brand;
      document.getElementById('test-avatar').src = testimonials[activeTest].avatar;
    };

    // Pre-select Pricing Dropdown and Scroll Down to Form
    window.selectPlanForm = function(planName) {
      document.getElementById('form-service').value = planName;
    };

    // Handle Form submission
    window.handleFormSubmit = function(e) {
      e.preventDefault();
      document.getElementById('success-toast').classList.remove('hidden');
      document.getElementById('form-name').value = '';
      document.getElementById('form-phone').value = '';
      setTimeout(() => {
        hideToast();
      }, 5000);
    };

    window.hideToast = function() {
      document.getElementById('success-toast').classList.add('hidden');
    };

    // Fade in sections on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(sec => {
      observer.observe(sec);
    });
  </script>
</body>
</html>`;

    // Trigger local download in clients browser
    const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Mock completing loader
    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="relative group inline-flex items-center gap-2 px-5 py-3 tracking-wide font-extrabold text-[#111111] bg-[#F5C518] border border-black hover:bg-white rounded-2xl shadow-2xl active:scale-95 transition-all text-sm cursor-pointer"
        title="Tải về file index.html tự hoán của bạn"
      >
        <Sparkles className="w-5 h-5 text-[#E8401C]" />
        <span>
          {isExporting ? 'Đang trích xuất HTML...' : 'Tải Single-File HTML'}
        </span>
        <Download className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}

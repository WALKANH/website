import { Service, TrustPoint, Campaign, ProcessStep, Testimonial, PricingPlan, FAQItem } from './types';

export const servicesData: Service[] = [
  {
    id: 'booking',
    icon: 'MessageSquare',
    title: 'Booking KOL/KOC',
    description: 'Kết nối mạng lưới 200+ sáng tạo nội dung hàng đầu trên TikTok, Facebook, Instagram phù hợp chính xác với từng phân khúc khách hàng.',
    details: [
      'Lọc hồ sơ & định vị Influencer thích hợp',
      'Đàm phán chi phí & quản lý hợp đồng',
      'Giám sát kịch bản & hạn chót video',
      'Báo cáo hiệu quả chiến dịch chi tiết'
    ]
  },
  {
    id: 'tvc',
    icon: 'Video',
    title: 'Sản xuất TVC & Video',
    description: 'Sản xuất video quảng cáo doanh nghiệp, phục vụ bán hàng, video viral đột phá đạt chuẩn điện ảnh từ biên kịch đến hậu kỳ.',
    details: [
      'Xây dựng kịch bản câu chuyện độc quyền',
      'Hệ thống máy quay & ánh sáng chuẩn 4K',
      'Đội ngũ đạo diễn & kỹ thuật chuyên nghiệp',
      'Hậu kỳ kỹ xảo & chỉnh màu điện ảnh'
    ]
  },
  {
    id: 'lookbook',
    icon: 'Camera',
    title: 'Chụp ảnh Lookbook',
    description: 'Nâng tầm hình ảnh sản phẩm thời trang, trang sức, công nghệ thông qua các bộ ảnh thiết kế nghệ thuật cao cấp tại Studio và ngoại cảnh.',
    details: [
      'Tuyển chọn người mẫu & ekip trang điểm',
      'Concept nghệ thuật theo xu hướng mới nhất',
      'Thiết kế bối cảnh & ánh sáng studio hiện đại',
      'Chỉnh sửa ảnh chuyên nghiệp bàn giao nhanh'
    ]
  },
  {
    id: 'seeding',
    icon: 'Share2',
    title: 'Seeding Đa Nền Tảng',
    description: 'Tạo lập dư luận tự nhiên, kích thích mua hàng thông qua seeding thông minh trong các group cộng đồng lớn và các mục bình luận.',
    details: [
      'Xây dựng kịch bản seeding chân thực',
      'Hệ thống tài khoản uy tín tương tác cao',
      'Định hướng cảm xúc tích cực của người tiêu dùng',
      'Kiểm soát khủng hoảng truyền thông trực tuyến'
    ]
  },
  {
    id: 'content',
    icon: 'PenTool',
    title: 'Sáng Tạo Content Đa Kênh',
    description: 'Xây dựng tuyến bài viết, kịch bản reels/tiktok, duy trì hoạt động fanpage chất lượng giúp thương hiệu tăng trưởng tự nhiên bền vững.',
    details: [
      'Lập kế hoạch nội dung hàng tháng bài bản',
      'Sáng tạo hình ảnh & infographic nổi bật',
      'Viết bài chuẩn SEO & quảng cáo tăng chuyển đổi',
      'Quản lý và tương tác chăm sóc cộng đồng'
    ]
  }
];

export const trustPoints: TrustPoint[] = [
  {
    id: 'trust-1',
    stat: '200+',
    title: 'KOLs & KOCs Độc Quyền',
    description: 'Mạng lưới người ảnh hưởng phủ rộng mọi lĩnh vực: Thời trang, Làm đẹp, Công nghệ, Ăn uống và Đời sống.',
    iconName: 'Users'
  },
  {
    id: 'trust-2',
    stat: '500+',
    title: 'Chiến Dịch Thành Công',
    description: 'Đồng hành cùng hàng trăm thương hiệu trong và ngoài nước bùng nổ doanh số và nhận diện thương hiệu.',
    iconName: 'Award'
  },
  {
    id: 'trust-3',
    stat: '10M+',
    title: 'Tổng Lượt Tiếp Cận',
    description: 'Sức mạnh lan tỏa vượt trội thu hút hàng chục triệu lượt xem và tương tác tự nhiên trên các nền tảng mạng xã hội.',
    iconName: 'TrendingUp'
  },
  {
    id: 'trust-4',
    stat: '98%',
    title: 'Khách Hàng Hài Lòng',
    description: 'Chỉ số đo lường mức độ tin mến và gắn kết lâu dài của các đối tác doanh nghiệp đồng hành cùng TS Media.',
    iconName: 'Smile'
  }
];

export const campaignsData: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Chiến Dịch Chạm Sắc Việt - Son Môi MAC',
    category: 'KOL',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    client: 'MAC Cosmetics Vietnam',
    reach: '1.200.000+',
    engagement: '8.5%'
  },
  {
    id: 'camp-2',
    title: 'Video Viral Tết Sum Vầy - Sữa Đậu Nành Fami',
    category: 'TVC',
    image: 'https://images.unsplash.com/photo-1540759786422-c60d5eda11da?auto=format&fit=crop&q=80&w=800',
    client: 'Vinasoy',
    reach: '3.500.000+',
    engagement: '12.4%'
  },
  {
    id: 'camp-3',
    title: 'Bộ Sưu Tập Lookbook Sunny Days - Thời Trang Juno',
    category: 'Lookbook',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    client: 'Juno Fashion',
    reach: '850.000+',
    engagement: '6.2%'
  },
  {
    id: 'camp-4',
    title: 'Kênh TikTok Bán Hàng Triệu View - Mỹ Phẩm Cocoon',
    category: 'KOL',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
    client: 'Cocoon Vietnam',
    reach: '2.100.000+',
    engagement: '14.1%'
  },
  {
    id: 'camp-5',
    title: 'Chiến Dịch Phủ Sóng Seeding Hội Nhóm - Trà Sữa Mixue',
    category: 'Seeding',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800',
    client: 'Mixue Vietnam',
    reach: '4.800.000+',
    engagement: '9.8%'
  },
  {
    id: 'camp-6',
    title: 'TVC Quảng Cáo App Giao Đồ Ăn Baemin 3 Khắc',
    category: 'TVC',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    client: 'BAEMIN',
    reach: '5.000.000+',
    engagement: '11.2%'
  }
];

export const stepsData: ProcessStep[] = [
  {
    id: 1,
    title: '1. Tiếp Nhận & Tư Vấn',
    description: 'Lắng nghe nhu cầu, thấu hiểu sản phẩm và phân tích mục tiêu chiến dịch của nhãn hàng hoàn toàn miễn phí.',
    iconName: 'MessageSquareText'
  },
  {
    id: 2,
    title: '2. Xây Dựng Kế Hoạch',
    description: 'Lên outline kịch bản sáng tạo, lập danh sách KOL/KOC phù hợp nhất và dự trù KPI cam kết rõ ràng.',
    iconName: 'FileText'
  },
  {
    id: 3,
    title: '3. Thực Thi Chiến Dịch',
    description: 'Bấm máy quay dựng sản xuất video, liên hệ KOL lên sóng đúng tiến độ và tiến hành seeding kiểm soát dư luận.',
    iconName: 'Zap'
  },
  {
    id: 4,
    title: '4. Báo Cáo & Tối Ưu',
    description: 'Tổng kết kết quả tiếp cận thực tế, phân tích tương tác, bàn giao tất cả tài nguyên hình ảnh và nghiệm thu dự án.',
    iconName: 'BarChart3'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Nguyễn Thị Ngọc Mai',
    role: 'Giám Đốc Thương Hiệu',
    brand: 'Nước Hoa Loli & The Wolf',
    content: 'TS Media đã giúp chiến dịch ra mắt mùi hương mới của chúng tôi đạt lượng tiếp cận 1.5M view vượt mức mong đợi kỳ vọng. Đội ngũ làm việc cực kỳ tốc độ, báo cáo rõ ràng và dàn KOC độc quyền sáng tạo rất tự nhiên.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'test-2',
    name: 'Hoàng Quốc Bảo',
    role: 'Nhà Sáng Lập',
    brand: 'Urbantoy Clothing',
    content: 'Dịch vụ chụp ảnh Lookbook và quay video ngắn của các bạn thực sự mang đẳng cấp khác biệt. Tinh tế từ layout trang điểm đến xử lý ánh sáng ngoại cảnh. Nhờ bộ hình sang xịn mịn này mà doanh thu BST mới tăng vọt 45%.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'test-3',
    name: 'Phạm Thuỳ Dương',
    role: 'Trưởng Phòng Truyền Thông',
    brand: 'Nội Thất Decox Design',
    content: 'Hài lòng nhất là tinh thần trách nghiệm cao trong khâu Seeding hội nhóm. Các bạn bám sát kịch bản, kiểm soát chặt chẽ các luồng ý kiến trái chiều, tạo uy tín mạnh giúp các hợp đồng nhà phố của bên mình tăng trưởng rõ rệt.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'pricing-basic',
    name: 'Gói Thử Nghiệm (Basic)',
    price: '15,000,000',
    period: 'chiến dịch',
    description: 'Thích hợp cho các nhãn hàng nội địa nhỏ muốn thử nghiệm hiệu quả của KOL/KOC.',
    isPopular: false,
    features: [
      'Booking 3 KOC (dưới 100k followers)',
      '1 Video ngắn (dưới 60s) độc quyền',
      'Định vị nhóm khách hàng mục tiêu',
      'Kịch bản nội dung cơ bản',
      'Báo cáo tổng lượng tương tác'
    ]
  },
  {
    id: 'pricing-standard',
    name: 'Gói Phủ Sóng (Standard)',
    price: '45,000,000',
    period: 'chiến dịch',
    description: 'Sự lựa chọn tốt nhất giúp đột phá doanh thu và bùng nổ nhận diện thương hiệu.',
    isPopular: true,
    features: [
      'Booking 8-10 KOC & 2 KOL hạng trung',
      'Quy trình sản xuất 01 Video TVC/Viral chất lượng',
      'Seeding 5 group lớn trong vòng 1 tuần',
      'Kịch bản sáng tạo chi tiết từng video',
      'Cam kết hiệu quả tối thiểu (đạt 80-100% KPI cam kết)',
      'Hỗ trợ quản lý phản hồi, xử lý thắc mắc'
    ]
  },
  {
    id: 'pricing-premium',
    name: 'Gói Đột Phá (Premium)',
    price: '120,000,000',
    period: 'chiến dịch',
    description: 'Chiến dịch tổng lực đa kênh giúp chiếm lĩnh thị phần và định hình thương hiệu vượt trội.',
    isPopular: false,
    features: [
      'Booking 3 KOL lớn & 25+ KOC phủ sóng',
      'Sản xuất 2 Video TVC điện ảnh chuyên nghiệp',
      'Tổ chức buổi chụp Lookbook ngoại cảnh 1 ngày',
      'Seeding diện rộng & độc quyền kịch bản sáng tạo',
      'Account Manager hỗ trợ 24/7 trực tiếp lý giải',
      'Cam kết KPI lưu lượng, lượt nhấp & tăng trưởng'
    ]
  }
];

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Quy trình lựa chọn KOL/KOC tại TS Media diễn ra thế nào?',
    answer: 'Chúng tôi sở hữu công cụ phân tích dữ liệu trực tiếp giúp rà soát nhân khẩu học, lượng người xem trung thành, tỉ lệ tương tác thật của KOL/KOC. Sau đó, chúng tôi đối chiếu với đối tượng mục tiêu của nhãn hàng để đưa ra danh sách đề xuất chuyển đổi tối ưu nhất, cam kết không dùng acc clone ảo.'
  },
  {
    id: 'faq-2',
    question: 'Chi phí trên bảng giá đã bao gồm cát-xê của KOL chưa?',
    answer: 'Các mức giá đề xuất phía trên là trọn gói (đã bao gồm chi phí booking KOL/KOC, tiền công ekip sản xuất, seeding phát sinh tùy gói hợp đồng). Trường hợp chiến dịch yêu cầu mời những KOL/Celeb cực lớn ngoài danh sách đề xuất, bộ phận tư vấn sẽ đàm phán thêm bảng báo giá chi tiết bổ sung.'
  },
  {
    id: 'faq-3',
    question: 'Dự án thông thường diễn ra trong bao lâu?',
    answer: 'Thời gian hoàn tất một chiến dịch chuẩn từ lúc tiếp nhận thông tin đến lúc bàn giao báo cáo rơi vào khoảng 15 - 30 ngày. Trong đó giai đoạn lên kế hoạch ký hợp đồng mất khoảng 3-5 ngày, khâu sản xuất kiểm duyệt clip mất 10-15 ngày, còn lại là giai đoạn launching đo lường số liệu.'
  },
  {
    id: 'faq-4',
    question: 'TS Media có cam kết doanh số bán ra hay chỉ cam kết lượt xem (Views)?',
    answer: 'Đối với influencer marketing, lượt xem và tương tác tự nhiên là các chỉ số cam kết trực tiếp (KPI cam kết). Ngoài ra, chúng tôi áp dụng mã giảm giá (Promo Code) hoặc link tiếp thị liên kết (Affiliate Link) cho mỗi KOC nhằm giúp thương hiệu theo dõi chính xác tỉ lệ đổi đơn hiệu quả tức thời.'
  },
  {
    id: 'faq-5',
    question: 'Làm sao nhãn hàng kiểm soát được kịch bản nội dung của KOL?',
    answer: 'Tất cả KOC/KOL tham gia chiến dịch bắt buộc phải tuân thủ Brand Guidelines của nhãn hàng. Ekip TS Media sẽ trực tiếp duyệt qua kế hoạch sáng tạo ý tưởng và toàn bộ bản thảo (Draft) video trước khi đăng tải để giữ cho thương hiệu luôn trong trạng thái an toàn hình ảnh tốt nhất.'
  }
];

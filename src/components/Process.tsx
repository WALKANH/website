import { MessageSquareText, FileText, Zap, BarChart3, HelpCircle } from 'lucide-react';
import { ProcessStep } from '../types';

interface ProcessProps {
  steps: ProcessStep[];
}

export default function Process({ steps }: ProcessProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'MessageSquareText':
        return <MessageSquareText className="w-6 h-6 text-white" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-white" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-white" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-white" />;
      default:
        return <HelpCircle className="w-6 h-6 text-white" />;
    }
  };

  return (
    <section id="process" className="py-24 bg-[#111111] text-white relative overflow-hidden">
      {/* Decorative ambient blurred blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#E8401C] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#E8401C]">
              Quy Trình Làm Việc
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Lộ Trình Hợp Tác Chuyên Nghiệp
          </h2>
          <div className="w-20 h-1 bg-[#E8401C] mx-auto mb-5 rounded-full"></div>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Tiết kiệm tối đa thời gian và chi phí của khách hàng nhờ quy trình triển khai chặt chẽ, được chuẩn hóa từng giai đoạn.
          </p>
        </div>

        {/* Timeline body wrapper */}
        <div className="relative">
          
          {/* Timeline Connector Line (Desktop display only) */}
          <div className="hidden lg:block absolute top-[43px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#E8401C] via-[#F5C518] to-[#E8401C] z-0 rounded-full"></div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10 w-full">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center lg:items-start text-center lg:text-left group"
              >
                
                {/* Timeline Node Badge Sphere */}
                <div className="relative w-22 h-22 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center justify-center mb-6 group-hover:border-[#E8401C] transition-all duration-300 shadow-2xl self-center lg:self-start">
                  
                  {/* Decorative numeric floating digit */}
                  <div className="absolute -top-2.5 -right-2.5 bg-[#E8401C] text-white text-[10px] font-black w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-[#E8401C]/35 uppercase">
                    0{step.id}
                  </div>

                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl bg-[#E8401C] flex items-center justify-center shadow-lg shadow-[#E8401C]/35 group-hover:scale-110 transition-transform duration-300">
                    {getIcon(step.iconName)}
                  </div>
                </div>

                {/* Bullet Content Detail Text */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#E8401C] transition-colors duration-200">
                  {step.title}
                </h3>

                <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
                  {step.description}
                </p>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

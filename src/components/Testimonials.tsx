import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // rotates every 5 seconds

    return () => clearInterval(timer);
  }, [isHovered, testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-[#0b0b0b] overflow-hidden relative border-b border-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] bg-[#E8401C]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#E8401C] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#E8401C]">
              Cảm Nhận Khách Hàng
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Dấu Ấn Tin Cậy Từ Đối Tác
          </h2>
          <div className="w-20 h-1 bg-[#E8401C] mx-auto mb-5 rounded-full"></div>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Sự thành công của các thương hiệu chính là thước đo năng lực chuẩn xác nhất của TS Media Agency.
          </p>
        </div>

        {/* Carousel Visual Frame Card */}
        <div className="bg-white/[0.03] border border-white/10 p-8 sm:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative w-full">
          
          {/* Quote large watermark symbol */}
          <div className="absolute top-6 right-8 text-[#E8401C]/5 font-serif">
            <Quote className="w-16 h-16 opacity-35 text-[#E8401C]/10 animate-pulse-slow" />
          </div>

          {/* Testimonial Active Slide */}
          <div className="relative z-10 text-left">
            
            {/* Star ratings */}
            <div className="flex items-center gap-1 mb-6 justify-center sm:justify-start">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#F5C518] text-[#F5C518] shrink-0" />
              ))}
            </div>

            {/* Quote feedback */}
            <p className="text-white/80 text-base sm:text-lg italic leading-relaxed font-normal mb-8 text-center sm:text-left">
              "{testimonials[activeIndex].content}"
            </p>

            {/* Client Bio section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6 mt-4">
              
              <div className="flex items-center gap-4.5">
                {/* Avatar model image */}
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#E8401C]/20 shadow-lg"
                />
                <div className="flex flex-col text-center sm:text-left">
                  <span className="font-bold text-white text-base">
                    {testimonials[activeIndex].name}
                  </span>
                  <span className="text-white/55 text-xs font-semibold">
                    {testimonials[activeIndex].role} — <span className="text-[#E8401C]">{testimonials[activeIndex].brand}</span>
                  </span>
                </div>
              </div>

              {/* Slider Manual Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-prev-test"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#E8401C] border border-white/10 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5 shrink-0" />
                </button>
                <button
                  id="btn-next-test"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#E8401C] border border-white/10 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Carousel Slide Indicators bullets */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-8 bg-[#E8401C]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>

      </div>
    </section>
  );
}

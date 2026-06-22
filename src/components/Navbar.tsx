import { useState, useEffect, MouseEvent } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onScrollToContact: () => void;
}

export default function Navbar({ onScrollToContact }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dịch vụ', href: '#services', id: 'services' },
    { name: 'Portfolio', href: '#portfolio', id: 'portfolio' },
    { name: 'Quy trình', href: '#process', id: 'process' },
    { name: 'Bảng giá', href: '#pricing', id: 'pricing' },
    { name: 'Liên hệ', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Background scroll class
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Intersection detection for links
      const scrollPosition = window.scrollY + 200;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
      if (window.scrollY < 100) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // height of sticky navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveSection(targetId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveSection('hero');
            }}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-[#E8401C] w-12 h-12 flex items-center justify-center rounded-lg font-black text-2xl tracking-tighter text-white shadow-[0_0_20px_rgba(232,64,28,0.5)] group-hover:scale-105 transition-all duration-300">
              TS
            </div>
            <div className="leading-none text-left">
              <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-brand-red transition-colors duration-300">TieuSong Media</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">& Services Agency</p>
            </div>
          </a>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center space-x-8 text-white/70">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`font-medium text-sm tracking-wide transition-all duration-300 relative py-1 hover:text-brand-red ${
                  activeSection === link.id
                    ? 'text-brand-red'
                    : 'text-white/70'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Header Button */}
          <div className="hidden md:block">
            <button
              id="cta-navbar"
              onClick={onScrollToContact}
              className="bg-[#E8401C] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white hover:text-[#111111] transition-all shadow-lg shadow-[#E8401C]/20 hover:scale-[1.03] active:scale-[0.97]"
            >
              Nhận Tư Vấn
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 stroke-[2.5]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[2.5]" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 top-[69px] z-40 bg-[#111111] transition-all duration-300 transform ${
          mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        } border-t border-white/5`}
      >
        <div className="px-5 pt-8 pb-12 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`block px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-[#E8401C]/10 text-[#E8401C] border-l-4 border-[#E8401C] pl-3'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 px-4">
            <button
              id="cta-mobile-contact"
              onClick={() => {
                onScrollToContact();
                setMobileMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 shadow-lg bg-[#E8401C] hover:bg-white hover:text-black rounded-full text-white font-bold transition-all duration-300 shadow-[#E8401C]/20"
            >
              Nhận Tư Vấn Miễn Phí
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

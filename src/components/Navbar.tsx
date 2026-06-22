import { useState, useEffect, MouseEvent } from 'react';
import { Menu, X, ArrowRight, User as UserIcon, LogOut, Sparkles, Database } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, logoutUser, isAdmin } from '../lib/firebase';
import AuthModal from './AuthModal';

interface NavbarProps {
  onScrollToContact: () => void;
  isAdminDashboardOpen: boolean;
  onToggleAdminDashboard: (isOpen: boolean) => void;
}

export default function Navbar({ onScrollToContact, isAdminDashboardOpen, onToggleAdminDashboard }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

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
              onToggleAdminDashboard(false);
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
                onClick={(e) => {
                  onToggleAdminDashboard(false);
                  handleLinkClick(e, link.id);
                }}
                className={`font-medium text-sm tracking-wide transition-all duration-300 relative py-1 hover:text-brand-red ${
                  !isAdminDashboardOpen && activeSection === link.id
                    ? 'text-brand-red'
                    : 'text-white/70'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Dashboard button placed next to "Liên hệ" */}
            {currentUser && isAdmin(currentUser.email) && (
              <button
                onClick={() => onToggleAdminDashboard(!isAdminDashboardOpen)}
                className={`font-extrabold text-sm tracking-wide transition-all duration-300 py-1 flex items-center gap-1.5 cursor-pointer relative ${
                  isAdminDashboardOpen ? 'text-[#F5C518] hover:text-[#F5C518]/90' : 'text-amber-500 hover:text-amber-400'
                }`}
              >
                <Database className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Dashboard Admin</span>
                <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8401C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8401C]"></span>
                </span>
              </button>
            )}
          </div>

          {/* CTA Header Button */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className={`flex items-center gap-3 bg-white/5 border ${isAdmin(currentUser.email) ? 'border-[#F5C518]/30 bg-[#F5C518]/5 shadow-[0_0_15px_rgba(245,197,24,0.05)]' : 'border-white/10'} px-4 py-1.5 rounded-full`}>
                <div className={`${isAdmin(currentUser.email) ? 'bg-[#F5C518]/25 border border-[#F5C518]/40 text-[#F5C518]' : 'bg-[#E8401C]/20 border border-[#E8401C]/35 text-[#E8401C]'} w-7 h-7 flex items-center justify-center rounded-full font-extrabold text-[#E8401C] text-xs uppercase`}>
                  {currentUser.displayName ? currentUser.displayName[0] : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-white leading-none whitespace-nowrap">{currentUser.displayName || 'Thành Viên'}</p>
                  {isAdmin(currentUser.email) && (
                    <span className="inline-block text-[8px] uppercase tracking-wider text-[#F5C518] font-black mt-0.5 animate-pulse">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    onToggleAdminDashboard(false);
                  }}
                  title="Đăng xuất"
                  className="text-white/40 hover:text-white p-1 rounded transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-all"
              >
                Đăng Nhập
              </button>
            )}

            <button
              id="cta-navbar"
              onClick={(e) => {
                onToggleAdminDashboard(false);
                onScrollToContact();
              }}
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
              onClick={(e) => {
                onToggleAdminDashboard(false);
                handleLinkClick(e, link.id);
              }}
              className={`block px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                !isAdminDashboardOpen && activeSection === link.id
                  ? 'bg-[#E8401C]/10 text-[#E8401C] border-l-4 border-[#E8401C] pl-3'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}

          {currentUser && isAdmin(currentUser.email) && (
            <button
              onClick={() => {
                onToggleAdminDashboard(!isAdminDashboardOpen);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isAdminDashboardOpen
                  ? 'bg-amber-500/10 text-amber-500 border-l-4 border-amber-500 pl-3'
                  : 'text-amber-500 hover:bg-white/5 hover:text-amber-400'
              }`}
            >
              <Database className="w-5 h-5" />
              <span>Dashboard Admin</span>
            </button>
          )}

          <div className="pt-6 px-4 space-y-3">
            {currentUser ? (
              <div className={`p-4 bg-white/5 border ${isAdmin(currentUser.email) ? 'border-[#F5C518]/30 bg-[#F5C518]/5 shadow-inner' : 'border-white/10'} rounded-2xl flex items-center justify-between text-left`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${isAdmin(currentUser.email) ? 'bg-[#F5C518]/25 text-[#F5C518] font-black border border-[#F5C518]/30' : 'bg-[#E8401C]/20 text-[#E8401C]'} flex items-center justify-center font-bold text-sm uppercase`}>
                    {currentUser.displayName ? currentUser.displayName[0] : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs text-white font-extrabold">{currentUser.displayName || currentUser.email}</p>
                    <p className="text-[9px] uppercase font-bold text-white/45 tracking-widest">
                      {isAdmin(currentUser.email) ? '🔑 Administrator' : 'Đã đăng nhập'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    onToggleAdminDashboard(false);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-white/5 hover:bg-[#E8401C]/10 border border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer"
              >
                Đăng Nhập / Đăng Ký
              </button>
            )}

            <button
              id="cta-mobile-contact"
              onClick={() => {
                onToggleAdminDashboard(false);
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

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => setCurrentUser(user)} 
      />
    </nav>
  );
}

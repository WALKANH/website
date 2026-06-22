import { useState, FormEvent } from 'react';
import { Mail, Lock, User as UserIcon, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginUserWithEmail, registerUserWithEmail, loginWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await loginWithGoogle();
      if (result) {
        onSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      console.error('Lỗi khi đăng nhập bằng Google:', err);
      setAuthError('Đăng nhập Google không thành công. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    if (isSignUp && !fullName) {
      setAuthError('Vui lòng cung cấp họ và tên.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      let loggedUser;
      if (isSignUp) {
        loggedUser = await registerUserWithEmail(email, password, fullName);
      } else {
        loggedUser = await loginUserWithEmail(email, password);
      }
      onSuccess(loggedUser);
      onClose();
    } catch (err: any) {
      console.error('Authentication Error:', err);
      // Friendly messages for users
      const code = err.code || '';
      if (code.includes('email-already-in-use')) {
        setAuthError('Email này đã được sử dụng bởi một tài khoản khác.');
      } else if (code.includes('weak-password')) {
        setAuthError('Mật khẩu yếu. Vui lòng chọn ít nhất 6 ký tự.');
      } else if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setAuthError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      } else if (code.includes('invalid-email')) {
        setAuthError('Định dạng email không chính xác.');
      } else {
        setAuthError('Có lỗi xảy ra. Hãy kiểm tra lại thông tin đăng nhập.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Absolute Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Auth Card container */}
      <div className="relative w-full max-w-md bg-[#0e0e10] border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(232,64,28,0.15)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow effect decorative */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#E8401C]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#F5C518]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Title & Badge */}
        <div className="text-center space-y-2 mb-8 mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8401C]/10 text-[#E8401C] border border-[#E8401C]/20 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TS Media Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Tạo Tài Khoản Mới' : 'Chào Mừng Trở Lại'}
          </h2>
          <p className="text-xs text-white/50">
            {isSignUp ? 'Nhận báo giá dự án & tương tác trực tiếp nhanh nhất' : 'Đăng nhập để cập nhật tình hình các chiến dịch của bạn'}
          </p>
        </div>

        {authError && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-semibold text-center leading-relaxed">
            {authError}
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Họ và tên của bạn</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E8401C]/60 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#E8401C]/60 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={isSignUp ? 'Tạo mật khẩu an toàn...' : 'Nhập mật khẩu...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-[#E8401C]/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#E8401C] hover:bg-[#ff512d] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_15px_rgba(232,64,28,0.2)] mt-5 cursor-pointer"
          >
            {isLoading ? 'Đang thực hiện...' : isSignUp ? 'Tạo tài khoản thành viên' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-x-0 h-px bg-white/5"></div>
          <span className="relative px-3 bg-[#0e0e10] text-[10px] uppercase font-bold text-white/30">Hoặc tiếp tục với</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Hợp nhất bằng Google
        </button>

        {/* Change auth mode */}
        <div className="mt-6 text-center text-xs">
          <span className="text-white/40">
            {isSignUp ? 'Đã có tài khoản tại TS Media? ' : 'Chưa có tài khoản tư vấn? '}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError(null);
            }}
            className="text-[#E8401C] hover:underline font-bold transition-all"
          >
            {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
          </button>
        </div>

      </div>
    </div>
  );
}

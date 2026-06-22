import { useState, useEffect } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  RefreshCw, 
  ExternalLink, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  Mail, 
  Phone,
  Search,
  Filter,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Download
} from 'lucide-react';
import { 
  initAuth, 
  loginWithGoogle, 
  logoutFromGoogle, 
  fetchLeadsFromFirestore, 
  createGoogleSheet, 
  syncLeadsToGoogleSheet,
  isAdmin 
} from '../lib/firebase';
import { User } from 'firebase/auth';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(
    localStorage.getItem('admin_sheet_id')
  );
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(
    localStorage.getItem('admin_sheet_url')
  );
  
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    kolCount: 0,
    productionCount: 0,
    marketingCount: 0,
    otherCount: 0,
    todayCount: 0
  });

  // Initialize auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        if (currentUser && isAdmin(currentUser.email)) {
          setIsOpen(true);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIsOpen(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch leads when open or auth changes
  useEffect(() => {
    if (isOpen && user && isAdmin(user.email)) {
      loadLeads();
    }
  }, [isOpen, user]);

  // Handle local searching & filtering of lead lists
  useEffect(() => {
    let result = leads;

    if (selectedServiceFilter !== 'all') {
      result = result.filter(lead => {
        const leadService = (lead.service || '').toLowerCase();
        if (selectedServiceFilter === 'kol') return leadService.includes('kol') || leadService.includes('koc');
        if (selectedServiceFilter === 'production') return leadService.includes('production') || leadService.includes('quay') || leadService.includes('video');
        if (selectedServiceFilter === 'marketing') return leadService.includes('ads') || leadService.includes('marketing') || leadService.includes('camp');
        return !leadService.includes('kol') && !leadService.includes('koc') && !leadService.includes('production') && !leadService.includes('quay') && !leadService.includes('video') && !leadService.includes('ads') && !leadService.includes('marketing');
      });
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(lead => 
        (lead.name || '').toLowerCase().includes(q) || 
        (lead.phone || '').toLowerCase().includes(q) || 
        (lead.email || '').toLowerCase().includes(q) ||
        (lead.message || '').toLowerCase().includes(q)
      );
    }

    setFilteredLeads(result);
  }, [leads, searchQuery, selectedServiceFilter]);

  const calculateStats = (allLeads: any[]) => {
    const todayStr = new Date().toDateString();
    
    let kol = 0;
    let prod = 0;
    let mkt = 0;
    let other = 0;
    let today = 0;

    allLeads.forEach(lead => {
      const s = (lead.service || '').toLowerCase();
      if (s.includes('kol') || s.includes('koc')) kol++;
      else if (s.includes('production') || s.includes('quay') || s.includes('video')) prod++;
      else if (s.includes('ads') || s.includes('marketing') || s.includes('camp')) mkt++;
      else other++;

      if (lead.createdAt && new Date(lead.createdAt).toDateString() === todayStr) {
        today++;
      }
    });

    setStats({
      total: allLeads.length,
      kolCount: kol,
      productionCount: prod,
      marketingCount: mkt,
      otherCount: other,
      todayCount: today
    });
  };

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const dbLeads = await fetchLeadsFromFirestore();
      setLeads(dbLeads);
      calculateStats(dbLeads);
    } catch (error) {
      console.error('Không thể nạp danh sách liên hệ:', error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        loadLeads();
      }
    } catch (error) {
      console.error('Không thể đăng nhập:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFromGoogle();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  const handleSyncToSheets = async () => {
    if (!accessToken) {
      alert('Vui lòng kết nối tài khoản Google trước.');
      return;
    }

    setIsSyncing(true);
    setSyncSuccess(false);

    try {
      let currentSheetId = spreadsheetId;
      let currentSheetUrl = spreadsheetUrl;

      // 1. Create sheet if not exists
      if (!currentSheetId) {
        const confirmCreate = window.confirm(
          'Không tìm thấy Google Sheet liên kết cũ. Bạn có muốn tạo một Google Sheet mới không?'
        );
        if (!confirmCreate) {
          setIsSyncing(false);
          return;
        }

        const newSheet = await createGoogleSheet(accessToken);
        currentSheetId = newSheet.id;
        currentSheetUrl = newSheet.url;

        setSpreadsheetId(currentSheetId);
        setSpreadsheetUrl(currentSheetUrl);
        localStorage.setItem('admin_sheet_id', currentSheetId);
        localStorage.setItem('admin_sheet_url', currentSheetUrl);
      }

      // 2. Refresh leads first from db
      const freshLeads = await fetchLeadsFromFirestore();
      setLeads(freshLeads);
      calculateStats(freshLeads);

      // 3. Sync all leads to google spreadsheet
      await syncLeadsToGoogleSheet(currentSheetId, freshLeads, accessToken);

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    } catch (error) {
      console.error('Lỗi đồng bộ:', error);
      alert('Có lỗi xảy ra trong quá trình đồng bộ Google Sheets. Vui lòng thử lại!');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!accessToken) return;
    const confirmCreate = window.confirm(
      'Bạn có chắc chắn muốn tạo thêm một bảng tính Google Sheets mới không?'
    );
    if (!confirmCreate) return;

    setIsSyncing(true);
    try {
      const newSheet = await createGoogleSheet(accessToken);
      setSpreadsheetId(newSheet.id);
      setSpreadsheetUrl(newSheet.url);
      localStorage.setItem('admin_sheet_id', newSheet.id);
      localStorage.setItem('admin_sheet_url', newSheet.url);
      
      // Sync fresh data inside
      const freshLeads = await fetchLeadsFromFirestore();
      await syncLeadsToGoogleSheet(newSheet.id, freshLeads, accessToken);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    } catch (error) {
      console.error('Tạo bảng tính mới thất bại:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Secure Local CSV Safe Downloader
  const downloadLocalCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Thời gian gửi', 'Họ và Tên', 'Số Điện Thoại', 'Email', 'Dịch Vụ Quan Tâm', 'Lời nhắn / Mô tả'];
    const rows = leads.map(lead => [
      lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN') : '',
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `="${lead.phone || ''}"`, // format phone to prevent auto leading zero-dropping in Excel
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.service || '').replace(/"/g, '""')}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`
    ]);

    // Use BOM to prevent Vietnamese font corruption in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Contact_List_TS_Media_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user || !isAdmin(user.email)) {
    return null;
  }

  return (
    <div id="admin-panel" className="border-t border-white/10 bg-[#0c0c0d] font-sans relative z-20">
      {/* Glow highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8401C]/50 to-transparent"></div>

      {/* Main Admin Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E8401C]/10 border border-[#E8401C]/20 rounded-xl">
            <Database className="w-5 h-5 text-[#E8401C]" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              Bảng Sếp Hỗ Trợ Đăng Ký Hệ Thống TS Media
              <span className="inline-block w-2-h-2 bg-green-500 rounded-full animate-ping"></span>
            </h4>
            <p className="text-xs text-white/50">
              {leads.length > 0 ? `Đang lưu giữ ${leads.length} liên hệ đăng ký trên Firestore Cloud` : 'Dữ liệu được lưu trữ tự động trên Cloud Firestore bảo mật'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E8401C]/10 hover:bg-[#E8401C]/20 text-[#E8401C] border border-[#E8401C]/30 text-xs font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(232,64,28,0.05)] hover:shadow-[0_0_20px_rgba(232,64,28,0.15)]"
        >
          {isOpen ? (
            <>
              <span>Thu nhỏ bảng quản trị</span>
              <ChevronUp className="w-4 h-4 shrink-0" />
            </>
          ) : (
            <>
              <span>Mở Bảng Admin & Cấu hình Trang Tính</span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="bg-[#0e0e10] border-t border-white/5 pb-16 pt-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Visual KPI dashboard inside standard view */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-12 h-12 text-[#E8401C]" />
                </div>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Tổng Đăng Ký</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.total}</span>
                  <span className="text-[10px] text-green-400 font-bold bg-green-400/10 px-1.5 py-0.5 rounded">Real-time</span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="w-12 h-12 text-[#F2994A]" />
                </div>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">KOLs/KOCs Booking</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.kolCount}</span>
                  <p className="text-[9px] text-white/50">{stats.total > 0 ? `${Math.round((stats.kolCount / stats.total) * 100)}%` : '0%'}</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <TrendingUp className="w-12 h-12 text-[#2F80ED]" />
                </div>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Production & Video</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.productionCount}</span>
                  <p className="text-[9px] text-white/50">{stats.total > 0 ? `${Math.round((stats.productionCount / stats.total) * 100)}%` : '0%'}</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Award className="w-12 h-12 text-[#27AE60]" />
                </div>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Chạy Ads/Marketing</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.marketingCount}</span>
                  <p className="text-[9px] text-white/50">{stats.total > 0 ? `${Math.round((stats.marketingCount / stats.total) * 100)}%` : '0%'}</p>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Calendar className="w-12 h-12 text-[#E8401C]" />
                </div>
                <p className="text-[10px] uppercase font-bold text-[#E8401C] tracking-wider">Đăng Ký Hôm Nay</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.todayCount}</span>
                  <span className="text-[10px] text-[#E8401C] font-extrabold animate-pulse">HOT</span>
                </div>
              </div>
            </div>

            {/* Upper Action Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left col: Google Sheets connection controller */}
              <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-6 text-left relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold tracking-wider text-[#F5C518] uppercase">
                    Cấu hình Google Sheets
                  </h3>
                  {user ? (
                    <span className="flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">
                      <Unlock className="w-3 h-3" /> Đã kết nối
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] bg-red-500/10 text-red-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-red-500/20">
                      <Lock className="w-3 h-3" /> Chưa đồng bộ
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Đồng bộ dữ liệu thời gian thực sang trang tính Google Sheets của bạn. Dữ liệu được đẩy ngay để nhóm sales xử lý tức thì.
                </p>

                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10 referrerPolicy='no-referrer'" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E8401C]/20 text-[#E8401C] flex items-center justify-center">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-white truncate">{user.displayName || 'Google Specialist'}</p>
                        <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-white/40 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                        title="Đăng xuất khỏi Google"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleSyncToSheets}
                        disabled={isSyncing}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#E8401C] hover:bg-[#ff512d] disabled:opacity-50 text-white text-xs font-bold transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(232,64,28,0.2)]"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Đang cập nhật trang tính...' : 'Đẩy ngay sang Google Sheets'}
                      </button>

                      {spreadsheetUrl && (
                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                            Spreadsheet đang liên kết:
                          </p>
                          <a
                            href={spreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#E8401C] underline font-bold transition-all break-all"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-[#34A853] shrink-0" />
                            <span>Mở Bảng Tính Online</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>

                          <div className="pt-3 border-t border-white/5 flex gap-4 justify-between items-center text-[10px]">
                            <span className="text-white/30 font-medium">Bạn muốn đổi sheet?</span>
                            <button
                              onClick={handleCreateNewSheet}
                              className="text-[#F5C518] hover:underline font-bold"
                            >
                              Tạo Google Sheet mới
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white text-black hover:bg-gray-100 text-xs font-black transition-all cursor-pointer shadow-lg"
                  >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Liên Kết Với Google Workspace</span>
                  </button>
                )}

                {syncSuccess && (
                  <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold text-center animate-pulse">
                    🚀 Đã đồng bộ toàn bộ liên hệ sang Google Sheet thành công!
                  </div>
                )}
              </div>

              {/* Right col: Real-time Database entries table preview */}
              <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
                
                {/* Search & Filter bar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Nhật ký khách hàng đăng ký
                    </h3>
                    <p className="text-[10px] text-white/40 font-medium">Hiện có {filteredLeads.length} liên hệ khớp bộ lọc</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {leads.length > 0 && (
                      <button
                        onClick={downloadLocalCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold border border-white/10 transition-all cursor-pointer"
                        title="Tải tệp CSV về máy"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>Xuất tệp CSV</span>
                      </button>
                    )}

                    <button
                      onClick={loadLeads}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                      title="Làm mới danh sách"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Sub Filters controls row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm tên, số điện thoại, email hoặc ghi chú..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E8401C]/60 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-4 relative">
                    <Filter className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedServiceFilter}
                      onChange={(e) => setSelectedServiceFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#E8401C]/60 transition-all cursor-pointer appearance-none"
                    >
                      <option value="all" className="bg-[#111] text-white">Tất cả dịch vụ</option>
                      <option value="kol" className="bg-[#111] text-white">Booking KOL/KOC</option>
                      <option value="production" className="bg-[#111] text-white">Vận hành Production</option>
                      <option value="marketing" className="bg-[#111] text-white">Ads, Content & Mkt</option>
                      <option value="other" className="bg-[#111] text-white">Khác</option>
                    </select>
                  </div>
                </div>

                {isLoadingLeads ? (
                  <div className="py-24 flex flex-col items-center justify-center text-white/40 gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#E8401C]" />
                    <span className="text-xs font-semibold">Đang liên kết dữ liệu Firestore...</span>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 gap-3">
                    <Database className="w-8 h-8 opacity-40 text-gray-500" />
                    <span className="text-xs font-semibold">Không tìm thấy thông tin đăng ký nào khớp bộ lọc</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/45 max-h-[300px]">
                    <table className="w-full text-left text-xs text-white/80 border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/15 text-[10px] text-white/50 uppercase font-bold tracking-wider">
                          <th className="py-3 px-4">Tên Khách Hàng</th>
                          <th className="py-3 px-4">Đăng Ký Khóa</th>
                          <th className="py-3 px-4">Thông tin Liên Hệ</th>
                          <th className="py-3 px-4">Lời nhắn / Ghi chú</th>
                          <th className="py-3 px-4">Ngày gửi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, idx) => (
                          <tr key={lead.id || idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 font-extrabold text-white">{lead.name}</td>
                            <td className="py-4 px-4">
                              <span className="inline-block px-2.5 py-1 rounded bg-[#E8401C]/10 text-[#E8401C] border border-[#E8401C]/20 font-bold text-[10px]">
                                {lead.service}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono space-y-1 text-white/90">
                              {lead.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-white/30" /> {lead.phone}</div>}
                              {lead.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-white/30" /> <span className="underline">{lead.email}</span></div>}
                            </td>
                            <td className="py-4 px-4 text-white/70 italic text-[11px] max-w-xs truncate" title={lead.message}>
                              {lead.message || 'Không có ghi chú'}
                            </td>
                            <td className="py-4 px-4 text-white/40">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Vừa gửi'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

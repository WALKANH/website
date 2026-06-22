import React, { useState, useEffect, useRef } from 'react';
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
  Download,
  Trash2,
  CheckCircle,
  X,
  AlertTriangle,
  FileText,
  MessageSquare,
  Volume2,
  Plus
} from 'lucide-react';
import { 
  initAuth, 
  loginWithGoogle, 
  logoutFromGoogle, 
  createGoogleSheet, 
  syncLeadsToGoogleSheet,
  isAdmin 
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

interface AdminPanelProps {
  isFullPage?: boolean;
  onBackToHome?: () => void;
}

export default function AdminPanel({ isFullPage = false, onBackToHome }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(isFullPage);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  useEffect(() => {
    if (isFullPage) {
      setIsOpen(true);
    }
  }, [isFullPage]);
  
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(
    localStorage.getItem('admin_sheet_id')
  );
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(
    localStorage.getItem('admin_sheet_url')
  );
  
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // CRM details & Internal memos modal state
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [internalMemo, setInternalMemo] = useState('');
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  // Manual Add Lead Form states
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Booking KOL/KOC',
    message: '',
    adminMemo: ''
  });
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  // Real-time notification toast queue
  const [newLeadToast, setNewLeadToast] = useState<any | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Offline unsynced queue from localStorage
  const [offlineLeads, setOfflineLeads] = useState<any[]>([]);
  const [isSyncingOfflineQueue, setIsSyncingOfflineQueue] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    kolCount: 0,
    productionCount: 0,
    marketingCount: 0,
    otherCount: 0,
    todayCount: 0,
    newCount: 0,
    processingCount: 0,
    completedCount: 0,
    declinedCount: 0
  });

  // Track known lead IDs to prevent triggering bells on initial fetch
  const knownLeadIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Generate a crystal clear, high-end 3-note notification arpeggio
  const playNotificationSound = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number, type: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      // Friendly major arpeggio
      playTone(523.25, now, 0.25); // C5
      playTone(659.25, now + 0.1, 0.25); // E5
      playTone(783.99, now + 0.2, 0.45); // G5
    } catch (e) {
      console.warn('Cannot synthesize notification chime:', e);
    }
  };

  const [testSoundToast, setTestSoundToast] = useState(false);

  // Sound Test Trigger
  const testAlertSound = () => {
    playNotificationSound();
    setTestSoundToast(true);
    setTimeout(() => setTestSoundToast(false), 3500);
  };

  // Dynamically group lead submissions by date for the last 7 days
  const getSubmissionsOverTime = () => {
    const datesMap: { [key: string]: number } = {};
    // Seed last 10 days with 0
    for (let i = 9; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      datesMap[dateStr] = 0;
    }

    leads.forEach(lead => {
      if (!lead.createdAt) return;
      const date = lead.createdAt.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);
      const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      if (datesMap[dateStr] !== undefined) {
        datesMap[dateStr]++;
      }
    });

    return Object.keys(datesMap).map(key => ({
      name: key,
      'Số đăng ký': datesMap[key]
    }));
  };

  const getServiceDataForChart = () => {
    return [
      { name: 'KOL/KOC', value: stats.kolCount, color: '#E8401C' },
      { name: 'Production', value: stats.productionCount, color: '#F5C518' },
      { name: 'Marketing Ads', value: stats.marketingCount, color: '#2D9CDB' },
      { name: 'Thử Nghiệm', value: stats.otherCount, color: '#8b5cf6' }
    ].filter(item => item.value > 0);
  };

  const getPipelineStatusData = () => {
    return [
      { name: 'Mới', value: stats.newCount || 0, color: '#ef4444' },
      { name: 'Đang xử lý', value: stats.processingCount || 0, color: '#f59e0b' },
      { name: 'Hẹn gặp', value: stats.completedCount || 0, color: '#10b981' },
      { name: 'Từ chối', value: stats.declinedCount || 0, color: '#6b7280' }
    ];
  };

  // Initialize Auth handler
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

  // Monitor offline leads backlog from client side
  const checkOfflineBacklog = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('ts_offline_leads') || '[]');
      setOfflineLeads(stored);
    } catch (e) {
      setOfflineLeads([]);
    }
  };

  useEffect(() => {
    checkOfflineBacklog();
  }, [isOpen]);

  // Sync offline leads backlog
  const handleSyncOfflineBacklog = async () => {
    if (offlineLeads.length === 0) return;
    setIsSyncingOfflineQueue(true);
    try {
      const batch = writeBatch(db);
      offlineLeads.forEach((lead) => {
        // Create document inside 'leads'
        const newRef = doc(collection(db, 'leads'));
        batch.set(newRef, {
          ...lead,
          createdAt: lead.createdAt || new Date().toISOString(),
          status: lead.status || 'Mới',
          syncFlag: 'recovered_offline'
        });
      });

      await batch.commit();
      localStorage.setItem('ts_offline_leads', '[]');
      setOfflineLeads([]);
      alert(`🎉 Đã khôi phục và truyền tải thành công ${offlineLeads.length} lead lưu trữ phụ sang đám mây Google Firestore!`);
    } catch (err) {
      console.error('Lỗi truyền tải offline backup:', err);
      alert('Không thể tải dữ liệu offline lên Firestore. Vui lòng kiểm tra lại đường truyền mạng.');
    } finally {
      setIsSyncingOfflineQueue(false);
    }
  };

  // Real-time Firestore Stream Subscriptions inside Admin Dashboard
  useEffect(() => {
    if (!isOpen || !user || !isAdmin(user.email)) return;

    setIsLoadingLeads(true);

    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    
    const unsubscribeListener = onSnapshot(
      q,
      (snapshot) => {
        const docs: any[] = [];
        const currentIds = new Set<string>();
        let brandNewLead: any = null;

        snapshot.forEach((snapDoc) => {
          const data = { ...snapDoc.data(), id: snapDoc.id };
          docs.push(data);
          currentIds.add(snapDoc.id);
        });

        // Detect new incoming entries (CRM Alerts)
        if (!isInitialLoadRef.current) {
          // If we had leads, find which item in currentIds is not in our known list
          const pendingNewLeads = docs.filter(item => !knownLeadIdsRef.current.has(item.id));
          if (pendingNewLeads.length > 0) {
            brandNewLead = pendingNewLeads[0];
          }
        }

        // Fill known references for next iterations
        knownLeadIdsRef.current = currentIds;
        isInitialLoadRef.current = false;

        setLeads(docs);
        calculateStats(docs);
        setIsLoadingLeads(false);

        // Raise notification toast and sound if a fresh entry arrives
        if (brandNewLead) {
          setNewLeadToast(brandNewLead);
          playNotificationSound();
          // Hide toast auto after 12s
          const t = setTimeout(() => {
            setNewLeadToast(null);
          }, 12000);
        }
      },
      (error) => {
        console.error('Lỗi đồng bộ trực tiếp Firestore:', error);
        setIsLoadingLeads(false);
      }
    );

    return () => {
      unsubscribeListener();
      isInitialLoadRef.current = true;
      knownLeadIdsRef.current.clear();
    };
  }, [isOpen, user]);

  // Handle local searching, filtering of lead lists
  useEffect(() => {
    let result = leads;

    // 1. Service Filtration
    if (selectedServiceFilter !== 'all') {
      result = result.filter(lead => {
        const leadService = (lead.service || '').toLowerCase();
        if (selectedServiceFilter === 'kol') return leadService.includes('kol') || leadService.includes('koc');
        if (selectedServiceFilter === 'production') return leadService.includes('production') || leadService.includes('quay') || leadService.includes('video');
        if (selectedServiceFilter === 'marketing') return leadService.includes('ads') || leadService.includes('marketing') || leadService.includes('camp') || leadService.includes('content') || leadService.includes('seeding');
        return !leadService.includes('kol') && !leadService.includes('koc') && !leadService.includes('production') && !leadService.includes('quay') && !leadService.includes('video') && !leadService.includes('ads') && !leadService.includes('marketing') && !leadService.includes('content') && !leadService.includes('seeding');
      });
    }

    // 2. Status Filtration
    if (selectedStatusFilter !== 'all') {
      result = result.filter(lead => (lead.status || 'Mới').toLowerCase() === selectedStatusFilter.toLowerCase());
    }

    // 3. Keyword Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(lead => 
        (lead.name || '').toLowerCase().includes(q) || 
        (lead.phone || '').toLowerCase().includes(q) || 
        (lead.email || '').toLowerCase().includes(q) ||
        (lead.message || '').toLowerCase().includes(q) ||
        (lead.adminMemo || '').toLowerCase().includes(q)
      );
    }

    setFilteredLeads(result);
  }, [leads, searchQuery, selectedServiceFilter, selectedStatusFilter]);

  const calculateStats = (allLeads: any[]) => {
    const todayStr = new Date().toDateString();
    
    let kol = 0;
    let prod = 0;
    let mkt = 0;
    let other = 0;
    let today = 0;

    let newCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    let declinedCount = 0;

    allLeads.forEach(lead => {
      const s = (lead.service || '').toLowerCase();
      if (s.includes('kol') || s.includes('koc')) kol++;
      else if (s.includes('production') || s.includes('quay') || s.includes('video')) prod++;
      else if (s.includes('ads') || s.includes('marketing') || s.includes('camp') || s.includes('content') || s.includes('seeding')) mkt++;
      else other++;

      const st = lead.status || 'Mới';
      if (st === 'Mới') newCount++;
      else if (st === 'Đang xử lý') processingCount++;
      else if (st === 'Đã liên hệ') completedCount++;
      else if (st === 'Từ chối') declinedCount++;

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
      todayCount: today,
      newCount,
      processingCount,
      completedCount,
      declinedCount
    });
  };

  const handleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
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

  // Synchronize dynamic lists with target Google Sheets
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

      // 1. Prompt Google Spreadsheet Generation
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

      // 2. Synchronize up-to-date data
      await syncLeadsToGoogleSheet(currentSheetId, leads, accessToken);

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
      
      await syncLeadsToGoogleSheet(newSheet.id, leads, accessToken);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    } catch (error) {
      console.error('Tạo bảng tính mới thất bại:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // CRM Update status direct to Firestore
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        status: newStatus
      });
      // Selected details panel adjustment if open
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Lỗi khi chỉnh sửa trạng thái tư vấn:', err);
      alert('Không thể chỉnh sửa trạng thái khách hàng trên Firebase.');
    }
  };

  // CRM Update inner notes/memos
  const saveLeadMemo = async () => {
    if (!selectedLead) return;
    setIsSavingMemo(true);
    try {
      const leadRef = doc(db, 'leads', selectedLead.id);
      await updateDoc(leadRef, {
        adminMemo: internalMemo
      });
      setSelectedLead(prev => ({ ...prev, adminMemo: internalMemo }));
      setIsSavingMemo(false);
      alert('✏️ Đã lưu ghi chú văn phòng thành công!');
    } catch (err) {
      console.warn('Lỗi ghi chú lưu trữ cục bộ:', err);
      setIsSavingMemo(false);
      alert('Không tìm thấy bản ghi tư vấn trực tiếp này.');
    }
  };

  // Manual lead creation handler
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) {
      alert('Vui lòng nhập Họ tên và Số điện thoại!');
      return;
    }

    setIsCreatingLead(true);
    try {
      const generatedId = `lead_${Math.random().toString(36).slice(2, 11)}`;
      const leadData = {
        name: newLeadForm.name,
        phone: newLeadForm.phone,
        email: newLeadForm.email,
        service: newLeadForm.service,
        message: newLeadForm.message,
        adminMemo: newLeadForm.adminMemo,
        createdAt: new Date().toISOString(),
        status: 'Mới',
        id: generatedId
      };

      await addDoc(collection(db, 'leads'), leadData);

      // Clean form state
      setNewLeadForm({
        name: '',
        phone: '',
        email: '',
        service: 'Booking KOL/KOC',
        message: '',
        adminMemo: ''
      });
      setIsAddLeadModalOpen(false);
      alert('🎉 Đã thêm đơn tư vấn thủ công thành công!');
    } catch (err) {
      console.error('Lỗi thêm đơn tư vấn:', err);
      alert('Không thể kết nối lưu đơn tư vấn.');
    } finally {
      setIsCreatingLead(false);
    }
  };

  // Clean Delete CRM Items
  const handleDeleteLead = async (leadId: string) => {
    const doubleConfirm = window.confirm('🚨 CẢNH BÁO SẾP: Bạn có chắc chắn muốn XÓA VĨNH VIỄN thông tin liên hệ này ra khỏi database đám mây Firestore không? Thao tác này hoàn toàn không thể khôi phục.');
    if (!doubleConfirm) return;

    try {
      await deleteDoc(doc(db, 'leads', leadId));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }
      alert('🔥 Đã hủy bản ghi khách hàng tư vấn khỏi hệ thống.');
    } catch (err) {
      console.error('Lỗi xóa khách:', err);
      alert('Có lỗi bảo mật xảy ra khi yêu cầu xóa.');
    }
  };

  // Secure Local CSV Safe Downloader
  const downloadLocalCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Thời gian gửi', 'Trạng thái', 'Họ và Tên', 'Số Điện Thoại', 'Email', 'Dịch Vụ Quan Tâm', 'Lời nhắn / Mô tả', 'Ghi chú nội bộ Admin'];
    const rows = leads.map(lead => [
      lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN') : '',
      `"${lead.status || 'Mới'}"`,
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `="${lead.phone || ''}"`, // format phone to prevent auto leading zero-dropping in Excel
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.service || '').replace(/"/g, '""')}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`,
      `"${(lead.adminMemo || '').replace(/"/g, '""')}"`
    ]);

    // Use BOM to prevent Vietnamese characters font breakdown in MS Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DSKhach_Hang_TSMedia_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Setup initial detailed information viewing trigger
  const openLeadDetail = (lead: any) => {
    setSelectedLead(lead);
    setInternalMemo(lead.adminMemo || '');
  };

  if (!user || !isAdmin(user.email)) {
    return null;
  }

  if (!isFullPage) {
    return null; // The CRM operates exclusively as a dedicated fullscreen sub-page side-by-side with Navbar controls
  }

  return (
    <div id="admin-panel-page" className="bg-[#0c0c0d] font-sans relative z-20 w-full min-h-screen pb-24">
      {/* Visual Workspace Container */}
      {isOpen && (
        <div className="bg-[#0c0c0d] pb-20 pt-8 px-4 sm:px-6 lg:px-8 relative animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Dashboard Premium Title bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#F5C518] to-amber-500 text-black rounded-2xl relative shadow-md shadow-amber-500/10">
                  <Database className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#0d0d0f] animate-ping"></span>
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-[#F5C518] uppercase tracking-[0.2em] block">HỆ THỐNG QUẢN TRỊ TRỰC TUYẾN CHUYÊN NGHIỆP</span>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                    BÀNG ĐIỀU KHIỂN LIVE CRM
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500 text-black uppercase tracking-widest leading-none border border-emerald-500/15 animate-pulse">
                      FIRESTORE LIVE
                    </span>
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    Quản trị viên: <strong className="text-white/80">{user.email}</strong> • Chế độ bảo mật đầu-cuối tích hợp đám mây
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {onBackToHome && (
                  <button
                    onClick={onBackToHome}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-wider rounded-full transition-all border border-white/10 cursor-pointer"
                  >
                    ← Quay lại trang chủ
                  </button>
                )}
              </div>
            </div>
            
            {/* Visual KPI & Analytics Dashboard Area */}
            <div className="space-y-4">
              {testSoundToast && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <span>🔔</span>
                  <span>Hệ thống đã kích hoạt chuông báo thành công! Chuông này sẽ phát nhạc trực tiếp mỗi khi có khách mới ghi danh vào CRM.</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8401C]"></span>
                  Báo Cáo Phân Tích Tổng Quan (TS Media Insights)
                </h3>
                
                <div className="flex items-center gap-4 text-[10px] text-white/50">
                  <button 
                    onClick={testAlertSound}
                    className="flex items-center gap-1 hover:text-[#E8401C] transition-colors"
                    title="Phát thử âm thanh thông báo"
                  >
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Test chuông báo</span>
                  </button>

                  <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    <span>Tải dữ liệu tự động hằng mili-giây</span>
                  </div>
                </div>
              </div>

              {/* Grid metric visual counters */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                  <div className="absolute top-2 right-2 p-1.5 opacity-5 text-white">
                    <Users className="w-12 h-12" />
                  </div>
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Tổng Đăng Ký (Leads)</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white">{stats.total}</span>
                    <span className="text-[9px] text-[#E8401C] font-extrabold bg-[#E8401C]/10 px-1.5 py-0.5 rounded border border-[#E8401C]/10">Tổng</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                  <div className="absolute top-2 right-2 p-1.5 opacity-5 text-white">
                    <Clock className="w-12 h-12" />
                  </div>
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Đăng Ký Hôm Nay</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-amber-500">{stats.todayCount}</span>
                    {stats.todayCount > 0 ? (
                      <span className="text-[9px] text-green-400 font-extrabold bg-green-400/10 px-1 py-0.5 rounded animate-bounce">MỚI</span>
                    ) : (
                      <span className="text-[9px] text-white/30">Hôm nay</span>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#E8401C]/5 to-transparent border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                  <div className="absolute top-2 right-2 p-1.5 opacity-10 text-[#E8401C]">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Chưa chăm sóc (Mới)</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white">{stats.newCount}</span>
                    <span className="text-[9px] text-white/50">{stats.total > 0 ? `${Math.round((stats.newCount / stats.total) * 100)}%` : '0%'}</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                  <div className="absolute top-2 right-2 p-1.5 opacity-5 text-white">
                    <TrendingUp className="w-12 h-12" />
                  </div>
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Đang Xử Lý Campaign</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-[#F5C518]">{stats.processingCount}</span>
                    <span className="text-[9px] text-white/50">{stats.total > 0 ? `${Math.round((stats.processingCount / stats.total) * 100)}%` : '0%'}</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-[#E8401C]/25 transition-all">
                  <div className="absolute top-2 right-2 p-1.5 opacity-5 text-white">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Đã tiếp xúc / Hẹn gặp</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-emerald-400">{stats.completedCount}</span>
                    <span className="text-[9px] text-white/50">{stats.total > 0 ? `${Math.round((stats.completedCount / stats.total) * 100)}%` : '0%'}</span>
                  </div>
                </div>
              </div>

              {/* Premium Analytics Dashboard Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Lead Growth / Signups Over Time Trend (Area Chart) - 8 Cols on desktop */}
                <div className="lg:col-span-8 p-6 bg-[#111111] border border-white/5 rounded-3xl text-left space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-widest">Xu Hướng Đăng Ký Live (Lead Trend)</h4>
                      <p className="text-[10px] text-white/40">Thống kê số lượng khách tư vấn ghi danh trong 10 ngày gần nhất</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#E8401C] bg-[#E8401C]/10 border border-[#E8451C]/15 px-2.5 py-1 rounded-full">
                      Tăng trưởng liên tục
                    </span>
                  </div>

                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getSubmissionsOverTime()}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSubmit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E8401C" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#E8401C" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={10} 
                          tickLine={false} 
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={10} 
                          tickLine={false} 
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#161618', 
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Số đăng ký" 
                          stroke="#E8401C" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#colorSubmit)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Lead Distribution Pie/Bar Analyser - 4 Cols on desktop */}
                <div className="lg:col-span-4 p-6 bg-[#111111] border border-white/5 rounded-3xl text-left flex flex-col justify-between shadow-xl">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-widest mb-1">Cơ Cấu Trạng Thái (Pipeline stage)</h4>
                    <p className="text-[10px] text-white/40 mb-4">Tỷ lệ xử lý hồ sơ khách hàng hiện tại</p>

                    <div className="h-[160px] w-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPipelineStatusData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {getPipelineStatusData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white">{stats.total}</span>
                        <span className="text-[8px] uppercase font-black text-white/30 tracking-widest">KHÁCH MẪU</span>
                      </div>
                    </div>

                    {/* Custom Pie Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {getPipelineStatusData().map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10.5px]">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                          <span className="text-white/60 truncate font-semibold">{entry.name}:</span>
                          <span className="text-white font-extrabold ml-auto">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Service analytical bar charts & Excel export Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 3. Bar Chart distribution - 7 Cols */}
                <div className="lg:col-span-7 p-6 bg-[#111111] border border-white/5 rounded-3xl text-left space-y-4 shadow-xl">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-widest">Dịch Vụ Được Quan Tâm Nhất (Service Popularity)</h4>
                    <p className="text-[10px] text-white/40">Phân tích khối lượng công việc mong muốn của khách hàng tiềm năng</p>
                  </div>

                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getServiceDataForChart()}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={10} 
                          tickLine={false} 
                        />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: '#161618', 
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px'
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {getServiceDataForChart().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Excel Quick actions - 5 Cols */}
                <div className="lg:col-span-5 p-6 bg-gradient-to-br from-emerald-950/25 to-[#0e0e10] border border-emerald-500/20 rounded-3xl relative text-left overflow-hidden flex flex-col justify-between shadow-xl">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Xuất Báo Cáo Excel nhanh (.csv)
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed mt-2.5 mb-4 font-medium">
                      Tải xuống trực tiếp danh sách thông tin khách hàng tiềm năng đã đăng ký. Hệ thống tự động định dạng số điện thoại chuẩn không mất số 0 và tương thích 100% với MS Excel toàn cầu.
                    </p>
                    
                    <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40 font-medium">Tổng số dòng sẵn sàng:</span>
                        <span className="text-emerald-400 font-extrabold">{leads.length} dòng</span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2.5">
                        <span className="text-white/40 font-medium">Khớp bộ lọc hiện tại:</span>
                        <span className="text-amber-400 font-extrabold">{filteredLeads.length} dòng</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4">
                    <button
                      onClick={downloadLocalCSV}
                      className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-97"
                    >
                      <Download className="w-4 h-4" />
                      Tải Tệp Excel Trực Tiếp (.xlsx/csv)
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Live New Lead floating banner notification layout */}
            {newLeadToast && (
              <div className="p-4 bg-gradient-to-r from-[#E8401C]/20 to-transparent border border-[#E8401C]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8401C]/20 text-[#E8401C] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-[#E8401C] uppercase tracking-wider">🔔 PHÁT HIỆN ĐĂNG KÝ TƯ VẤN MỚI TRỰC TIẾP!</span>
                    <h5 className="text-white font-extrabold text-sm">{newLeadToast.name} (SĐT: {newLeadToast.phone})</h5>
                    <p className="text-[11px] text-white/60">Gói quan tâm: <strong className="text-[#F5C518]">{newLeadToast.service}</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openLeadDetail(newLeadToast)}
                    className="px-4 py-2 bg-white text-black font-black uppercase tracking-wider text-[11px] rounded-full transition-all hover:bg-[#F5C518] hover:scale-105"
                  >
                    Xem Chi Tiết Ngay
                  </button>
                  <button
                    onClick={() => setNewLeadToast(null)}
                    className="p-1 px-2.5 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Dual workspace setup: Left Sheet Settings & Right Table CRM */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left col: Premium Excel CRM Metadata & Live Statistics Card */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#101012] to-[#0c0c0d] border border-white/5 p-6 rounded-3xl space-y-6 text-left relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-wider text-[#F5C518] uppercase">
                    Chiết Xuất Live CRM
                  </h3>
                  <span className="flex items-center gap-1.5 text-[9px] bg-emerald-500/10 text-emerald-400 font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> An Toàn Tuyệt Đối
                  </span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-semibold">
                  Sếp có quyền tải toàn bộ tệp thông tin hoặc tệp liên hệ đã lọc trực tiếp về máy cục bộ. Dữ liệu tải về chuẩn định dạng dòng bảng Excel (.xlsx / .csv) hỗ trợ đầy đủ font tiếng Việt.
                </p>

                {/* Integration Details Container */}
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-black tracking-wider text-[#E8401C] uppercase block mb-1">📊 CHỈ SỐ CRM HIỆN TẠI</span>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/45">Dịch vụ Video hot:</span>
                      <span className="text-white font-extrabold text-right">Production/Booking ({stats.productionCount})</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
                      <span className="text-white/45">Chiến dịch Ads hot:</span>
                      <span className="text-white font-extrabold text-right">Multichannel Ads ({stats.marketingCount})</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
                      <span className="text-white/45">Dẫn đầu ngày:</span>
                      <span className="text-white font-extrabold text-right">Gói Thử Nghiệm hot ({stats.otherCount})</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-[11px] text-emerald-400 flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>Dữ liệu số điện thoại được đóng gói chuẩn ký tự dạng chuỗi số <code>="0XXX"</code> để ngăn MS Excel tự động cắt bỏ số 0 ở đầu điện thoại. Sếp yên tâm nhập khẩu trực tiếp vào Zalo hoặc phần mềm gọi điện tự động!</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase text-white/50 font-bold block mb-1">BẢO MẬT HỆ THỐNG</span>
                  <p className="text-[10.5px] text-white/40 leading-relaxed">Công cụ xuất tệp CRM chạy hoàn toàn ở phía client trong trình duyệt của bạn, không sao lưu dữ liệu qua bất kỳ máy chủ bên thứ ba nào.</p>
                </div>
              </div>

              {/* Right col: Real-time Live CRM interactive Leads database view */}
              <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
                
                {/* Search & filters tools row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Nhật Ký CRM & Đăng Ký Chăm Sóc Khách
                    </h3>
                    <p className="text-[10px] text-white/45 font-semibold mt-0.5">Hiển thị {filteredLeads.length} trên tổng {leads.length} bản ghi</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsAddLeadModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E8401C] hover:bg-white hover:text-black border border-transparent text-white text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#E8401C]/10"
                      title="Thêm mới đơn tư vấn thủ công"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span>Thêm đơn mới</span>
                    </button>

                    {leads.length > 0 && (
                      <button
                        onClick={downloadLocalCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                        title="Tải tệp CSV về máy sếp"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0 text-[#E8401C]" />
                        <span>Xuất tệp CSV</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub filter boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm tên khách, SĐT, ghi chú nội bộ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E8401C]/60 transition-all font-medium"
                    />
                  </div>

                  <div className="sm:col-span-3 relative">
                    <Filter className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedServiceFilter}
                      onChange={(e) => setSelectedServiceFilter(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#E8401C]/60 transition-all cursor-pointer appearance-none font-bold"
                    >
                      <option value="all">Tất cả dịch vụ</option>
                      <option value="kol">Booking KOL/KOC</option>
                      <option value="production">Vận hành Production</option>
                      <option value="marketing">Ads, Content & Seeding</option>
                      <option value="other">Gói Khác</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="sm:col-span-3 relative">
                    <Filter className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#E8401C]/60 transition-all cursor-pointer appearance-none font-bold"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="mới">Mới (Chưa Chăm Sóc)</option>
                      <option value="đang xử lý">Đang Xử Lý</option>
                      <option value="đã liên hệ">Đã liên hệ xong</option>
                      <option value="từ chối">Từ chối / Spam</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Main CRM Table list container */}
                {isLoadingLeads ? (
                  <div className="py-24 flex flex-col items-center justify-center text-white/40 gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#E8401C]" />
                    <span className="text-xs font-semibold">Đang liên kết dữ liệu đám mây Real-time...</span>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-20 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-white/30 gap-3 bg-white/[0.005]">
                    <Database className="w-8 h-8 opacity-20 text-gray-500" />
                    <span className="text-xs font-semibold">Không tìm thấy thông tin đăng ký nào khớp bộ lọc</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/45 max-h-[380px]">
                    <table className="w-full text-left text-xs text-white/80 border-collapse table-auto">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-[9px] text-white/55 uppercase font-black tracking-widest">
                          <th className="py-3 px-4">Khách hàng / SĐT</th>
                          <th className="py-3 px-4">Gói Yêu Cầu</th>
                          <th className="py-3 px-4">Trạng thái xử lý (CRM)</th>
                          <th className="py-3 px-4">Ngày đăng ký</th>
                          <th className="py-3 px-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, idx) => {
                          const statusColor = 
                            lead.status === 'Từ chối' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            lead.status === 'Đã liên hệ' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            lead.status === 'Đang xử lý' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse';

                          return (
                            <tr key={`${lead.id || 'idx'}_${idx}_${lead.createdAt || ''}`} className="border-b border-white/5 hover:bg-white/[0.015] transition-colors">
                              {/* 1. Client Identifier */}
                              <td className="py-3.5 px-4 text-left">
                                <div className="space-y-0.5">
                                  <div className="font-extrabold text-white text-xs hover:underline cursor-pointer flex items-center gap-1.5" onClick={() => openLeadDetail(lead)}>
                                    {lead.name}
                                    {lead.adminMemo && <FileText className="w-3.5 h-3.5 text-[#F5C518]" title="Có ghi chú nội bộ" />}
                                  </div>
                                  <div className="font-mono text-[10.5px] text-white/70 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-[#E8401C]" />
                                    <span>{lead.phone}</span>
                                  </div>
                                  {lead.email && (
                                    <div className="text-[10px] text-white/40 truncate max-w-[150px]">{lead.email}</div>
                                  )}
                                </div>
                              </td>

                              {/* 2. Registered service */}
                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-white/5 text-[#E8401C] border border-white/10 font-black text-[9px] uppercase tracking-wider">
                                  {lead.service}
                                </span>
                              </td>

                              {/* 3. Dropdown Selection for immediate live status update */}
                              <td className="py-3.5 px-4 min-w-[130px]">
                                <select
                                  value={lead.status || 'Mới'}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider cursor-pointer bg-black/40 focus:outline-none focus:ring-1 focus:ring-[#E8401C] ${statusColor}`}
                                >
                                  <option value="Mới" className="bg-[#111] text-blue-400">Mới</option>
                                  <option value="Đang xử lý" className="bg-[#111] text-amber-500">Đang xử lý</option>
                                  <option value="Đã liên hệ" className="bg-[#111] text-green-400">Đã liên hệ</option>
                                  <option value="Từ chối" className="bg-[#111] text-red-400">Từ chối / Spam</option>
                                </select>
                              </td>

                              {/* 4. Timestamp */}
                              <td className="py-3.5 px-4 text-white/50 font-mono text-[10px] whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#E8401C]/60" />
                                  <span>
                                    {lead.createdAt 
                                      ? new Date(lead.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) 
                                      : 'Đang gửi'}
                                  </span>
                                </div>
                              </td>

                              {/* 5. Direct Quick action key triggers */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openLeadDetail(lead)}
                                    className="p-1 px-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-[10px] font-extrabold uppercase text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                                    title="Mở ghi chú nội bộ Admin"
                                  >
                                    Chi tiết / Memo
                                  </button>
                                  
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1.5 bg-red-500/5 hover:bg-red-500/20 hover:text-red-400 border border-transparent rounded-lg transition-colors scroll-m-1 cursor-pointer"
                                    title="Xóa vĩnh viễn"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
            </div>

          </div>
        </div>
      )}

      {/* Slide-over custom detailed CRM modal and notes dashboard */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-white/10 rounded-3xl max-w-lg w-full p-6 text-left relative space-y-5 shadow-2xl">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title section iconized */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#E8401C]/10 text-[#E8401C] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#E8401C] uppercase tracking-wider">THÔNG TIN CHI TIẾT CRM KHÁCH HÀNG</span>
                <h4 className="text-white font-extrabold text-base">{selectedLead.name}</h4>
              </div>
            </div>

            {/* Core details data sheet grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-white/[0.01] p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-white/40 font-bold block mb-0.5">👤 HỌ VÀ TÊN KHÁCH:</span>
                <span className="text-white font-black">{selectedLead.name}</span>
              </div>
              <div>
                <span className="text-white/40 font-bold block mb-0.5">📞 SỐ ĐIỆN THOẠI:</span>
                <a href={`tel:${selectedLead.phone}`} className="text-[#F5C518] hover:underline font-extrabold font-mono text-xs">{selectedLead.phone}</a>
              </div>
              <div>
                <span className="text-white/40 font-bold block mb-0.5">✉️ ĐỊA CHỈ EMAIL:</span>
                <span className="text-white font-semibold truncate block">{selectedLead.email || '(Không cung cấp)'}</span>
              </div>
              <div>
                <span className="text-white/40 font-bold block mb-0.5">🏷️ SẢN PHẨM / GÓI ĐĂNG KÝ:</span>
                <span className="text-[#E8401C] font-black">{selectedLead.service}</span>
              </div>
              <div>
                <span className="text-white/40 font-bold block mb-0.5">⏰ THỜI GIAN ĐĂNG KÝ:</span>
                <span className="text-white/80 font-mono text-[11px]">
                  {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString('vi-VN') : 'Mới'}
                </span>
              </div>
              <div>
                <span className="text-white/40 font-bold block mb-0.5">⚙️ TRẠNG THÁI HIỆN TẠI:</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-black uppercase text-[9px] inline-block mt-0.5">{selectedLead.status || 'Mới'}</span>
              </div>
            </div>

            {/* Client message textblock */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#E8401C]" />
                Mô tả nhu cầu / Ghi chú từ khách:
              </span>
              <p className="text-xs text-white/80 leading-relaxed bg-[#1a1a1c] p-3 rounded-xl border border-white/5 italic">
                "{selectedLead.message || 'Khách hàng không đính kèm tin nhắn ghi chú.'}"
              </p>
            </div>

            {/* Admin editable memo notepad area */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label htmlFor="adminMemoNotes" className="text-[10px] font-black text-[#F5C518] uppercase tracking-wider block">
                ✏️ Ghi chú nghiệp vụ / Nhật ký liên hệ (Nội bộ Admin)
              </label>
              <textarea
                id="adminMemoNotes"
                rows={3}
                placeholder="Nhập ghi chú liên hệ, ngân sách khách báo hoặc lịch hẹn cuộc gọi với khách..."
                value={internalMemo}
                onChange={(e) => setInternalMemo(e.target.value)}
                className="w-full bg-[#1e1e20] text-white border border-white/15 hover:border-white/20 rounded-xl py-2.5 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all/70 font-medium"
              />
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold select-none cursor-pointer"
                >
                  Đóng lại
                </button>
                <button
                  type="button"
                  disabled={isSavingMemo}
                  onClick={saveLeadMemo}
                  className="px-5 py-2 rounded-xl bg-[#E8401C] hover:bg-[#ff512d] text-white text-xs font-extrabold select-none cursor-pointer"
                >
                  {isSavingMemo ? 'Đang lưu...' : 'Lưu ghi chú sếp'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add Lead Modal Dialogue */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-white/10 rounded-3xl max-w-lg w-full p-6 text-left relative space-y-4 shadow-2xl">
            <button
              onClick={() => setIsAddLeadModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Section heading */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#E8401C]/10 text-[#E8401C] flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#E8401C] uppercase tracking-wider">CRM QUẢN TRỊ VIÊN</span>
                <h4 className="text-white font-extrabold text-base">Thêm Đơn Tư Vấn Thủ Công</h4>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase">Họ và Tên khích <span className="text-[#E8401C]">*</span></label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-xl py-2 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase">Số điện thoại <span className="text-[#E8401C]">*</span></label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0912345678"
                    className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-xl py-2 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-white/70 uppercase">Địa chỉ Email</label>
                <input
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@company.com"
                  className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-xl py-2 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-white/70 uppercase">Dịch Vụ / Gói Quan Tâm</label>
                <select
                  value={newLeadForm.service}
                  onChange={(e) => setNewLeadForm(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-xl py-2 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all"
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

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-white/70 uppercase">Mô tả nhu cầu / Lời nhắn</label>
                <textarea
                  rows={2}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Ghi chú về phân khúc sản phẩm, kế hoạch chiến dịch hoặc ngân sách..."
                  className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-xl py-2 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all font-medium"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-[#F5C518] uppercase">✏️ Ghi chú nội bộ Admin</label>
                <textarea
                  rows={2}
                  value={newLeadForm.adminMemo}
                  onChange={(e) => setNewLeadForm(prev => ({ ...prev, adminMemo: e.target.value }))}
                  placeholder="Ghi chú trạng thái, kết quả hẹn cuộc gọi ban đầu..."
                  className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-xl py-2 px-3 text-xs focus:bg-[#252528] focus:outline-none focus:ring-1 focus:ring-[#E8401C] transition-all font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold select-none cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreatingLead}
                  className="px-5 py-2 rounded-xl bg-[#E8401C] hover:bg-[#ff512d] text-white text-xs font-black uppercase tracking-wider select-none cursor-pointer"
                >
                  {isCreatingLead ? 'Đang lưu...' : 'Lưu Đơn Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

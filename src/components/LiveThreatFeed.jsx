import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, CheckCircle2, AlertOctagon, Terminal, Activity } from 'lucide-react';

const THREAT_EVENTS = [
  { time: 'Vừa xong', type: 'BLOCKED', text: 'Chặn bẫy lừa đảo mạo danh Vietcombank OTP', domain: 'vcb-digibank-xac-thuc-otp.xyz', ip: '118.69.14.22' },
  { time: '4s trước', type: 'VERIFIED', text: 'Xác thực an toàn cổng tuyển sinh Đại học VKU', domain: 'vku.udn.vn', ip: '103.28.37.12' },
  { time: '9s trước', type: 'BLOCKED', text: 'Chặn web bẫy mật khẩu PayPal tài khoản doanh nghiệp', domain: 'secure-paypal-login-verify.tk', ip: '194.26.29.112' },
  { time: '14s trước', type: 'BLOCKED', text: 'Phát hiện website lừa đảo ví điện tử MetaMask Airdrop', domain: 'metamask-wallet-claim-airdrop.top', ip: '45.142.166.8' },
  { time: '21s trước', type: 'VERIFIED', text: 'Xác thực an toàn cổng Internet Banking Techcombank', domain: 'techcombank.com.vn', ip: '125.212.218.4' },
  { time: '28s trước', type: 'BLOCKED', text: 'Chặn truy cập địa chỉ IP mạo danh máy chủ ngân hàng', domain: '192.168.1.105/login-vcb.html', ip: '192.168.1.105' },
  { time: '35s trước', type: 'BLOCKED', text: 'Phát hiện mã độc khai thác đuôi tên miền nguy hiểm .gq', domain: 'www.shprakserf.gq', ip: '104.21.32.18' }
];

export default function LiveThreatFeed() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % THREAT_EVENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const event = THREAT_EVENTS[currentIdx];

  return (
    <div className="glass-panel border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl relative overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-0 left-0 w-32 h-full bg-cyan-500/5 blur-xl pointer-events-none"></div>

      {/* Left Radar Indicator */}
      <div className="flex items-center space-x-3 w-full md:w-auto relative z-10">
        <div className="relative h-10 w-10 rounded-full bg-slate-950 border border-cyan-500/40 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg shadow-cyan-500/10">
          <div className="absolute inset-0 radar-scan"></div>
          <Radio className="h-4 w-4 text-cyan-400 z-10 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">SOC 24/7 RADAR</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-200">
            Giám Sát & Bắt Giữ Mã Độc Thời Gian Thực
          </div>
        </div>
      </div>

      {/* Middle Animated Stream Ticker */}
      <div className="flex-1 w-full bg-slate-950/80 border border-white/[0.06] rounded-xl px-4 py-2 flex items-center space-x-3 overflow-hidden relative z-10">
        <Terminal className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
        <div className="flex items-center space-x-2.5 text-xs truncate">
          <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[9px] border ${
            event.type === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            {event.type}
          </span>
          <span className="text-slate-200 font-medium truncate">{event.text}</span>
          <span className="text-slate-500 font-mono hidden sm:inline">({event.domain})</span>
        </div>
      </div>

      {/* Right Stats */}
      <div className="hidden lg:flex items-center space-x-4 text-[11px] font-mono text-slate-400 flex-shrink-0 relative z-10">
        <div className="flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Hôm nay: <b className="text-emerald-400">1,428</b> chặn</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Activity className="h-3 w-3 text-cyan-400" />
          <span>Độ trễ: <b className="text-cyan-400">12ms</b></span>
        </div>
      </div>

    </div>
  );
}

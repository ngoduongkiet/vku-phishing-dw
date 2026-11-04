import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

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
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
      
      {/* Left Radar Indicator */}
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <div className="relative h-9 w-9 rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 radar-scan"></div>
          <Radio className="h-4 w-4 text-emerald-400 z-10 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">SOC 24/7 RADAR</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-300">
            Giám Sát & Bắt Giữ Mã Độc Thời Gian Thực
          </div>
        </div>
      </div>

      {/* Middle Animated Stream Ticker */}
      <div className="flex-1 w-full bg-slate-900/60 border border-slate-800/80 rounded-lg px-3.5 py-1.5 flex items-center space-x-3 overflow-hidden">
        <Terminal className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
        <div className="flex items-center space-x-2 text-xs truncate">
          <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${
            event.type === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {event.type}
          </span>
          <span className="text-slate-200 font-medium truncate">{event.text}</span>
          <span className="text-slate-500 font-mono hidden sm:inline">({event.domain})</span>
        </div>
      </div>

      {/* Right Stats */}
      <div className="hidden lg:flex items-center space-x-4 text-[11px] font-mono text-slate-400 flex-shrink-0">
        <div>Hôm nay: <b className="text-emerald-400">1,428</b> chặn</div>
        <div>Độ trễ: <b className="text-blue-400">12ms</b></div>
      </div>

    </div>
  );
}

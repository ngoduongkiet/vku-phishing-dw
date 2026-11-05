import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, CheckCircle2, Terminal, Activity } from 'lucide-react';

const THREAT_EVENTS = [
  { time: 'Just now', type: 'BLOCKED', text: 'Blocked credential harvester targeting Vietcombank OTP', domain: 'vcb-digibank-xac-thuc-otp.xyz', ip: '118.69.14.22' },
  { time: '4s ago', type: 'VERIFIED', text: 'Verified legitimate traffic on VKU Admissions Portal', domain: 'vku.udn.vn', ip: '103.28.37.12' },
  { time: '9s ago', type: 'BLOCKED', text: 'Blocked unauthorized PayPal login proxy on free .tk domain', domain: 'secure-paypal-login-verify.tk', ip: '194.26.29.112' },
  { time: '14s ago', type: 'BLOCKED', text: 'Intercepted malicious MetaMask airdrop claim form', domain: 'metamask-wallet-claim-airdrop.top', ip: '45.142.166.8' },
  { time: '21s ago', type: 'VERIFIED', text: 'Verified authentic Techcombank Internet Banking gateway', domain: 'techcombank.com.vn', ip: '125.212.218.4' },
  { time: '28s ago', type: 'BLOCKED', text: 'Blocked raw IP access masquerading as internal banking node', domain: '192.168.1.105/login-vcb.html', ip: '192.168.1.105' },
  { time: '35s ago', type: 'BLOCKED', text: 'Flagged suspicious high-entropy domain on .gq TLD', domain: 'www.shprakserf.gq', ip: '104.21.32.18' }
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
    <div className="linear-card p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
      
      {/* Left Status */}
      <div className="flex items-center space-x-2.5 w-full md:w-auto">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
          SOC Telemetry Stream
        </span>
      </div>

      {/* Middle Log Event */}
      <div className="flex-1 w-full bg-[#0C0D12] border border-white/5 rounded-md px-3 py-1.5 flex items-center space-x-2.5 overflow-hidden">
        <Terminal className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <div className="flex items-center space-x-2 truncate font-mono text-[11px]">
          <span className={`px-1.5 py-0.2 rounded font-semibold text-[9px] ${
            event.type === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {event.type}
          </span>
          <span className="text-slate-200 truncate">{event.text}</span>
          <span className="text-slate-500 hidden sm:inline">({event.domain})</span>
        </div>
      </div>

      {/* Right Latency */}
      <div className="hidden lg:flex items-center space-x-3 text-[11px] font-mono text-slate-400 flex-shrink-0">
        <div>Blocked Today: <b className="text-slate-200">1,428</b></div>
        <div>Latency: <b className="text-emerald-400">12ms</b></div>
      </div>

    </div>
  );
}

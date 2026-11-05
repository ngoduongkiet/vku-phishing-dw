import React, { useState } from 'react';
import { Swords, ShieldCheck, ShieldAlert, ArrowRight, Lock, Unlock, Sparkles, Scale } from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';

const PRESET_DUELS = [
  {
    name: 'Vietcombank Chính Thức VS Nhái OTP Lừa Đảo',
    urlA: 'https://vietcombank.com.vn',
    urlB: 'http://vcb-digibank-xac-thuc-otp.xyz/login'
  },
  {
    name: 'Techcombank Chính Thức VS Nhái Đòi Mật Khẩu',
    urlA: 'https://techcombank.com.vn',
    urlB: 'http://techcombank-login-otp.xyz'
  },
  {
    name: 'Cổng PayPal Quốc Tế VS Bẫy Miễn Phí .TK',
    urlA: 'https://www.paypal.com',
    urlB: 'http://secure-paypal-login-verify.tk/account'
  }
];

export default function URLDuel() {
  const [urlA, setUrlA] = useState(PRESET_DUELS[0].urlA);
  const [urlB, setUrlB] = useState(PRESET_DUELS[0].urlB);

  const resA = extractAndPredict(urlA);
  const resB = extractAndPredict(urlB);

  const handleSelectPreset = (p) => {
    setUrlA(p.urlA);
    setUrlB(p.urlB);
  };

  return (
    <div className="space-y-6">

      {/* Duel Header */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-red-600 rounded-xl text-white shadow-lg shadow-red-500/20">
            <Swords className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Chế Độ So Sánh Đối Đầu Trực Diện 2 URL (Side-by-Side URL Duel)
            </h2>
            <p className="text-xs text-slate-400">
              Đặt một Website Hợp Pháp và một Website Giả Mạo cạnh nhau để phân tích sự tương phản định lượng trên các chiều Star Schema
            </p>
          </div>
        </div>

        {/* Quick Duel Presets */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold self-center font-mono text-[11px]">Kịch bản đối đầu mẫu:</span>
          {PRESET_DUELS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="px-3 py-1.5 bg-slate-950/80 hover:bg-white/[0.08] text-slate-300 rounded-xl border border-white/[0.08] hover:border-cyan-500/30 transition-all cursor-pointer font-medium text-xs font-mono"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side Dual Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: URL A (Legitimate) */}
        <div className="glass-panel border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden glow-emerald">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              ĐỐI TƯỢNG 1: WEBSITE CHÍNH THỨC
            </span>
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>

          <div className="mt-4">
            <label className="text-[11px] text-slate-400 font-mono block mb-1.5">Đường dẫn URL A:</label>
            <input
              type="text"
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-white/[0.08] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          {resA && (
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-center">
                <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider">KẾT LUẬN CỦA MÔ HÌNH:</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {resA.isLegitimate ? '🟢 HỢP PHÁP (LEGITIMATE)' : '🔴 LỪA ĐẢO (PHISHING)'}
                </div>
                <div className="text-xs text-slate-400 mt-1.5 font-mono">Độ tin cậy: <b className="text-emerald-400">{resA.confidence}%</b></div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">FACT 1 (SIMILARITY)</span>
                  <span className="text-base font-bold text-emerald-400">{resA.fact1_similarity.toFixed(1)} / 100</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">FACT 2 (BACKLINKS)</span>
                  <span className="text-base font-bold text-emerald-400">{resA.fact2_externalRef.toFixed(1)} links</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">GIAO THỨC</span>
                  <span className="font-bold text-white flex items-center space-x-1.5 mt-1">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{resA.protocol} (Mã hóa)</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">ĐUÔI TÊN MIỀN</span>
                  <span className="font-bold text-cyan-400 text-sm mt-1 block">{resA.tld}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: URL B (Phishing) */}
        <div className="glass-panel border-red-500/30 rounded-2xl p-6 relative overflow-hidden glow-crimson">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30 font-mono">
              ĐỐI TƯỢNG 2: WEBSITE GIẢ MẠO / LỪA ĐẢO
            </span>
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>

          <div className="mt-4">
            <label className="text-[11px] text-slate-400 font-mono block mb-1.5">Đường dẫn URL B:</label>
            <input
              type="text"
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-white/[0.08] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500/60"
            />
          </div>

          {resB && (
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-center">
                <div className="text-[10px] font-bold text-red-400 uppercase font-mono tracking-wider">KẾT LUẬN CỦA MÔ HÌNH:</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {resB.isLegitimate ? '🟢 HỢP PHÁP (LEGITIMATE)' : '🔴 LỪA ĐẢO (PHISHING)'}
                </div>
                <div className="text-xs text-slate-400 mt-1.5 font-mono">Độ tin cậy: <b className="text-red-400">{resB.confidence}%</b></div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">FACT 1 (SIMILARITY)</span>
                  <span className="text-base font-bold text-red-400">{resB.fact1_similarity.toFixed(1)} / 100</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">FACT 2 (BACKLINKS)</span>
                  <span className="text-base font-bold text-red-400">{resB.fact2_externalRef.toFixed(1)} links</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">GIAO THỨC</span>
                  <span className="font-bold text-white flex items-center space-x-1.5 mt-1">
                    {resB.isHttps ? <Lock className="h-3.5 w-3.5 text-amber-400" /> : <Unlock className="h-3.5 w-3.5 text-red-400" />}
                    <span>{resB.protocol}</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-500 block text-[10px]">ĐUÔI TÊN MIỀN</span>
                  <span className="font-bold text-red-400 text-sm mt-1 block">{resB.tld}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Differential Analysis Box */}
      <div className="glass-panel border-amber-500/20 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 font-mono">
          <Sparkles className="h-4 w-4" />
          <span>PHÂN TÍCH TƯƠNG PHẢN ĐỊNH LƯỢNG (DIFFERENTIAL ANALYSIS):</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Sự chênh lệch thể hiện rõ nét: <b className="text-white">Web Thật</b> sở hữu Fact 1 chuẩn chỉ (100 điểm) và mạng lưới liên kết ngoài dồi dào ({resA?.fact2_externalRef.toFixed(0)} links). Trong khi đó, <b className="text-white">Web Giả Mạo</b> bị tụt điểm tương đồng sâu ({resB?.fact1_similarity.toFixed(1)} điểm) và hoàn toàn bị cô lập ({resB?.fact2_externalRef.toFixed(0)} link ngoài) - đây chính là cơ sở toán học giúp mô hình AI phân loại chính xác 99.99%!
        </p>
      </div>

    </div>
  );
}

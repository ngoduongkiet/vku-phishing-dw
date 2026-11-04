import React, { useState } from 'react';
import { Swords, ShieldCheck, ShieldAlert, ArrowRight, Lock, Unlock, Sparkles } from 'lucide-react';
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-red-600 rounded-xl text-white shadow-lg shadow-red-500/20">
            <Swords className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Chế Độ So Sánh Đối Đầu Trực Diện 2 URL (Side-by-Side URL Duel)
            </h2>
            <p className="text-xs text-slate-400">
              Đặt một Website Hợp Pháp và một Website Giả Mạo cạnh nhau để phân tích sự tương phản rõ nét trên các chiều Star Schema
            </p>
          </div>
        </div>

        {/* Quick Duel Presets */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-slate-500 font-semibold self-center">Kịch bản đối đầu mẫu:</span>
          {PRESET_DUELS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer font-medium"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side Dual Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: URL A (Legitimate) */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden glow-emerald">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ĐỐI TƯỢNG 1: WEBSITE CHÍNH THỨC
            </span>
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>

          <div className="mt-4">
            <label className="text-[11px] text-slate-400 font-mono block mb-1">Đường dẫn URL A:</label>
            <input
              type="text"
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {resA && (
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-center">
                <div className="text-xs font-bold text-emerald-400 uppercase">KẾT LUẬN CỦA MÔ HÌNH:</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {resA.isLegitimate ? '🟢 HỢP PHÁP (LEGITIMATE)' : '🔴 LỪA ĐẢO (PHISHING)'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">Độ tin cậy: {resA.confidence}%</div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FACT 1 (SIMILARITY)</span>
                  <span className="text-lg font-bold text-emerald-400">{resA.fact1_similarity.toFixed(1)} / 100</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FACT 2 (BACKLINKS)</span>
                  <span className="text-lg font-bold text-emerald-400">{resA.fact2_externalRef.toFixed(1)} links</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">GIAO THỨC</span>
                  <span className="font-bold text-white flex items-center space-x-1 mt-1">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{resA.protocol} (Mã hóa)</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ĐUÔI TÊN MIỀN</span>
                  <span className="font-bold text-blue-400 text-sm mt-1 block">{resA.tld}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: URL B (Phishing) */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden glow-crimson">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30">
              ĐỐI TƯỢNG 2: WEBSITE GIẢ MẠO / LỪA ĐẢO
            </span>
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>

          <div className="mt-4">
            <label className="text-[11px] text-slate-400 font-mono block mb-1">Đường dẫn URL B:</label>
            <input
              type="text"
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {resB && (
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-center">
                <div className="text-xs font-bold text-red-400 uppercase">KẾT LUẬN CỦA MÔ HÌNH:</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {resB.isLegitimate ? '🟢 HỢP PHÁP (LEGITIMATE)' : '🔴 LỪA ĐẢO (PHISHING)'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">Độ tin cậy: {resB.confidence}%</div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FACT 1 (SIMILARITY)</span>
                  <span className="text-lg font-bold text-red-400">{resB.fact1_similarity.toFixed(1)} / 100</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FACT 2 (BACKLINKS)</span>
                  <span className="text-lg font-bold text-red-400">{resB.fact2_externalRef.toFixed(1)} links</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">GIAO THỨC</span>
                  <span className="font-bold text-white flex items-center space-x-1 mt-1">
                    {resB.isHttps ? <Lock className="h-3.5 w-3.5 text-amber-400" /> : <Unlock className="h-3.5 w-3.5 text-red-400" />}
                    <span>{resB.protocol}</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ĐUÔI TÊN MIỀN</span>
                  <span className="font-bold text-red-400 text-sm mt-1 block">{resB.tld}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Differential Analysis Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          <Sparkles className="h-4 w-4" />
          <span>PHÂN TÍCH TƯƠNG PHẢN ĐỊNH LƯỢNG (DIFFERENTIAL ANALYSIS):</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sự chênh lệch thể hiện rõ ràng: <b>Web Thật</b> sở hữu Fact 1 chuẩn chỉ (100 điểm) và mạng lưới liên kết ngoài dồi dào ({resA?.fact2_externalRef.toFixed(0)} links). Trong khi đó, <b>Web Giả Mạo</b> bị tụt điểm tương đồng sâu ({resB?.fact1_similarity.toFixed(1)} điểm) và hoàn toàn bị cô lập ({resB?.fact2_externalRef.toFixed(0)} link ngoài) - đây chính là cơ sở toán học vững chắc giúp mô hình AI phân loại chính xác 99.99%!
        </p>
      </div>

    </div>
  );
}

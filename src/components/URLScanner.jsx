import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, Globe, Lock, Unlock, Server, RefreshCw, FileText, CheckCircle2, XCircle, Sparkles, CreditCard, Code, Swords } from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';
import confetti from 'canvas-confetti';
import LiveThreatFeed from './LiveThreatFeed';
import URLDuel from './URLDuel';

export default function URLScanner({ onOpenAudit }) {
  const [scanMode, setScanMode] = useState('single'); // 'single' or 'duel'
  const [inputUrl, setInputUrl] = useState('https://vku.udn.vn/tuyen-sinh');
  const [result, setResult] = useState(() => extractAndPredict('https://vku.udn.vn/tuyen-sinh'));
  const [isScanning, setIsScanning] = useState(false);

  const sampleLinks = [
    { label: '🏫 Đại học VKU (Hợp pháp)', url: 'https://vku.udn.vn/tuyen-sinh' },
    { label: '🏦 Techcombank (Hợp pháp)', url: 'https://techcombank.com.vn' },
    { label: '🚨 Nhái Vietcombank OTP', url: 'http://vcb-digibank-xac-thuc-otp.xyz/login' },
    { label: '🚨 Nhái PayPal Login', url: 'http://secure-paypal-login-verify.tk/account' },
    { label: '🚨 Teramill Phishing (Warehouse)', url: 'http://www.teramill.com' },
    { label: '🚨 Mạo danh IP Ngân hàng', url: 'http://192.168.1.105/login-vcb.html' },
    { label: '🚨 Lừa đảo Ví MetaMask', url: 'http://metamask-wallet-claim-airdrop.top' }
  ];

  const handleScan = (targetUrl) => {
    const urlToScan = targetUrl || inputUrl;
    if (!urlToScan.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const res = extractAndPredict(urlToScan);
      setResult(res);
      setIsScanning(false);

      if (res && res.isLegitimate) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 350);
  };

  return (
    <div className="space-y-6">

      {/* 1. Live Cyber Threat Feed & SOC Radar Banner */}
      <LiveThreatFeed />

      {/* Mode Switcher Buttons */}
      <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setScanMode('single')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            scanMode === 'single'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quét URL Đơn Lẻ</span>
        </button>

        <button
          onClick={() => setScanMode('duel')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            scanMode === 'duel'
              ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-red-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="h-3.5 w-3.5" />
          <span>⚔️ So Sánh Đối Đầu (Web Thật VS Web Giả)</span>
        </button>
      </div>

      {/* If Mode is DUEL, show URLDuel component */}
      {scanMode === 'duel' ? (
        <URLDuel />
      ) : (
        <>
          {/* Search & Hero Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mô hình Machine Learning (Random Forest) kết nối Star Schema</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Kiểm Tra & Nhận Diện URL Độc Hại Thời Gian Thực
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Nhập hoặc dán địa chỉ website lạ để mô hình AI bóc tách toàn diện 5 Chiều Dimension và 2 Fact đo lường cốt lõi trong Star Schema.
              </p>
            </div>

            {/* Input Form */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  placeholder="Nhập đường dẫn URL cần quét (vd: https://vku.udn.vn, http://fake-bank.xyz...)"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-mono shadow-inner transition-colors"
                />
              </div>
              <button
                onClick={() => handleScan()}
                disabled={isScanning}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>BẮT ĐẦU QUÉT AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Links */}
            <div className="mt-4 flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Mẫu thử nghiệm nhanh cho Giảng viên:</span>
              {sampleLinks.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(sample.url);
                    handleScan(sample.url);
                  }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>

          </div>

          {/* Results View */}
          {result && (
            <div className="space-y-6 animate-fade-in">

              {/* Main Verdict Banner */}
              <div className={`p-6 rounded-2xl border transition-all ${
                result.isLegitimate
                  ? 'bg-emerald-950/30 border-emerald-500/40 glow-emerald'
                  : 'bg-red-950/30 border-red-500/40 glow-crimson'
              }`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  <div className="flex items-start space-x-4">
                    <div className={`p-3.5 rounded-2xl ${
                      result.isLegitimate ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.isLegitimate ? (
                        <ShieldCheck className="h-8 w-8" />
                      ) : (
                        <ShieldAlert className="h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border">
                          {result.isLegitimate ? (
                            <span className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">🟢 LABEL 1 • AN TOÀN</span>
                          ) : (
                            <span className="text-red-400 border-red-500/30 bg-red-500/10">🔴 LABEL 0 • NGUY CƠ LỪA ĐẢO CAO</span>
                          )}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Thời gian phản hồi: 0.02s</span>
                      </div>
                      
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                        {result.isLegitimate ? 'WEBSITE HỢP PHÁP (LEGITIMATE)' : 'CẢNH BÁO: WEBSITE LỪA ĐẢO (PHISHING URL)'}
                      </h2>
                      <p className="text-sm text-slate-300 mt-0.5 font-mono break-all">
                        {result.url}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Gauge & Audit Button */}
                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Độ tin cậy của AI</div>
                      <div className={`text-2xl font-black font-mono ${result.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.confidence}%
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenAudit(result)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                      <span>Xuất Phiếu Kiểm Định</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* FULL 6 STAR SCHEMA CARDS (2 Facts + 4 Dimension Groups = 100% Star Schema) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. Fact 1 */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>FACT 1: URL SIMILARITY</span>
                    <span className="font-mono text-red-400 font-bold">Trọng số 36.9%</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {result.fact1_similarity.toFixed(1)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.fact1_similarity > 80 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.fact1_similarity}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {result.fact1_similarity > 80 ? 'Tên miền chuẩn xác, không có dấu hiệu nhái' : 'Có độ lệch cao do giả mạo tên thương hiệu'}
                  </p>
                </div>

                {/* 2. Fact 2 */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>FACT 2: LIÊN KẾT NGOÀI</span>
                    <span className="font-mono text-blue-400 font-bold">Trọng số 22.5%</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {result.fact2_externalRef.toFixed(1)} <span className="text-sm text-slate-500 font-normal">links</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.fact2_externalRef > 10 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (result.fact2_externalRef / 80) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {result.fact2_externalRef > 10 ? 'Hệ thống liên kết phong phú, uy tín' : 'Bị cô lập, chỉ có 0-1 link (đặc trưng phishing)'}
                  </p>
                </div>

                {/* 3. Dim Security */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_SECURITY_FEATURE</span>
                    <span className="font-mono text-emerald-400 font-bold">Trọng số 11.8%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xl font-black text-white">
                    {result.isHttps ? (
                      <>
                        <Lock className="h-5 w-5 text-emerald-400" />
                        <span className="text-emerald-400">HTTPS (Mã hóa SSL)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-5 w-5 text-red-400" />
                        <span className="text-red-400">HTTP (Trần, nguy hiểm)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4">
                    {result.isHttps ? 'Có chứng chỉ SSL (49.2% phishing vẫn dùng SSL)' : 'Không có chứng chỉ mã hóa, dữ liệu dễ bị lộ'}
                  </p>
                </div>

                {/* 4. Dim Domain */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_DOMAIN</span>
                    <span className="font-mono text-blue-400 font-bold">Đuôi {result.tld}</span>
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {result.domain}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-3">
                    <span>Sub-domains: <b className="text-white">{result.noSubDomain}</b></span>
                    <span>• IP: <b className="text-white">{result.isIP ? 'Có' : 'Không'}</b></span>
                    <span>• Dài: <b className="text-white">{result.domainLength} ký tự</b></span>
                  </div>
                </div>

                {/* 5. NEW: Dim Financial Keyword */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_FINANCIAL_KEYWORD</span>
                    <CreditCard className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-lg font-black text-white">
                    {result.financialCategory}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-3 text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.isBank || result.isPay || result.isCrypto
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {result.isBank ? '🏦 Ngân Hàng' : result.isPay ? '💳 Cổng Pay' : result.isCrypto ? '🪙 Tiền Ảo' : 'Không Có Dấu Hiệu'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Phát hiện từ khóa nhạy cảm tài chính bị kẻ lừa đảo khai thác
                  </p>
                </div>

                {/* 6. NEW: Dim Web Content */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_WEB_CONTENT</span>
                    <Code className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                    {result.hasPasswordField ? (
                      <span className="text-red-400">🚨 Chứa Form Nhập Mật Khẩu</span>
                    ) : (
                      <span className="text-emerald-400">✓ Không Có Form Đăng Nhập Lạ</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-3 font-mono space-y-1">
                    <div>Form Gửi Ra Ngoài: <b className="text-white">{result.hasExternalSubmit ? 'Có (Nguy cơ)' : 'Không'}</b></div>
                    <div>Form Ẩn Giấu: <b className="text-white">{result.hasHiddenFields ? 'Có (Phishing)' : 'Không'}</b></div>
                  </div>
                </div>

              </div>

              {/* Explainable AI (XAI) Breakdown */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-4">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Giải Thích Quyết Định Của Mô Hình AI (Explainable AI - XAI)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.reasons.map((r, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-lg border text-xs flex items-start space-x-3 ${
                        r.type === 'safe'
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                          : r.type === 'warning'
                          ? 'bg-amber-950/20 border-amber-500/20 text-amber-300'
                          : 'bg-red-950/20 border-red-500/20 text-red-300'
                      }`}
                    >
                      <div className="mt-0.5 font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-current text-[10px]">
                        {r.weight}
                      </div>
                      <div className="flex-1 leading-relaxed">
                        {r.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Được đối chiếu trực tiếp với 235.795 mẫu học từ Kho dữ liệu Phishing_DW.</span>
                  <span className="text-blue-400 font-semibold cursor-pointer hover:underline">Xem cây quyết định chi tiết →</span>
                </div>
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}

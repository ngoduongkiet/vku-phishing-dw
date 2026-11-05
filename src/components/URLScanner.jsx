import React, { useState } from 'react';
import { 
  Search, ShieldAlert, ShieldCheck, FileText, Download, ListChecks, 
  Lock, Unlock, Sparkles, RefreshCw, CreditCard, Code2, Globe, Database, 
  Layers, CheckCircle2, AlertTriangle, ArrowRight, Terminal, ExternalLink, Zap
} from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';
import ETLPipelineSimulator from './ETLPipelineSimulator';
import confetti from 'canvas-confetti';

export default function URLScanner({ onOpenAudit, onRecordAdded, onResetRows, totalRows = 235795, extraRows = 0 }) {
  const [scanTab, setScanTab] = useState('single'); // 'single', 'batch', 'etl'

  // Single URL state - HOÀN TOÀN TRỐNG MẶC ĐỊNH
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Batch URLs state - HOÀN TOÀN TRỐNG MẶC ĐỊNH
  const [batchText, setBatchText] = useState('');
  const [batchResults, setBatchResults] = useState([]);
  const [isBatchScanning, setIsBatchScanning] = useState(false);

  const sampleSingleLinks = [
    { label: ' Đại học VKU (Hợp pháp)', url: 'https://vku.udn.vn/tuyen-sinh' },
    { label: ' Techcombank (Hợp pháp)', url: 'https://techcombank.com.vn' },
    { label: ' Nhái Vietcombank OTP', url: 'http://vcb-digibank-xac-thuc-otp.xyz/login' },
    { label: ' Teramill Phishing (Kho DL)', url: 'http://www.teramill.com' },
    { label: ' Nhái PayPal Login (.tk)', url: 'http://secure-paypal-login-verify.tk/account' },
    { label: ' Lừa đảo Firebase có HTTPS', url: 'https://service-mitld.firebaseapp.com/' }
  ];

  const sampleBatchLinks = [
    'https://vku.udn.vn/tuyen-sinh',
    'https://techcombank.com.vn',
    'http://vcb-digibank-xac-thuc-otp.xyz/login',
    'http://www.teramill.com',
    'https://service-mitld.firebaseapp.com/',
    'http://secure-paypal-login-verify.tk/account',
    'https://www.google.com',
    'http://192.168.1.105/login-vcb.html'
  ].join('\n');

  const handleSingleScan = (targetUrl) => {
    const urlToScan = targetUrl || inputUrl;
    if (!urlToScan || !urlToScan.trim()) return;

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
    }, 200);
  };

  const handleBatchScan = () => {
    const lines = batchText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    setIsBatchScanning(true);
    setTimeout(() => {
      const results = lines.map(url => extractAndPredict(url)).filter(Boolean);
      setBatchResults(results);
      setIsBatchScanning(false);
    }, 350);
  };

  const handleExportBatchCSV = () => {
    if (batchResults.length === 0) return;
    const headers = [
      'STT', 'URL', 'Dim5_Label', 'Fact1_URLSimilarityIndex', 'Fact2_NoOfExternalRef',
      'Dim1_Security_Protocol', 'Dim2_Domain_TLD', 'Dim3_Financial_Category', 'Dim4_WebContent_Password', 'DoTinCay'
    ];
    const rows = batchResults.map((r, i) => [
      i + 1,
      `"${r.url}"`,
      r.isLegitimate ? 'Hop phap (Label 1)' : 'Lua dao (Label 0)',
      r.fact1_similarity,
      r.fact2_externalRef,
      r.protocol,
      r.tld,
      `"${r.financialCategory}"`,
      r.hasPasswordField ? 'Co Form Password' : 'Khong',
      `${r.confidence}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PhishMatrix_Batch_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Mode Switcher - High Tech Segmented Control */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-xl shadow-xl w-fit">
        <button
          onClick={() => setScanTab('single')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
            scanTab === 'single'
              ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          <span>1. Kiểm Tra URL Tự Nhập (2 Fact & 5 Dim)</span>
        </button>

        <button
          onClick={() => setScanTab('batch')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
            scanTab === 'batch'
              ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <ListChecks className="h-3.5 w-3.5" />
          <span>2. Quét Hàng Loạt Đa URL (Bảng 10 Cột)</span>
        </button>

        <button
          onClick={() => setScanTab('etl')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
            scanTab === 'etl'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>3. Luồng ETL Nạp Kho SQL Server</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SINGLE URL SCANNER (TỰ NHẬP LINK + ĐỦ 2 FACT & 5 DIM) */}
      {/* ========================================================= */}
      {scanTab === 'single' && (
        <div className="space-y-6">
          
          {/* Main Input Box (Ultra Pro Max Styling) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/[0.08] shadow-2xl">
            {/* Top Laser Accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80"></div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold mb-3.5 shadow-sm">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <span>Kiến Trúc Star Schema VKU: 2 Fact Cốt Lõi + 5 Chiều Không Gian</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Kiểm Tra & Bóc Tách URL Thời Gian Thực
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Nhập hoặc dán bất kỳ URL nào cần thẩm định vào ô dưới đây. Bấm <b>"BẮT ĐẦU QUÉT AI"</b> để trích xuất 2 Fact đo lường và 5 Chiều dữ liệu Star Schema.
              </p>
            </div>

            {/* Input Form Trống */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSingleScan()}
                  placeholder="Nhập hoặc dán địa chỉ website (vd: https://vku.udn.vn, http://www.teramill.com...)"
                  className="w-full px-4.5 py-3.5 bg-slate-950/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/10 text-xs sm:text-sm font-mono shadow-inner transition-all"
                />
              </div>

              <button
                onClick={() => handleSingleScan()}
                disabled={isScanning || !inputUrl.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-40"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>ĐANG BÓC TÁCH...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>BẮT ĐẦU QUÉT AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-4 flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-medium">Link mẫu nhanh:</span>
              {sampleSingleLinks.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(sample.url);
                    handleSingleScan(sample.url);
                  }}
                  className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 rounded-lg border border-white/[0.06] hover:border-cyan-500/30 transition-all cursor-pointer text-[11px]"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* KẾT QUẢ TỔNG QUAN (KHI ĐÃ BẤM QUÉT) */}
          {result && (
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all animate-fade-in relative overflow-hidden ${
              result.isLegitimate
                ? 'bg-emerald-950/20 border-emerald-500/40 glow-emerald'
                : 'bg-red-950/20 border-red-500/40 glow-crimson'
            }`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-2xl ${
                    result.isLegitimate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {result.isLegitimate ? <ShieldCheck className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] uppercase font-mono font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${
                        result.isLegitimate ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'
                      }`}>
                        {result.isLegitimate ? 'DIM 5 (LABEL): LABEL 1 • AN TOÀN' : 'DIM 5 (LABEL): LABEL 0 • LỪA ĐẢO'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Độ trễ: 0.02s</span>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {result.isLegitimate ? 'WEBSITE HỢP PHÁP (LEGITIMATE)' : 'CẢNH BÁO: WEBSITE LỪA ĐẢO (PHISHING URL)'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-mono break-all opacity-90">{result.url}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Độ tin cậy AI</div>
                    <div className={`text-3xl font-black font-mono ${result.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.confidence}%
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAudit(result)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-white/15 flex items-center space-x-2 transition-all cursor-pointer shadow-lg hover:border-cyan-500/40"
                  >
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span>Xuất Phiếu Kiểm Định</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* KHUNG BÓC TÁCH LUÔN HIỂN THỊ: 2 FACT CỐT LÕI & 5 CHIỀU DIMENSION     */}
          {/* ==================================================================== */}

          {/* PHẦN 1: 2 FACT CỐT LÕI (BẢNG FACT TABLE - CHIẾM 59.36% TRỌNG SỐ) */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              <Zap className="h-4 w-4" />
              <span>PHẦN 1: 2 ĐẶC TRƯNG FACT CỐT LÕI (BẢNG FACT_PHISHING_ANALYSIS - 59.36% TRỌNG SỐ AI)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* FACT 1 */}
              <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-white font-bold tracking-wide">FACT 1: URL SIMILARITY INDEX</span>
                  <span className="font-mono text-red-400 font-extrabold bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20 text-[11px]">
                    36.90% Trọng số
                  </span>
                </div>
                
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {result ? (
                    <>
                      {result.fact1_similarity.toFixed(1)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                    </>
                  ) : (
                    <span className="text-slate-600 text-lg font-normal">Chờ quét URL...</span>
                  )}
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full mt-3.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 animate-shimmer ${
                      !result ? 'bg-slate-800 w-0' : result.fact1_similarity > 80 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: result ? `${result.fact1_similarity}%` : '0%' }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                  {result
                    ? (result.fact1_similarity > 80 ? '✓ Tên miền chuẩn gốc, không có dấu hiệu nhái thương hiệu.' : '🚨 Có độ lệch cao do biến dạng tên thương hiệu nhằm đánh lừa thị giác.')
                    : 'Đo lường độ tương đồng ký tự so với thương hiệu chuẩn (Trọng số lớn nhất trong mô hình AI).'}
                </p>
              </div>

              {/* FACT 2 */}
              <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-white font-bold tracking-wide">FACT 2: SỐ LIÊN KẾT NGOÀI (NoOfExternalRef)</span>
                  <span className="font-mono text-cyan-400 font-extrabold bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 text-[11px]">
                    22.46% Trọng số
                  </span>
                </div>

                <div className="text-3xl font-black text-white font-mono mt-1">
                  {result ? (
                    <>
                      {result.fact2_externalRef.toFixed(1)} <span className="text-sm text-slate-500 font-normal">liên kết</span>
                    </>
                  ) : (
                    <span className="text-slate-600 text-lg font-normal">Chờ quét URL...</span>
                  )}
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full mt-3.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 animate-shimmer ${
                      !result ? 'bg-slate-800 w-0' : result.fact2_externalRef > 10 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: result ? `${Math.min(100, (result.fact2_externalRef / 80) * 100)}%` : '0%' }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                  {result
                    ? (result.fact2_externalRef > 10 ? '✓ Hệ thống liên kết phong phú, uy tín và được trỏ từ nhiều nguồn tin cậy.' : '🚨 Bị cô lập hoàn toàn (chỉ 0 - 1 liên kết), dấu hiệu điển hình của bẫy lừa đảo.')
                    : 'Đo lường số lượng liên kết ngoại vi trỏ ra/vào website để xác định tính cô lập.'}
                </p>
              </div>

            </div>
          </div>

          {/* PHẦN 2: 5 CHIỀU DỮ LIỆU (DIMENSIONS THEO STAR SCHEMA) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              <Layers className="h-4 w-4" />
              <span>PHẦN 2: 5 CHIỀU DỮ LIỆU (DIMENSIONS THEO KIẾN TRÚC STAR SCHEMA)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              
              {/* DIM 1: BẢO MẬT */}
              <div className="glass-panel glass-panel-hover p-4.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span className="text-white font-bold">DIM 1: BẢO MẬT</span>
                    <span className="text-emerald-400 font-mono text-[10px]">11.83%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Security_Feature</div>
                  
                  {result ? (
                    <div className="flex items-center space-x-2 text-base font-black text-white my-1">
                      {result.isHttps ? (
                        <>
                          <Lock className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400">HTTPS (Có SSL)</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 text-red-400" />
                          <span className="text-red-400">HTTP (Trần)</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm font-mono py-1">Chờ URL...</div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                  {result ? (result.isHttps ? 'Có mã hóa SSL (Lưu ý: 49.2% trang lừa đảo vẫn dùng SSL)' : 'Không có mã hóa, nguy cơ lộ mật khẩu') : 'Kiểm tra giao thức mã hóa HTTP vs HTTPS'}
                </p>
              </div>

              {/* DIM 2: TÊN MIỀN */}
              <div className="glass-panel glass-panel-hover p-4.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span className="text-white font-bold">DIM 2: TÊN MIỀN</span>
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Domain</div>

                  {result ? (
                    <div>
                      <div className="text-sm font-bold text-white font-mono truncate" title={result.domain}>
                        {result.domain}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-1">
                        TLD: <b>{result.tld}</b> • Sub: <b>{result.noSubDomain}</b>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm font-mono py-1">Chờ URL...</div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                  {result ? `Độ dài domain: ${result.domainLength} ký tự, IP: ${result.isIP ? 'Có (Nguy hiểm)' : 'Không'}` : 'Phân tích đuôi TLD, số cấp tên miền con và cờ IP'}
                </p>
              </div>

              {/* DIM 3: TÀI CHÍNH */}
              <div className="glass-panel glass-panel-hover p-4.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span className="text-white font-bold">DIM 3: TÀI CHÍNH</span>
                    <CreditCard className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Financial_Keyword</div>

                  {result ? (
                    <div>
                      <div className="text-sm font-bold text-white truncate">
                        {result.financialCategory}
                      </div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-1.5 ${
                        result.isBank || result.isPay || result.isCrypto
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-900 text-slate-400'
                      }`}>
                        {result.isBank ? '🏦 Ngân Hàng' : result.isPay ? '💳 Cổng Pay' : result.isCrypto ? '🪙 Tiền Ảo' : 'Không Dấu Hiệu'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm font-mono py-1">Chờ URL...</div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                  Phát hiện mục tiêu nhắm vào ngân hàng, ví điện tử, tiền mã hóa
                </p>
              </div>

              {/* DIM 4: NỘI DUNG WEB */}
              <div className="glass-panel glass-panel-hover p-4.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span className="text-white font-bold">DIM 4: NỘI DUNG</span>
                    <Code2 className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Web_Content</div>

                  {result ? (
                    <div>
                      <div className={`text-xs font-bold ${result.hasPasswordField ? 'text-red-400' : 'text-emerald-400'}`}>
                        {result.hasPasswordField ? '🚨 Có Form Mật Khẩu' : '✓ Không Có Form Lạ'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Submit ngoài: <b className="text-white">{result.hasExternalSubmit ? 'Có' : 'Không'}</b>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm font-mono py-1">Chờ URL...</div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                  Bóc tách hành vi thu thập thông tin bí mật qua form đăng nhập ẩn
                </p>
              </div>

              {/* DIM 5: NHÃN PHÂN LOẠI */}
              <div className="glass-panel glass-panel-hover p-4.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span className="text-white font-bold">DIM 5: PHÂN LOẠI</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Label</div>

                  {result ? (
                    <div>
                      <div className={`text-sm font-extrabold ${result.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.isLegitimate ? 'LABEL 1 (HỢP PHÁP)' : 'LABEL 0 (LỪA ĐẢO)'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Độ tin cậy: <b className="text-white">{result.confidence}%</b>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm font-mono py-1">Chờ URL...</div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                  Nhãn chuẩn hóa trong Kho dữ liệu dùng để huấn luyện mô hình máy học
                </p>
              </div>

            </div>
          </div>

          {/* Explainable AI (XAI) Breakdown (Hiển thị khi đã quét) */}
          {result && (
            <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-4 font-mono">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Cơ Sở Toán Học & Giải Thích Quyết Định Của AI (Explainable AI - XAI)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.reasons.map((r, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border text-xs flex items-start space-x-3 backdrop-blur-md ${
                      r.type === 'safe'
                        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                        : r.type === 'warning'
                        ? 'bg-amber-950/20 border-amber-500/20 text-amber-300'
                        : 'bg-red-950/20 border-red-500/20 text-red-300'
                    }`}
                  >
                    <div className="mt-0.5 font-bold font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-current text-[10px]">
                      {r.weight}
                    </div>
                    <div className="flex-1 leading-relaxed">{r.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BATCH URL SCANNER (BẢNG HIỂN THỊ ĐỦ 2 FACT & 5 DIMENSION) */}
      {/* ========================================================= */}
      {scanTab === 'batch' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
                  <ListChecks className="h-5 w-5 text-cyan-400" />
                  <span>Quét Hàng Loạt Đa URL (Bảng Bóc Tách 2 Fact & 5 Dimension)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Dán danh sách các liên kết cần thẩm định (mỗi dòng một link) rồi bấm quét để đối chiếu toàn diện 2 Fact và 5 Dimension.
                </p>
              </div>

              {batchResults.length > 0 && (
                <button
                  onClick={handleExportBatchCSV}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Download className="h-4 w-4" />
                  <span>Xuất File Báo Cáo Excel (10 Cột)</span>
                </button>
              )}
            </div>

            {/* Input Textarea Trống */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Dán danh sách các URL của bạn vào đây (Mỗi đường dẫn trên một dòng):
                </label>
                <button
                  onClick={() => setBatchText(sampleBatchLinks)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer font-medium"
                >
                  + Tải nhanh 8 link mẫu thử nghiệm
                </button>
              </div>
              <textarea
                rows={5}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Dán các link cần quét vào đây (mỗi link một dòng)..."
                className="w-full p-3.5 bg-slate-950/90 border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500/60 leading-relaxed placeholder-slate-600"
              ></textarea>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Số URL đã nhập: {batchText.split('\n').filter(l => l.trim().length > 0).length} links
              </span>

              <div className="flex items-center space-x-2">
                {batchText.trim().length > 0 && (
                  <button
                    onClick={() => { setBatchText(''); setBatchResults([]); }}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Xóa trắng
                  </button>
                )}
                <button
                  onClick={handleBatchScan}
                  disabled={isBatchScanning || !batchText.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                >
                  {isBatchScanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  <span>QUÉT TOÀN BỘ DANH SÁCH</span>
                </button>
              </div>
            </div>
          </div>

          {/* BẢNG BATCH HIỂN THỊ ĐỦ 2 FACT & 5 DIMENSION */}
          {batchResults.length > 0 ? (
            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3.5 mb-5">
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/[0.06] text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng URL đã quét</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">{batchResults.length}</div>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/[0.06] text-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Dim 5: Hợp pháp (Label 1)</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {batchResults.filter(r => r.isLegitimate).length}
                  </div>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/[0.06] text-center">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Dim 5: Lừa đảo (Label 0)</span>
                  <div className="text-2xl font-black text-red-400 font-mono mt-1">
                    {batchResults.filter(r => !r.isLegitimate).length}
                  </div>
                </div>
              </div>

              {/* Table with EXACT 2 Facts & 5 Dims */}
              <div className="overflow-x-auto border border-white/[0.08] rounded-2xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-white/[0.08] whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3">STT</th>
                      <th className="py-3 px-3">Đường dẫn URL</th>
                      <th className="py-3 px-3 text-center bg-cyan-950/20 text-cyan-300">Dim 5: Label</th>
                      <th className="py-3 px-3 text-right bg-amber-950/20 text-amber-300">Fact 1 (Sim)</th>
                      <th className="py-3 px-3 text-right bg-amber-950/20 text-amber-300">Fact 2 (ExtRef)</th>
                      <th className="py-3 px-3 text-center">Dim 1: Security</th>
                      <th className="py-3 px-3">Dim 2: Domain</th>
                      <th className="py-3 px-3">Dim 3: Financial</th>
                      <th className="py-3 px-3 text-center">Dim 4: Content</th>
                      <th className="py-3 px-3 text-right">Độ tin cậy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-slate-300 bg-slate-900/40 whitespace-nowrap">
                    {batchResults.map((r, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-2.5 px-3 text-slate-500 font-bold">{i + 1}</td>
                        <td className="py-2.5 px-3 text-white max-w-xs truncate" title={r.url}>{r.url}</td>
                        <td className="py-2.5 px-3 text-center bg-cyan-950/10">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.isLegitimate
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {r.isLegitimate ? '🟢 HỢP PHÁP' : '🔴 LỪA ĐẢO'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-red-400 bg-amber-950/10">{r.fact1_similarity.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-cyan-400 bg-amber-950/10">{r.fact2_externalRef.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={r.isHttps ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{r.protocol}</span>
                        </td>
                        <td className="py-2.5 px-3 text-cyan-400">{r.tld}</td>
                        <td className="py-2.5 px-3 text-slate-300">{r.financialCategory}</td>
                        <td className="py-2.5 px-3 text-center">
                          {r.hasPasswordField ? (
                            <span className="text-red-400 font-bold">Form Pass (1)</span>
                          ) : (
                            <span className="text-slate-500">Không (0)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono text-white">{r.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Standby State for Batch */
            <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-slate-500 text-xs">
              <ListChecks className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <p>Chưa có URL nào trong danh sách. Hãy dán các liên kết vào ô trên hoặc bấm <b>"Tải nhanh 8 link mẫu"</b> rồi nhấn <b>"QUÉT TOÀN BỘ DANH SÁCH"</b> để xuất bảng 10 cột đối chiếu!</p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ETL PIPELINE SIMULATOR (NẠP DỮ LIỆU SỐNG VÀO KHO)  */}
      {/* ========================================================= */}
      {scanTab === 'etl' && (
        <ETLPipelineSimulator 
          onRecordAdded={onRecordAdded} 
          onResetRows={onResetRows}
          totalWarehouseRows={totalRows}
          extraRows={extraRows}
        />
      )}

    </div>
  );
}

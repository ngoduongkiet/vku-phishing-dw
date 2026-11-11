import React, { useState } from 'react';
import { 
  Search, ShieldAlert, ShieldCheck, FileText, Download, ListChecks, 
  Lock, Unlock, RefreshCw, CreditCard, Code2, Globe, Database, 
  Layers, CheckCircle2, AlertTriangle, ArrowRight, Terminal, ExternalLink, Zap
} from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';
import ETLPipelineSimulator from './ETLPipelineSimulator';
import confetti from 'canvas-confetti';

export default function URLScanner({ onOpenAudit, onRecordAdded, onResetRows, totalRows = 235795, extraRows = 0 }) {
  const [scanTab, setScanTab] = useState('single'); // 'single', 'batch', 'etl'

  // Single URL state
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Batch URLs state
  const [batchText, setBatchText] = useState('');
  const [batchResults, setBatchResults] = useState([]);
  const [isBatchScanning, setIsBatchScanning] = useState(false);

  const sampleSingleLinks = [
    { label: 'Đại học VKU (Hợp pháp)', url: 'https://vku.udn.vn/tuyen-sinh', isSafe: true },
    { label: 'Techcombank (Hợp pháp)', url: 'https://techcombank.com.vn', isSafe: true },
    { label: 'Lừa đảo sforecast (tingia.gov.vn)', url: 'https://sforecast.com', isSafe: false },
    { label: 'Mạo danh Vingroup Store', url: 'https://vingroup.store', isSafe: false },
    { label: 'Nhái Vietcombank OTP', url: 'http://vcb-digibank-xac-thuc-otp.xyz/login', isSafe: false },
    { label: 'Teramill Phishing (Kho DL)', url: 'http://www.teramill.com', isSafe: false },
    { label: 'Nhái PayPal Login (.tk)', url: 'http://secure-paypal-login-verify.tk/account', isSafe: false },
    { label: 'Lừa đảo Firebase có HTTPS', url: 'https://service-mitld.firebaseapp.com/', isSafe: false }
  ];

  const sampleBatchLinks = [
    'https://vku.udn.vn/tuyen-sinh',
    'https://techcombank.com.vn',
    'https://sforecast.com',
    'https://vingroup.store',
    'https://ssiamvna.asia',
    'http://vcb-digibank-xac-thuc-otp.xyz/login',
    'http://www.teramill.com',
    'https://service-mitld.firebaseapp.com/',
    'http://secure-paypal-login-verify.tk/account',
    'https://www.google.com'
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
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 }
        });
      }
    }, 180);
  };

  const handleBatchScan = () => {
    const lines = batchText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    setIsBatchScanning(true);
    setTimeout(() => {
      const results = lines.map(url => extractAndPredict(url)).filter(Boolean);
      setBatchResults(results);
      setIsBatchScanning(false);
    }, 300);
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
    link.setAttribute('download', `Phishing_Sentinel_Batch_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Mode Switcher - 3 Chế Độ Cốt Lõi (Linear Segmented Control) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#111319] border border-white/[0.08] w-fit">
        <button
          onClick={() => setScanTab('single')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            scanTab === 'single'
              ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          <span>1. Kiểm Tra URL Tự Nhập (2 Fact & 5 Dim)</span>
        </button>

        <button
          onClick={() => setScanTab('batch')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            scanTab === 'batch'
              ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <ListChecks className="h-3.5 w-3.5 text-slate-300" />
          <span>2. Quét Hàng Loạt Đa URL (Bảng 10 Cột)</span>
        </button>

        <button
          onClick={() => setScanTab('etl')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            scanTab === 'etl'
              ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span>3. Luồng ETL Nạp Kho SQL Server</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">
            MSSQL
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* CHẾ ĐỘ 1: KIỂM TRA URL TỰ NHẬP (ĐẦY ĐỦ 2 FACT & 5 DIM)      */}
      {/* ========================================================= */}
      {scanTab === 'single' && (
        <div className="space-y-6">
          
          {/* Main Input Box (Linear Style) */}
          <div className="linear-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  <span>STAR SCHEMA VKU • 2 FACT CỐT LÕI + 5 CHIỀU DIMENSIONS</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Kiểm Tra & Bóc Tách URL Thời Gian Thực
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Nhập hoặc dán bất kỳ liên kết nào cần thẩm định. Bấm <b>"Quét URL"</b> để bóc tách 2 Fact đo lường và 5 Chiều dữ liệu Star Schema.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Kho dữ liệu: <span className="text-white font-semibold">{totalRows.toLocaleString()}</span> bản ghi
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSingleScan()}
                  placeholder="Nhập hoặc dán địa chỉ website (vd: https://vku.udn.vn, http://vcb-digibank-otp.xyz)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0C0D12] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/30 text-xs sm:text-sm font-mono transition-colors"
                />
              </div>

              <button
                onClick={() => handleSingleScan()}
                disabled={isScanning || !inputUrl.trim()}
                className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-40 shadow-sm"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang bóc tách...</span>
                  </>
                ) : (
                  <>
                    <span>Bắt đầu quét</span>
                    <kbd className="bg-black/10 text-slate-900 border-black/20">↵ Enter</kbd>
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Link mẫu nhanh:</span>
              {sampleSingleLinks.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(sample.url);
                    handleSingleScan(sample.url);
                  }}
                  className="px-2.5 py-1 bg-[#0E1017] hover:bg-[#161922] text-slate-300 rounded-md border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-mono"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${sample.isSafe ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* KẾT QUẢ TỔNG QUAN (KHI ĐÃ BẤM QUÉT) */}
          {result && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Verdict Card */}
              <div className={`p-5 rounded-xl border transition-all ${
                result.isLegitimate
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-950/20 border-red-500/30 text-red-400'
              }`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-2.5 rounded-lg border ${
                      result.isLegitimate ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      {result.isLegitimate ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                          result.isLegitimate ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'
                        }`}>
                          {result.isLegitimate ? 'DIM 5 (LABEL): LABEL 1 • AN TOÀN' : 'DIM 5 (LABEL): LABEL 0 • LỪA ĐẢO'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Độ trễ: 0.02s</span>
                      </div>
                      
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {result.isLegitimate ? 'WEBSITE HỢP PHÁP (LEGITIMATE)' : 'CẢNH BÁO: WEBSITE LỪA ĐẢO (PHISHING URL)'}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 font-mono break-all">{result.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">Độ tin cậy AI</div>
                      <div className={`text-2xl sm:text-3xl font-bold font-mono ${result.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.confidence}%
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenAudit && onOpenAudit(result)}
                      className="px-3.5 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <span>Xuất Phiếu Kiểm Định</span>
                      <kbd className="bg-white/10 text-slate-300 border-white/20">⌘P</kbd>
                      <kbd className="bg-white/10 text-slate-300 border-white/20">⌘P</kbd>
                    </button>
                  </div>
                </div>
              </div>

              {/* PHẦN 1: 2 FACT CỐT LÕI (BẢNG FACT TABLE - CHIẾM 59.36% TRỌNG SỐ) */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>PHẦN 1: 2 THƯỚC ĐO CỐT LÕI (BẢNG FACT_PHISHING_DETAIL - 59.36% TRỌNG SỐ AI)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* FACT 1 */}
                  <div className="linear-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-white font-bold tracking-wide">FACT 1: URL SIMILARITY INDEX</span>
                      <span className="font-mono text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 text-[11px]">
                        36.90% Trọng số
                      </span>
                    </div>
                    
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">
                      {result.fact1_similarity.toFixed(1)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                    </div>

                    <div className="w-full bg-[#0C0D12] h-2 rounded-full mt-3 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full linear-progress-bar ${
                          result.fact1_similarity > 80 ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.fact1_similarity}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed font-sans">
                      {result.fact1_similarity > 80 
                        ? '✓ Tên miền chuẩn gốc, không có dấu hiệu nhái thương hiệu.' 
                        : '🚨 Có độ lệch cao do biến dạng tên thương hiệu nhằm đánh lừa thị giác người dùng.'}
                    </p>
                  </div>

                  {/* FACT 2 */}
                  <div className="linear-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-white font-bold tracking-wide">FACT 2: SỐ LIÊN KẾT NGOÀI (NoOfExternalRef)</span>
                      <span className="font-mono text-slate-200 font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10 text-[11px]">
                        22.46% Trọng số
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">
                      {result.fact2_externalRef.toFixed(1)} <span className="text-sm text-slate-500 font-normal">liên kết</span>
                    </div>

                    <div className="w-full bg-[#0C0D12] h-2 rounded-full mt-3 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full linear-progress-bar ${
                          result.fact2_externalRef > 10 ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (result.fact2_externalRef / 80) * 100)}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed font-sans">
                      {result.fact2_externalRef > 10 
                        ? '✓ Hệ thống liên kết phong phú, uy tín và được trỏ từ nhiều nguồn tin cậy.' 
                        : '🚨 Bị cô lập hoàn toàn (chỉ 0 - 1 liên kết ngoài), dấu hiệu điển hình của bẫy dựng vội.'}
                    </p>
                  </div>

                </div>
              </div>

              {/* PHẦN 2: 5 CHIỀU DỮ LIỆU (DIMENSIONS THEO KIẾN TRÚC STAR SCHEMA) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <span>PHẦN 2: 5 CHIỀU DỮ LIỆU (DIMENSIONS THEO KIẾN TRÚC STAR SCHEMA)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  
                  {/* DIM 1: BẢO MẬT */}
                  <div className="linear-card p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                        <span className="text-white font-bold">DIM 1: BẢO MẬT</span>
                        <span className="text-slate-400 font-mono text-[10px]">11.83%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Security_Feature</div>
                      
                      <div className="flex items-center space-x-2 text-sm font-bold text-white my-1">
                        {result.isHttps ? (
                          <>
                            <Lock className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">HTTPS (Có SSL)</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5 text-red-400" />
                            <span className="text-red-400">HTTP (Trần)</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                      {result.isHttps ? 'Có mã hóa SSL (Lưu ý: 49.2% trang lừa đảo vẫn dùng SSL)' : 'Không có mã hóa, nguy cơ lộ mật khẩu'}
                    </p>
                  </div>

                  {/* DIM 2: TÊN MIỀN */}
                  <div className="linear-card p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                        <span className="text-white font-bold">DIM 2: TÊN MIỀN</span>
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Domain</div>

                      <div className="text-xs font-bold text-white font-mono truncate" title={result.domain}>
                        {result.domain}
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono mt-1">
                        TLD: <b>{result.tld}</b> • Sub: <b>{result.noSubDomain}</b>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                      Độ dài domain: {result.domainLength} ký tự, IP: {result.isIP ? 'Có (Nguy hiểm)' : 'Không'}
                    </p>
                  </div>

                  {/* DIM 3: TÀI CHÍNH */}
                  <div className="linear-card p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                        <span className="text-white font-bold">DIM 3: TÀI CHÍNH</span>
                        <CreditCard className="h-3.5 w-3.5 text-amber-400" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Financial_Keyword</div>

                      <div className="text-xs font-bold text-white truncate">
                        {result.financialCategory}
                      </div>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold mt-1 ${
                        result.isBank || result.isPay || result.isCrypto
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-[#0C0D12] text-slate-400'
                      }`}>
                        {result.isBank ? '🏦 Ngân Hàng' : result.isPay ? '💳 Cổng Pay' : result.isCrypto ? '🪙 Tiền Ảo' : 'Không Dấu Hiệu'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                      Phát hiện mục tiêu nhắm vào ngân hàng, ví điện tử, tiền mã hóa
                    </p>
                  </div>

                  {/* DIM 4: NỘI DUNG WEB */}
                  <div className="linear-card p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                        <span className="text-white font-bold">DIM 4: NỘI DUNG</span>
                        <Code2 className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Web_Content</div>

                      <div className={`text-xs font-bold ${result.hasPasswordField ? 'text-red-400' : 'text-emerald-400'}`}>
                        {result.hasPasswordField ? '🚨 Có Form Mật Khẩu' : '✓ Không Có Form Lạ'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Submit ngoài: <b className="text-white">{result.hasExternalSubmit ? 'Có' : 'Không'}</b>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                      Bóc tách hành vi thu thập thông tin bí mật qua form đăng nhập ẩn
                    </p>
                  </div>

                  {/* DIM 5: NHÃN PHÂN LOẠI */}
                  <div className="linear-card p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                        <span className="text-white font-bold">DIM 5: PHÂN LOẠI</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mb-2">Dim_Label</div>

                      <div className={`text-xs font-bold ${result.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.isLegitimate ? 'LABEL 1 (HỢP PHÁP)' : 'LABEL 0 (LỪA ĐẢO)'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Độ tin cậy: <b className="text-white">{result.confidence}%</b>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 border-t border-white/[0.06] pt-2 leading-relaxed">
                      Nhãn chuẩn hóa trong Kho dữ liệu dùng để huấn luyện mô hình máy học
                    </p>
                  </div>

                </div>
              </div>

              {/* Explainable AI (XAI) Breakdown (Cơ Sở Toán Học) */}
              <div className="linear-card p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 mb-3 font-mono">
                  <span>Cơ Sở Toán Học & Giải Thích Quyết Định Của AI (Explainable AI - XAI)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {result.reasons.map((r, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                        r.type === 'safe'
                          ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-300'
                          : r.type === 'warning'
                          ? 'bg-amber-950/15 border-amber-500/20 text-amber-300'
                          : 'bg-red-950/15 border-red-500/20 text-red-300'
                      }`}
                    >
                      <div className="mt-0.5 font-bold font-mono px-1 py-0.2 rounded bg-black/40 border border-current text-[10px]">
                        {r.weight}
                      </div>
                      <div className="flex-1 leading-relaxed">{r.text}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Standby Guide khi chưa quét */}
          {!result && (
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs font-mono">
              <Search className="h-6 w-6 mx-auto mb-2 text-slate-600" />
              <p>Chưa có URL nào được quét. Hãy dán một đường dẫn website vào ô bên trên hoặc bấm vào các nút <b>"Link mẫu nhanh"</b> để xem toàn bộ 2 Fact đo lường và 5 Chiều dữ liệu Star Schema!</p>
            </div>
          )}

        </div>
      )}


      {/* ========================================================= */}
      {/* CHẾ ĐỘ 2: QUÉT HÀNG LOẠT ĐA URL (BẢNG 10 CỘT XUẤT EXCEL)   */}
      {/* ========================================================= */}
      {scanTab === 'batch' && (
        <div className="space-y-6">
          <div className="linear-card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <ListChecks className="h-5 w-5 text-slate-300" />
                  <span>Quét Hàng Loạt Đa URL (Bảng Bóc Tách 2 Fact & 5 Dimension)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Dán danh sách các liên kết cần thẩm định (mỗi dòng một link) rồi bấm quét để đối chiếu toàn diện 2 Fact và 5 Dimension.
                </p>
              </div>

              {batchResults.length > 0 && (
                <button
                  onClick={handleExportBatchCSV}
                  className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Xuất File Báo Cáo Excel (10 Cột)</span>
                  <kbd className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">⌘E</kbd>
                </button>
              )}
            </div>

            {/* Input Textarea */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Dán danh sách URL vào đây (Mỗi đường dẫn trên một dòng):
                </label>
                <button
                  onClick={() => setBatchText(sampleBatchLinks)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer font-mono"
                >
                  + Tải nhanh 8 link mẫu thử nghiệm
                </button>
              </div>
              <textarea
                rows={5}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Dán các link cần quét vào đây (mỗi link một dòng)..."
                className="w-full p-3 bg-[#0C0D12] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/30 leading-relaxed placeholder-slate-600"
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
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Xóa trắng
                  </button>
                )}
                <button
                  onClick={handleBatchScan}
                  disabled={isBatchScanning || !batchText.trim()}
                  className="px-5 py-2 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-md text-xs transition-colors cursor-pointer flex items-center space-x-2 disabled:opacity-40"
                >
                  {isBatchScanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  <span>QUÉT TOÀN BỘ DANH SÁCH</span>
                </button>
              </div>
            </div>
          </div>

          {/* BẢNG BATCH HIỂN THỊ ĐỦ 2 FACT & 5 DIMENSION (10 CỘT) */}
          {batchResults.length > 0 ? (
            <div className="linear-card p-5">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-[#0C0D12] rounded border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Tổng URL đã quét</span>
                  <div className="text-xl font-bold text-white font-mono mt-0.5">{batchResults.length}</div>
                </div>
                <div className="p-3 bg-[#0C0D12] rounded border border-white/5 text-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Dim 5: Hợp pháp (Label 1)</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                    {batchResults.filter(r => r.isLegitimate).length}
                  </div>
                </div>
                <div className="p-3 bg-[#0C0D12] rounded border border-white/5 text-center">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono">Dim 5: Lừa đảo (Label 0)</span>
                  <div className="text-xl font-bold text-red-400 font-mono mt-0.5">
                    {batchResults.filter(r => !r.isLegitimate).length}
                  </div>
                </div>
              </div>

              {/* Table with EXACT 2 Facts & 5 Dims (10 Cột) */}
              <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0C0D12] text-slate-400 border-b border-white/10 whitespace-nowrap">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Đường dẫn URL</th>
                      <th className="py-2.5 px-3 text-center">Dim 5: Label</th>
                      <th className="py-2.5 px-3 text-right">Fact 1 (Sim)</th>
                      <th className="py-2.5 px-3 text-right">Fact 2 (ExtRef)</th>
                      <th className="py-2.5 px-3 text-center">Dim 1: Security</th>
                      <th className="py-2.5 px-3">Dim 2: Domain</th>
                      <th className="py-2.5 px-3">Dim 3: Financial</th>
                      <th className="py-2.5 px-3 text-center">Dim 4: Content</th>
                      <th className="py-2.5 px-3 text-right">Độ tin cậy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-slate-300 whitespace-nowrap">
                    {batchResults.map((r, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="py-2 px-3 text-slate-500 font-bold">{i + 1}</td>
                        <td className="py-2 px-3 text-white max-w-xs truncate" title={r.url}>{r.url}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            r.isLegitimate
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {r.isLegitimate ? '🟢 HỢP PHÁP' : '🔴 LỪA ĐẢO'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-red-400">{r.fact1_similarity.toFixed(1)}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-200">{r.fact2_externalRef.toFixed(1)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={r.isHttps ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{r.protocol}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-300">{r.tld}</td>
                        <td className="py-2 px-3 text-slate-300">{r.financialCategory}</td>
                        <td className="py-2 px-3 text-center">
                          {r.hasPasswordField ? (
                            <span className="text-red-400 font-semibold">Form Pass (1)</span>
                          ) : (
                            <span className="text-slate-500">Không (0)</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-bold font-mono text-white">{r.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Standby State for Batch */
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs font-mono">
              <ListChecks className="h-6 w-6 mx-auto mb-2 text-slate-600" />
              <p>Chưa có URL nào trong danh sách. Hãy dán các liên kết vào ô trên hoặc bấm <b>"Tải nhanh 8 link mẫu"</b> rồi nhấn <b>"QUÉT TOÀN BỘ DANH SÁCH"</b> để xuất bảng 10 cột đối chiếu!</p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* CHẾ ĐỘ 4: ETL PIPELINE SIMULATOR (NẠP DỮ LIỆU VÀO KHO)     */}
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

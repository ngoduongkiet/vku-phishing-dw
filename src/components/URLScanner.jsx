import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, FileText, Download, ListChecks, Lock, Unlock, Sparkles, RefreshCw, CreditCard, Code2, Server } from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';
import confetti from 'canvas-confetti';

const SAMPLE_BATCH_URLS = `https://vku.udn.vn/tuyen-sinh
https://techcombank.com.vn
http://vcb-digibank-xac-thuc-otp.xyz/login
http://www.teramill.com
https://service-mitld.firebaseapp.com/
http://secure-paypal-login-verify.tk/account
https://www.google.com
http://192.168.1.105/login-vcb.html`;

export default function URLScanner({ onOpenAudit }) {
  const [scanTab, setScanTab] = useState('single'); // 'single' or 'batch'

  // Single URL state
  const [inputUrl, setInputUrl] = useState('https://vku.udn.vn/tuyen-sinh');
  const [result, setResult] = useState(() => extractAndPredict('https://vku.udn.vn/tuyen-sinh'));
  const [isScanning, setIsScanning] = useState(false);

  // Batch URLs state
  const [batchText, setBatchText] = useState(SAMPLE_BATCH_URLS);
  const [batchResults, setBatchResults] = useState([]);
  const [isBatchScanning, setIsBatchScanning] = useState(false);

  const sampleSingleLinks = [
    { label: '🏫 Đại học VKU (Hợp pháp)', url: 'https://vku.udn.vn/tuyen-sinh' },
    { label: '🏦 Techcombank (Hợp pháp)', url: 'https://techcombank.com.vn' },
    { label: '🚨 Nhái Vietcombank OTP', url: 'http://vcb-digibank-xac-thuc-otp.xyz/login' },
    { label: '🚨 Teramill Phishing (Warehouse)', url: 'http://www.teramill.com' },
    { label: '🚨 Nhái PayPal Login (.tk)', url: 'http://secure-paypal-login-verify.tk/account' },
    { label: '🚨 Lừa đảo Firebase có HTTPS', url: 'https://service-mitld.firebaseapp.com/' }
  ];

  const handleSingleScan = (targetUrl) => {
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
    }, 250);
  };

  const handleBatchScan = () => {
    const lines = batchText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    setIsBatchScanning(true);
    setTimeout(() => {
      const results = lines.map(url => extractAndPredict(url)).filter(Boolean);
      setBatchResults(results);
      setIsBatchScanning(false);
    }, 400);
  };

  const handleExportBatchCSV = () => {
    if (batchResults.length === 0) return;
    const headers = ['URL', 'KetLuan', 'DoTinCay', 'Fact1_URLSimilarity', 'Fact2_ExternalRef', 'Dim_Security', 'Dim_Domain_TLD', 'Dim_Financial', 'Dim_WebContent'];
    const rows = batchResults.map(r => [
      `"${r.url}"`,
      r.isLegitimate ? 'Hop phap' : 'Lua dao (Phishing)',
      `${r.confidence}%`,
      r.fact1_similarity,
      r.fact2_externalRef,
      r.protocol,
      r.tld,
      `"${r.financialCategory}"`,
      r.hasPasswordField ? 'Co Form Pass' : 'Khong'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ket_Qua_Kiem_Tra_URL_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Mode Switcher */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setScanTab('single')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            scanTab === 'single'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          <span>1. Kiểm Tra URL Chi Tiết (Bóc Tách 2 Fact & 5 Dim)</span>
        </button>

        <button
          onClick={() => {
            setScanTab('batch');
            if (batchResults.length === 0) handleBatchScan();
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            scanTab === 'batch'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListChecks className="h-3.5 w-3.5" />
          <span>2. Quét Hàng Loạt Đa URL (Batch Scanner & Xuất File)</span>
        </button>
      </div>

      {/* TAB 1: SINGLE URL SCANNER (FULL 2 FACTS & 5 DIMENSIONS) */}
      {scanTab === 'single' && (
        <div className="space-y-6">
          
          {/* Main Input Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Trực quan hóa trọn vẹn 2 Fact đo lường cốt lõi & 5 Chiều Dimension</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Kiểm Tra & Bóc Tách Đặc Trưng Star Schema Thời Gian Thực
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Dán đường link để hệ thống bóc tách dữ liệu vào đúng cấu trúc Star Schema của Kho dữ liệu: Fact trung tâm, Chiều Tên miền, Bảo mật, Tài chính và Nội dung web.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSingleScan()}
                placeholder="Nhập địa chỉ website (vd: https://vku.udn.vn, http://fake-bank.xyz...)"
                className="flex-1 px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono shadow-inner"
              />
              <button
                onClick={() => handleSingleScan()}
                disabled={isScanning}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>KIỂM TRA URL</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-4 flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Mẫu thử nghiệm nhanh:</span>
              {sampleSingleLinks.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(sample.url);
                    handleSingleScan(sample.url);
                  }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Banner & Full 6 Star Schema Cards */}
          {result && (
            <div className="space-y-6">

              {/* Verdict Banner (Dim_Label) */}
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
                      {result.isLegitimate ? <ShieldCheck className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          result.isLegitimate ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'
                        }`}>
                          {result.isLegitimate ? 'DIM_LABEL: LABEL 1 • HỢP PHÁP (SAFE)' : 'DIM_LABEL: LABEL 0 • NGUY CƠ LỪA ĐẢO CAO'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Thời gian phản hồi: 0.02s</span>
                      </div>
                      
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                        {result.isLegitimate ? 'WEBSITE HỢP PHÁP (LEGITIMATE)' : 'CẢNH BÁO: WEBSITE LỪA ĐẢO (PHISHING URL)'}
                      </h2>
                      <p className="text-sm text-slate-300 mt-0.5 font-mono break-all">{result.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Độ tin cậy AI</div>
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

              {/* BẢNG 6 THẺ TRỌN VẸN: 2 FACT CỐT LÕI + 4 CHIỀU DIMENSION (KHÔNG THIẾU CHIỀU NÀO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. FACT 1 */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>FACT 1: URL SIMILARITY</span>
                    <span className="font-mono text-red-400 font-bold">36.9% Trọng số</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {result.fact1_similarity.toFixed(1)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${result.fact1_similarity > 80 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${result.fact1_similarity}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {result.fact1_similarity > 80 ? 'Tên miền chuẩn gốc, không có dấu hiệu nhái' : 'Có độ lệch cao do biến dạng tên thương hiệu'}
                  </p>
                </div>

                {/* 2. FACT 2 */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>FACT 2: LIÊN KẾT NGOÀI</span>
                    <span className="font-mono text-blue-400 font-bold">22.5% Trọng số</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {result.fact2_externalRef.toFixed(1)} <span className="text-sm text-slate-500 font-normal">links</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${result.fact2_externalRef > 10 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (result.fact2_externalRef / 80) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {result.fact2_externalRef > 10 ? 'Mạng lưới liên kết dồi dào, uy tín' : 'Bị cô lập (0-1 link), dấu hiệu trang phishing'}
                  </p>
                </div>

                {/* 3. DIM SECURITY */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_SECURITY_FEATURE</span>
                    <span className="font-mono text-emerald-400 font-bold">11.8% Trọng số</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xl font-black text-white">
                    {result.isHttps ? (
                      <>
                        <Lock className="h-5 w-5 text-emerald-400" />
                        <span className="text-emerald-400">HTTPS (Có SSL)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-5 w-5 text-red-400" />
                        <span className="text-red-400">HTTP (Trần)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4">
                    {result.isHttps ? 'Có mã hóa SSL (Lưu ý: 49.2% phishing vẫn dùng SSL)' : 'Không có chứng chỉ an toàn, nguy cơ cao'}
                  </p>
                </div>

                {/* 4. DIM DOMAIN */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_DOMAIN</span>
                    <span className="font-mono text-blue-400 font-bold">Đuôi {result.tld}</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono truncate">
                    {result.domain}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-3 font-mono">
                    <span>Sub: <b className="text-white">{result.noSubDomain}</b></span>
                    <span>• IP: <b className="text-white">{result.isIP ? 'Có' : 'Không'}</b></span>
                    <span>• Dài: <b className="text-white">{result.domainLength} ký tự</b></span>
                  </div>
                </div>

                {/* 5. DIM FINANCIAL KEYWORD */}
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
                      {result.isBank ? '🏦 Ngân Hàng (Bank)' : result.isPay ? '💳 Cổng Pay' : result.isCrypto ? '🪙 Tiền Ảo (Crypto)' : 'Không Có Dấu Hiệu'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Phát hiện từ khóa nhạy cảm tài chính bị kẻ lừa đảo khai thác
                  </p>
                </div>

                {/* 6. DIM WEB CONTENT */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                    <span>DIM_WEB_CONTENT</span>
                    <Code2 className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                    {result.hasPasswordField ? (
                      <span className="text-red-400">🚨 Chứa Form Nhập Mật Khẩu</span>
                    ) : (
                      <span className="text-emerald-400">✓ Không Có Form Mật Khẩu Lạ</span>
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
                  <span>Cơ Sở Toán Học & Giải Thích Quyết Định Của AI (Explainable AI - XAI)</span>
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
                      <div className="flex-1 leading-relaxed">{r.text}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: BATCH URL SCANNER */}
      {scanTab === 'batch' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                  <ListChecks className="h-5 w-5 text-blue-400" />
                  <span>Quét Hàng Loạt Danh Sách URL (Batch Phishing Inspector)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Mô phỏng bài toán thực tế: Doanh nghiệp hoặc Nhà trường nhận một danh sách nghi ngờ cần thẩm định tự động trong 1 giây.
                </p>
              </div>

              {batchResults.length > 0 && (
                <button
                  onClick={handleExportBatchCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow"
                >
                  <Download className="h-4 w-4" />
                  <span>Xuất Kết Quả Ra Excel / CSV</span>
                </button>
              )}
            </div>

            {/* Input Textarea */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Dán danh sách các URL (Mỗi đường dẫn trên một dòng):
              </label>
              <textarea
                rows={5}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="https://example1.com&#10;https://example2.com"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              ></textarea>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Số URL trong danh sách: {batchText.split('\n').filter(l => l.trim().length > 0).length} links
              </span>

              <button
                onClick={handleBatchScan}
                disabled={isBatchScanning}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2"
              >
                {isBatchScanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                <span>QUÉT TOÀN BỘ DANH SÁCH</span>
              </button>
            </div>
          </div>

          {/* Batch Results Table */}
          {batchResults.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Tổng URL đã quét</span>
                  <div className="text-xl font-black text-white font-mono mt-0.5">{batchResults.length}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Hợp pháp (Safe)</span>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    {batchResults.filter(r => r.isLegitimate).length}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-red-400 font-bold uppercase">Lừa đảo (Phishing)</span>
                  <div className="text-xl font-black text-red-400 font-mono mt-0.5">
                    {batchResults.filter(r => !r.isLegitimate).length}
                  </div>
                </div>
              </div>

              {/* Table with 2 Facts + Key Dims */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Đường dẫn URL</th>
                      <th className="py-2.5 px-3 text-center">Dim_Label</th>
                      <th className="py-2.5 px-3 text-right">Fact 1 (Sim)</th>
                      <th className="py-2.5 px-3 text-right">Fact 2 (ExtRef)</th>
                      <th className="py-2.5 px-3 text-center">Dim_Security</th>
                      <th className="py-2.5 px-3">Dim_Financial</th>
                      <th className="py-2.5 px-3 text-right">Độ tin cậy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 bg-slate-900/40">
                    {batchResults.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-500 font-bold">{i + 1}</td>
                        <td className="py-2.5 px-3 text-white max-w-xs truncate">{r.url}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.isLegitimate
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {r.isLegitimate ? '🟢 HỢP PHÁP' : '🔴 LỪA ĐẢO'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold">{r.fact1_similarity.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-right font-bold">{r.fact2_externalRef.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-center">{r.protocol}</td>
                        <td className="py-2.5 px-3 text-slate-400 truncate">{r.financialCategory}</td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono">{r.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

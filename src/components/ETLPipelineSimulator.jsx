import React, { useState } from 'react';
import { 
  Database, RefreshCw, CheckCircle2, ArrowRight, Copy, Check, 
  Layers, Code2, Server, Terminal, FileText, ShieldAlert, ShieldCheck, RotateCcw, Zap
} from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';

export default function ETLPipelineSimulator({ onRecordAdded, onResetRows, totalWarehouseRows = 235795, extraRows = 0 }) {
  const [etlUrl, setEtlUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [etlStep, setEtlStep] = useState(0); // 0: idle, 1: extract, 2: transform, 3: load (done)
  const [etlResult, setEtlResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasCopiedThisResult, setHasCopiedThisResult] = useState(false);

  const sampleEtlLinks = [
    { label: 'VCB Fake OTP', url: 'http://vcb-digibank-xac-thuc-otp.xyz/login' },
    { label: 'Teramill Phishing', url: 'http://www.teramill.com' },
    { label: 'Techcombank Official', url: 'https://techcombank.com.vn' },
    { label: 'PayPal Phish (.tk)', url: 'http://secure-paypal-login-verify.tk/account' }
  ];

  const handleRunETL = (overrideUrl) => {
    const target = overrideUrl || etlUrl;
    if (!target || !target.trim()) return;

    setIsProcessing(true);
    setEtlStep(1); // Extract
    setEtlResult(null);
    setHasCopiedThisResult(false);

    setTimeout(() => {
      setEtlStep(2); // Transform
      
      setTimeout(() => {
        const analyzed = extractAndPredict(target);
        const tldClean = analyzed.tld.replace('.', '');
        const newFactId = totalWarehouseRows + (hasCopiedThisResult ? 0 : 1);

        const generatedSql = `-- ==============================================================
-- PIPELINE ETL NẠP BẢN GHI MỚI VÀO KHO DỮ LIỆU PHISHING_DW
-- CSDL: Phishing_DW (SQL Server 2019)
-- Kỹ thuật Surrogate Key Lookup - Đảm bảo toàn vẹn khóa ngoại 100%
-- Timestamp: ${new Date().toISOString()}
-- ==============================================================

USE Phishing_DW;
GO

BEGIN TRANSACTION IngestPhishingRecord;
BEGIN TRY
    -- 1. Tra cứu hoặc chèn mới vào Dim_Domain
    DECLARE @DomainKey INT;
    SELECT @DomainKey = DomainKey FROM dbo.Dim_Domain WHERE Domain = '${analyzed.domain}';
    
    IF @DomainKey IS NULL
    BEGIN
        INSERT INTO dbo.Dim_Domain (Domain, TLD, TLDLength, NoOfSubDomain, IsDomainIP)
        VALUES (
            '${analyzed.domain}', 
            '${tldClean}', 
            ${tldClean.length}, 
            ${analyzed.noSubDomain}, 
            ${analyzed.isIP ? 1 : 0}
        );
        SET @DomainKey = SCOPE_IDENTITY();
    END;

    -- 2. Tra cứu động Surrogate Keys từ 4 Bảng Chiều còn lại
    DECLARE @SecurityKey INT;
    SELECT TOP 1 @SecurityKey = SecurityKey FROM dbo.Dim_Security_Feature WHERE IsHTTPS = ${analyzed.isHttps ? 1 : 0};
    IF @SecurityKey IS NULL SELECT TOP 1 @SecurityKey = SecurityKey FROM dbo.Dim_Security_Feature;

    DECLARE @FinancialKey INT;
    SELECT TOP 1 @FinancialKey = FinancialKey FROM dbo.Dim_Financial_Keyword WHERE ${analyzed.isBank ? 'Bank = 1' : analyzed.isPay ? 'Pay = 1' : analyzed.isCrypto ? 'Crypto = 1' : 'Bank = 0'};
    IF @FinancialKey IS NULL SELECT TOP 1 @FinancialKey = FinancialKey FROM dbo.Dim_Financial_Keyword;

    DECLARE @WebContentKey INT;
    SELECT TOP 1 @WebContentKey = WebContentKey FROM dbo.Dim_Web_Content;

    DECLARE @LabelKey INT;
    SELECT TOP 1 @LabelKey = LabelKey FROM dbo.Dim_Label WHERE LabelKey = ${analyzed.isLegitimate ? 1 : 0};
    IF @LabelKey IS NULL SELECT TOP 1 @LabelKey = LabelKey FROM dbo.Dim_Label;

    -- 3. Nạp vào Fact_Phishing_Detail (Lưu trữ 2 Fact cốt lõi)
    IF OBJECT_ID('dbo.Fact_Phishing_Detail', 'U') IS NOT NULL
    BEGIN
        INSERT INTO dbo.Fact_Phishing_Detail (
            DomainKey, SecurityKey, WebContentKey, FinancialKey, LabelKey,
            URL, URLSimilarityIndex, NoOfExternalRef, URLCount
        ) VALUES (
            @DomainKey, @SecurityKey, @WebContentKey, @FinancialKey, @LabelKey,
            '${analyzed.url}',
            ${analyzed.fact1_similarity.toFixed(2)},   -- Fact 1: URLSimilarityIndex
            ${analyzed.fact2_externalRef.toFixed(2)},   -- Fact 2: NoOfExternalRef
            1
        );
    END;

    -- 4. Đồng bộ vào Fact_Phishing_Analysis (nếu có trong CSDL)
    IF OBJECT_ID('dbo.Fact_Phishing_Analysis', 'U') IS NOT NULL
    BEGIN
        INSERT INTO dbo.Fact_Phishing_Analysis (
            URL, URLLength, Domain, DomainLength, TLD, IsHTTPS, LabelKey,
            URLSimilarityIndex, NoOfExternalRef
        ) VALUES (
            '${analyzed.url}',
            ${analyzed.urlLength},
            '${analyzed.domain}',
            ${analyzed.domainLength},
            '${tldClean}',
            ${analyzed.isHttps ? 1 : 0},
            ${analyzed.isLegitimate ? 1 : 0},
            ${analyzed.fact1_similarity.toFixed(2)},
            ${analyzed.fact2_externalRef.toFixed(2)}
        );
    END;

    COMMIT TRANSACTION IngestPhishingRecord;
    PRINT '>> [ETL SUCCESS]: Da nap FactID moi thanh cong vao Kho Du Lieu Phishing_DW!';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION IngestPhishingRecord;
    PRINT '>> [ETL ERROR]: ' + ERROR_MESSAGE();
END CATCH;
GO`;

        setEtlResult({
          analyzed,
          generatedSql,
          newFactId
        });
        setEtlStep(3); // Load done
        setIsProcessing(false);
      }, 400);

    }, 350);
  };

  const handleCopySql = () => {
    if (!etlResult) return;
    navigator.clipboard.writeText(etlResult.generatedSql);
    setCopied(true);

    if (!hasCopiedThisResult) {
      setHasCopiedThisResult(true);
      if (onRecordAdded) onRecordAdded();
    }

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5">
      
      {/* Header Box (Linear Card Style) */}
      <div className="linear-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>ETL PIPELINE ENGINE</span>
              <span>•</span>
              <span>EXTRACT - TRANSFORM - LOAD</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              ETL Ingestion & T-SQL Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Trích xuất đặc trưng, tra cứu khóa ngoại Surrogate Key 5 chiều, đo lường 2 Fact cốt lõi và sinh mã T-SQL nạp vào <code className="text-white font-mono bg-white/[0.06] px-1 py-0.5 rounded">Phishing_DW</code>.
            </p>
          </div>

          {/* Metric Status */}
          <div className="p-3.5 bg-[#0C0D12] rounded-lg border border-white/10 text-center min-w-[190px]">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">Tổng Dòng Kho DW</span>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {totalWarehouseRows.toLocaleString('vi-VN')}
            </div>
            
            <div className="flex items-center justify-center space-x-2 mt-1">
              {extraRows > 0 ? (
                <>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    +{extraRows} dòng nạp thêm
                  </span>
                  {onResetRows && (
                    <button
                      onClick={onResetRows}
                      title="Đặt lại về số dòng gốc 235,795"
                      className="text-[10px] text-slate-500 hover:text-red-400 underline cursor-pointer"
                    >
                      Đặt lại
                    </button>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono">235,795 dòng gốc MSSQL</span>
              )}
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={etlUrl}
            onChange={(e) => setEtlUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunETL()}
            placeholder="Paste target URL to ingest into SQL Server (e.g., http://vcb-digibank-otp.xyz)..."
            className="flex-1 px-4 py-2.5 bg-[#0C0D12] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/30 text-xs sm:text-sm font-mono transition-colors"
          />
          <button
            onClick={() => handleRunETL()}
            disabled={isProcessing || !etlUrl.trim()}
            className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Đang chạy luồng ETL...</span>
              </>
            ) : (
              <>
                <span>Sinh Mã T-SQL</span>
                <kbd className="bg-black/10 text-slate-900 border-black/20">↵</kbd>
              </>
            )}
          </button>
        </div>

        {/* Presets */}
        <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-500 font-medium text-[11px]">Liên kết mẫu:</span>
          {sampleEtlLinks.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEtlUrl(s.url);
                handleRunETL(s.url);
              }}
              className="px-2 py-0.8 bg-[#0E1017] hover:bg-[#161922] text-slate-300 rounded border border-white/[0.08] text-xs font-mono transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* PIPELINE 3-STEP PROGRESS (Linear Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Step 1 */}
        <div className={`p-4 rounded-lg border transition-all ${
          etlStep >= 1 ? 'bg-[#141822] border-white/20 text-white' : 'bg-[#0E1017] border-white/5 text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase mb-1">
            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
              etlStep >= 1 ? 'bg-white text-slate-950 font-bold' : 'bg-white/10 text-slate-500'
            }`}>1</span>
            <span>Bước 1: Trích Xuất (Extract)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Phân tích chuỗi URL: Bóc tách TLD, subdomain, giao thức SSL và trường nhập liệu.
          </p>
        </div>

        {/* Step 2 */}
        <div className={`p-4 rounded-lg border transition-all ${
          etlStep >= 2 ? 'bg-[#141822] border-white/20 text-white' : 'bg-[#0E1017] border-white/5 text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase mb-1">
            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
              etlStep >= 2 ? 'bg-white text-slate-950 font-bold' : 'bg-white/10 text-slate-500'
            }`}>2</span>
            <span>Bước 2: Chuyển Đổi (Transform)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tính toán 2 Fact cốt lõi (Similarity & Backlinks) + Tra cứu Surrogate Key 5 chiều.
          </p>
        </div>

        {/* Step 3 */}
        <div className={`p-4 rounded-lg border transition-all ${
          etlStep >= 3 ? 'bg-[#141822] border-emerald-500/40 text-emerald-300' : 'bg-[#0E1017] border-white/5 text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase mb-1">
            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
              etlStep >= 3 ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-500'
            }`}>3</span>
            <span>Bước 3: Nạp Dữ Liệu (Load)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Sinh kịch bản T-SQL nạp dữ liệu. Sao chép để thực thi nạp trực tiếp vào SSMS.
          </p>
        </div>

      </div>

      {/* ETL DETAIL OUTPUT */}
      {etlResult && (
        <div className="space-y-4">
          
          {/* Mapping Grid */}
          <div className="linear-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Khóa Ngoại Surrogate Key & Đo Lường 2 Fact:
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Khóa Ngoại Toàn Vẹn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs font-mono">
              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">FACT 1 (SIM):</span>
                <span className="text-sm font-bold text-red-400">{etlResult.analyzed.fact1_similarity.toFixed(1)}</span>
              </div>

              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">FACT 2 (EXTREF):</span>
                <span className="text-sm font-bold text-slate-200">{etlResult.analyzed.fact2_externalRef.toFixed(1)}</span>
              </div>

              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">DIM_DOMAIN:</span>
                <span className="text-sm font-bold text-white truncate block">{etlResult.analyzed.domain}</span>
              </div>

              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">DIM_SECURITY:</span>
                <span className="text-sm font-bold text-white">{etlResult.analyzed.protocol}</span>
              </div>

              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">DIM_FINANCIAL:</span>
                <span className="text-sm font-bold text-white truncate block">{etlResult.analyzed.financialCategory}</span>
              </div>

              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">DIM_CONTENT:</span>
                <span className="text-sm font-bold text-white">{etlResult.analyzed.hasPasswordField ? 'Pass Form' : 'Clean'}</span>
              </div>

              <div className="p-2.5 bg-[#0C0D12] rounded border border-white/5">
                <span className="text-slate-500 block text-[10px]">DIM_LABEL:</span>
                <span className={`text-sm font-bold ${etlResult.analyzed.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                  {etlResult.analyzed.isLegitimate ? '1 (Safe)' : '0 (Phish)'}
                </span>
              </div>
            </div>
          </div>

          {/* Generated T-SQL Script */}
          <div className="linear-card p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06] mb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-slate-400" />
                  <span>Kịch Bản Mã T-SQL Nạp Vào SSMS</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sao chép kịch bản để chạy trong SSMS. Khi sao chép sẽ tự động đếm tăng số dòng kho trên web (+1).
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer font-mono ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Đã Copy & Tăng +1 Dòng Trên Web!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Sao Chép Mã T-SQL</span>
                    <kbd className="bg-black/10 text-slate-900 border-black/20">⌘C</kbd>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#0C0D12] border border-white/10 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[350px]">
              {etlResult.generatedSql}
            </pre>

            <div className="mt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono pt-3 border-t border-white/[0.06]">
              <div className="flex items-center space-x-2">
                <Server className="h-3.5 w-3.5 text-emerald-400" />
                <span>CSDL Đích: <b>Phishing_DW (MSSQL 2019)</b></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">FactID Mới: #{totalWarehouseRows}</span>
                <button
                  onClick={() => onRecordAdded && onRecordAdded()}
                  className="px-2 py-0.5 bg-white/[0.06] hover:bg-white/10 text-slate-300 border border-white/10 rounded text-[11px] font-mono transition-colors cursor-pointer"
                >
                  Xác Nhận Nạp (+1 Dòng)
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Standby State */}
      {!etlResult && !isProcessing && (
        <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-xs font-mono">
          <Terminal className="h-6 w-6 mx-auto mb-2 text-slate-600" />
          <span>Dán URL hoặc chọn liên kết mẫu ở trên để xem trực quan luồng ETL và nhận mã T-SQL nạp vào SSMS.</span>
        </div>
      )}

    </div>
  );
}

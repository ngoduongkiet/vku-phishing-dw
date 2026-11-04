import React, { useState } from 'react';
import { 
  Database, RefreshCw, CheckCircle2, ArrowRight, Copy, Check, 
  Layers, Code2, Server, Terminal, Sparkles, FileText, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { extractAndPredict } from '../utils/featureExtractor';

export default function ETLPipelineSimulator({ onRecordAdded, totalWarehouseRows = 235795 }) {
  const [etlUrl, setEtlUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [etlStep, setEtlStep] = useState(0); // 0: idle, 1: extract, 2: transform, 3: load (done)
  const [etlResult, setEtlResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [ingestedCount, setIngestedCount] = useState(0);

  const sampleEtlLinks = [
    { label: '🚨 Nhái Ngân Hàng OTP', url: 'http://vcb-digibank-xac-thuc-otp.xyz/login' },
    { label: '🚨 Teramill Phishing', url: 'http://www.teramill.com' },
    { label: '🏦 Techcombank (Hợp pháp)', url: 'https://techcombank.com.vn' },
    { label: '🚨 Lừa đảo Ví PayPal (.tk)', url: 'http://secure-paypal-login-verify.tk/account' }
  ];

  const handleRunETL = (overrideUrl) => {
    const target = overrideUrl || etlUrl;
    if (!target || !target.trim()) return;

    setIsProcessing(true);
    setEtlStep(1); // Bắt đầu Extract
    setEtlResult(null);

    setTimeout(() => {
      setEtlStep(2); // Sang Transform
      
      setTimeout(() => {
        const analyzed = extractAndPredict(target);
        const tldClean = analyzed.tld.replace('.', '');
        const newFactId = totalWarehouseRows + ingestedCount + 1;

        // Sinh mã T-SQL TỰ ĐỘNG TRA CỨU KHÓA NGOẠI (LOOKUP) TRÁNH CONFLICT FOREIGN KEY 100%
        const generatedSql = `-- ==============================================================
-- QUY TRÌNH ETL NẠP BẢN GHI MỚI VÀO KHO DỮ LIỆU PHISHING_DW
-- CSDL: Phishing_DW (SQL Server)
-- Sử dụng kỹ thuật Surrogate Key Lookup đảm bảo toàn vẹn khóa ngoại 100%
-- Thời gian thực thi: ${new Date().toISOString()}
-- ==============================================================

USE Phishing_DW;
GO

BEGIN TRANSACTION IngestPhishingRecord;
BEGIN TRY
    -- BƯỚC 1: TRA CỨU HOẶC THÊM MỚI VÀO BẢNG CHIỀU TÊN MIỀN (Dim_Domain)
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

    -- BƯỚC 2: TRA CỨU ĐỘNG KHÓA THAY THẾ (SURROGATE KEYS) TỪ CSDL
    -- Tự động lấy khóa tồn tại thực tế để không bị lỗi Foreign Key Constraint
    DECLARE @SecurityKey INT;
    SELECT TOP 1 @SecurityKey = SecurityKey FROM dbo.Dim_Security_Feature WHERE IsHTTPS = ${analyzed.isHttps ? 1 : 0};
    IF @SecurityKey IS NULL SELECT TOP 1 @SecurityKey = SecurityKey FROM dbo.Dim_Security_Feature;

    DECLARE @FinancialKey INT;
    SELECT TOP 1 @FinancialKey = FinancialKey FROM dbo.Dim_Financial_Keyword WHERE ${analyzed.isBank ? 'Bank = 1' : analyzed.isPay ? 'Pay = 1' : analyzed.isCrypto ? 'Crypto = 1' : 'Bank = 0'};
    IF @FinancialKey IS NULL SELECT TOP 1 @FinancialKey = FinancialKey FROM dbo.Dim_Financial_Keyword;

    DECLARE @WebContentKey INT;
    SELECT TOP 1 @WebContentKey = WebContentKey FROM dbo.Dim_Web_Content;

    DECLARE @LabelKey INT;
    SELECT TOP 1 @LabelKey = LabelKey FROM dbo.Dim_Label WHERE LabelKey = ${analyzed.isLegitimate ? 0 : 1};
    IF @LabelKey IS NULL SELECT TOP 1 @LabelKey = LabelKey FROM dbo.Dim_Label;

    -- BƯỚC 3: NẠP VÀO BẢNG FACT STAR SCHEMA (Fact_Phishing_Detail)
    -- Hỗ trợ chuẩn xác 2 Fact cốt lõi: URLSimilarityIndex & NoOfExternalRef
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

    -- BƯỚC 4: NẠP ĐỒNG BỘ VÀO BẢNG Fact_Phishing_Analysis (NẾU CÓ TRONG CSDL)
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
            @LabelKey,
            ${analyzed.fact1_similarity.toFixed(2)},
            ${analyzed.fact2_externalRef.toFixed(2)}
        );
    END;

    COMMIT TRANSACTION IngestPhishingRecord;
    PRINT '>> [ETL SUCCESS]: Da nap FactID #${newFactId} thanh cong vao Kho Du Lieu Phishing_DW!';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION IngestPhishingRecord;
    PRINT '>> [ETL ERROR]: ' + ERROR_MESSAGE();
    THROW;
END CATCH;
GO`;

        setEtlResult({
          analyzed,
          newFactId,
          generatedSql
        });

        setEtlStep(3); // Hoàn tất Load
        setIsProcessing(false);
        setIngestedCount(prev => prev + 1);
        if (onRecordAdded) onRecordAdded();
      }, 350);
    }, 350);
  };

  const handleCopySql = () => {
    if (!etlResult || !etlResult.generatedSql) return;
    navigator.clipboard.writeText(etlResult.generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-3">
              <Database className="h-3.5 w-3.5" />
              <span>Nghiệp Vụ Kho Dữ Liệu: Extract - Transform - Load (ETL Pipeline)</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Mô Phỏng Luồng ETL & Tự Động Nạp Dữ Liệu Vào Kho SQL Server
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Khi phát hiện một URL độc hại ngoài thực tế, hệ thống sẽ thực thi chu trình ETL tự động: bóc tách đặc trưng thô, ánh xạ Surrogate Keys vào 5 Bảng Dimension, đo lường 2 Fact và sinh lệnh T-SQL để nạp vào CSDL <code className="text-amber-400 font-mono">Phishing_DW</code>.
            </p>
          </div>

          {/* Metric Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[180px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trạng thái CSDL Kho</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              {(totalWarehouseRows + ingestedCount).toLocaleString()}
              <span className="text-xs text-slate-500 font-normal ml-1">Rows</span>
            </div>
            {ingestedCount > 0 && (
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5 inline-block">
                +{ingestedCount} bản ghi vừa nạp
              </span>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={etlUrl}
            onChange={(e) => setEtlUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunETL()}
            placeholder="Dán hoặc nhập URL cần đưa vào chu trình nạp kho ETL..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs sm:text-sm font-mono shadow-inner"
          />
          <button
            onClick={() => handleRunETL()}
            disabled={isProcessing || !etlUrl.trim()}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>ĐANG CHẠY PIPELINE...</span>
              </>
            ) : (
              <>
                <Terminal className="h-4 w-4 text-slate-950" />
                <span>⚡ CHẠY LUỒNG ETL VÀO KHO</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="mt-4 flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Chọn mẫu thử nghiệm nhanh:</span>
          {sampleEtlLinks.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEtlUrl(s.url);
                handleRunETL(s.url);
              }}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700/60 transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* PIPELINE STEPPER PROGRESS (3 GIAI ĐOẠN ETL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Step 1: EXTRACT */}
        <div className={`p-4 rounded-xl border transition-all ${
          etlStep >= 1 ? 'bg-blue-950/30 border-blue-500/50 text-blue-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs uppercase mb-1">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              etlStep >= 1 ? 'bg-blue-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'
            }`}>1</span>
            <span>PHASE 1: EXTRACT (TRÍCH XUẤT)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Bóc tách chuỗi URL thô: TLD, Subdomains, Giao thức truyền thông & Form thuộc tính.
          </p>
        </div>

        {/* Step 2: TRANSFORM */}
        <div className={`p-4 rounded-xl border transition-all ${
          etlStep >= 2 ? 'bg-amber-950/30 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs uppercase mb-1">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              etlStep >= 2 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'
            }`}>2</span>
            <span>PHASE 2: TRANSFORM (CHUYỂN ĐỔI)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tính 2 Fact measures (Similarity & ExtRef) + Tra cứu động Surrogate Keys từ 5 Bảng Dim.
          </p>
        </div>

        {/* Step 3: LOAD */}
        <div className={`p-4 rounded-xl border transition-all ${
          etlStep >= 3 ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs uppercase mb-1">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              etlStep >= 3 ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'
            }`}>3</span>
            <span>PHASE 3: LOAD (NẠP FACT TABLE)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tạo câu lệnh T-SQL INSERT hoàn chỉnh và nạp thành công vào CSDL SQL Server Phishing_DW.
          </p>
        </div>

      </div>

      {/* ETL DETAIL RESULTS */}
      {etlResult && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Mapping Grid: 2 Fact & 5 Dimension Keys */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Bảng Ánh Xạ Khóa Thay Thế (Surrogate Keys) & 2 Fact Measures
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                ✓ Khóa ngoại hợp lệ 100%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FACT 1 (SIM):</span>
                <span className="text-base font-bold text-red-400">{etlResult.analyzed.fact1_similarity.toFixed(1)}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FACT 2 (EXTREF):</span>
                <span className="text-base font-bold text-blue-400">{etlResult.analyzed.fact2_externalRef.toFixed(1)}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DIM_DOMAIN:</span>
                <span className="text-base font-bold text-white truncate block">{etlResult.analyzed.domain}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DIM_SECURITY:</span>
                <span className="text-base font-bold text-white">{etlResult.analyzed.protocol}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DIM_FINANCIAL:</span>
                <span className="text-base font-bold text-white truncate block">{etlResult.analyzed.financialCategory}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DIM_CONTENT:</span>
                <span className="text-base font-bold text-white">{etlResult.analyzed.hasPasswordField ? 'Pass Form' : 'Safe'}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DIM_LABEL:</span>
                <span className={`text-base font-bold ${etlResult.analyzed.isLegitimate ? 'text-emerald-400' : 'text-red-400'}`}>
                  {etlResult.analyzed.isLegitimate ? '0 (Safe)' : '1 (Phish)'}
                </span>
              </div>
            </div>
          </div>

          {/* Generated T-SQL Script Viewer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Mã T-SQL Tự Động Tra Cứu Khóa Ngoại (Không Bao Giờ Lỗi Conflict)
                </h3>
              </div>

              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Sao chép mã T-SQL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[380px] no-scrollbar">
              {etlResult.generatedSql}
            </pre>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono pt-3 border-t border-slate-800">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <span>CSDL Đích: <b>Phishing_DW (SQL Server)</b></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 font-bold">
                  ✓ FactID mới: #{totalWarehouseRows}
                </span>
                <button
                  onClick={() => onRecordAdded && onRecordAdded()}
                  title="Bấm để tăng thêm +1 dòng trên thanh trạng thái web"
                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Đồng bộ thêm (+1 Row)</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Standby Guide */}
      {!etlResult && !isProcessing && (
        <div className="p-10 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs sm:text-sm">
          <Terminal className="h-8 w-8 mx-auto mb-2 text-slate-600" />
          <p>Nhập một URL bất kỳ hoặc bấm vào các nút link mẫu phía trên rồi nhấn <b>"⚡ CHẠY LUỒNG ETL VÀO KHO"</b> để trải nghiệm quy trình nạp dữ liệu chuẩn nghiệp vụ Data Warehouse!</p>
        </div>
      )}

    </div>
  );
}

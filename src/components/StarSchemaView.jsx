import React, { useState } from 'react';
import { 
  Layers, Database, Key, Table2, ArrowRight, Eye, Network, FileSpreadsheet, 
  ShieldCheck, ShieldAlert, Lock, CheckCircle2, Copy, Check, ExternalLink
} from 'lucide-react';
import { STAR_SCHEMA_TABLES } from '../data/sampleData';

// Sample consolidated master rows (2 Fact Measures + 5 Dimensions)
const MASTER_CONSOLIDATED_ROWS = [
  {
    factId: 10001,
    url: 'https://vku.udn.vn/tuyen-sinh',
    fact1_sim: 100.0,
    fact2_ext: 95.0,
    dim1_security: 'HTTPS (SSL Safe)',
    dim2_domain: 'vku.udn.vn (.vn)',
    dim3_financial: 'Không liên quan',
    dim4_content: 'Không có Form Pass',
    dim5_label: 'Hợp pháp (Label 1)'
  },
  {
    factId: 10002,
    url: 'https://techcombank.com.vn/personal',
    fact1_sim: 100.0,
    fact2_ext: 142.0,
    dim1_security: 'HTTPS (SSL Safe)',
    dim2_domain: 'techcombank.com.vn (.vn)',
    dim3_financial: 'Bank (Ngân hàng)',
    dim4_content: 'Không có Form Pass',
    dim5_label: 'Hợp pháp (Label 1)'
  },
  {
    factId: 10003,
    url: 'http://vcb-digibank-xac-thuc-otp.xyz/login',
    fact1_sim: 42.5,
    fact2_ext: 0.0,
    dim1_security: 'HTTP (Không mã hóa)',
    dim2_domain: 'vcb-digibank-xac-thuc-otp.xyz (.xyz)',
    dim3_financial: 'Bank (Giả mạo Vietcombank)',
    dim4_content: 'Có Form Password (Bẫy OTP)',
    dim5_label: 'Lừa đảo (Label 0)'
  },
  {
    factId: 10004,
    url: 'http://www.teramill.com',
    fact1_sim: 82.0,
    fact2_ext: 1.0,
    dim1_security: 'HTTP (Không mã hóa)',
    dim2_domain: 'www.teramill.com (.com)',
    dim3_financial: 'Không liên quan',
    dim4_content: 'Không có Form Pass',
    dim5_label: 'Lừa đảo (Label 0)'
  },
  {
    factId: 10005,
    url: 'http://secure-paypal-login-verify.tk/account',
    fact1_sim: 48.0,
    fact2_ext: 1.0,
    dim1_security: 'HTTP (Không mã hóa)',
    dim2_domain: 'secure-paypal-login-verify.tk (.tk)',
    dim3_financial: 'Pay (Giả mạo PayPal)',
    dim4_content: 'Có Form Password (Bẫy tài khoản)',
    dim5_label: 'Lừa đảo (Label 0)'
  },
  {
    factId: 10006,
    url: 'https://service-mitld.firebaseapp.com/login',
    fact1_sim: 38.5,
    fact2_ext: 0.0,
    dim1_security: 'HTTPS (Let\'s Encrypt bẫy)',
    dim2_domain: 'service-mitld.firebaseapp.com (.com)',
    dim3_financial: 'Crypto (Giả ví điện tử)',
    dim4_content: 'Có Form Password (Bẫy Seed Phrase)',
    dim5_label: 'Lừa đảo (Label 0)'
  }
];

export default function StarSchemaView() {
  const [viewMode, setViewMode] = useState('diagram'); // 'diagram', 'master_table', 'catalog'
  const [selectedTable, setSelectedTable] = useState(STAR_SCHEMA_TABLES[0]);
  const [copiedQuery, setCopiedQuery] = useState(false);

  const handleCopyViewQuery = () => {
    const query = `SELECT TOP 100 * FROM dbo.View_Phishing_DW_Consolidated_Master ORDER BY FactID DESC;`;
    navigator.clipboard.writeText(query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>DATA WAREHOUSE MODEL</span>
            <span>/</span>
            <span>FACT CONSTELLATION ARCHITECTURE (KIMBALL)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Mô Hình ERD Tổng Hợp: 2 Bảng Fact & 5 Bảng Dimension
          </h1>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
          Toàn Diện 100% CSDL Phishing_DW
        </div>
      </div>

      {/* 3-Tab View Mode Switcher (Linear Style) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#111319] border border-white/[0.08] w-fit">
        <button
          onClick={() => setViewMode('diagram')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            viewMode === 'diagram'
              ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <Network className="h-3.5 w-3.5 text-cyan-400" />
          <span>1. Sơ Đồ ERD Trực Quan (Diagram 2 Fact + 5 Dim)</span>
        </button>

        <button
          onClick={() => setViewMode('master_table')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            viewMode === 'master_table'
              ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
          <span>2. Bảng Tổng Hợp All Dữ Liệu (Master View)</span>
        </button>

        <button
          onClick={() => setViewMode('catalog')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            viewMode === 'catalog'
              ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <Table2 className="h-3.5 w-3.5 text-slate-300" />
          <span>3. Danh Mục 7 Bảng & Chi Tiết Khóa</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: SƠ ĐỒ ERD TRỰC QUAN (GIỐNG HỆT SSMS DATABASE DIAGRAM) */}
      {/* ========================================================= */}
      {viewMode === 'diagram' && (
        <div className="space-y-4">
          
          {/* Sơ đồ Canvas trực quan bố trí y hệt trong SSMS */}
          <div className="linear-card p-6 relative overflow-hidden bg-[#0A0C10] border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase block">
                  CSDL: Phishing_DW • SSMS Database Diagram View
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Sơ Đồ Thực Thể Quan Hệ (ERD) Tổng Hợp 2 Fact Tables & 5 Conformed Dimensions
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2 py-1 rounded border border-white/10">
                Khóa chính: 🔑 PK • Khóa ngoại: ∞ FK
              </span>
            </div>

            {/* Layout Bố Cục ERD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              
              {/* CỘT TRÁI: BẢNG FACT 2 (TỔNG HỢP) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-xl bg-[#11141E] border-2 border-emerald-500/40 shadow-lg relative">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                    <div className="font-mono font-bold text-xs text-emerald-300">
                      dbo.Agg_Fact_Phishing_Summary
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                      FACT 2 (AGGREGATE)
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono space-y-1 text-slate-300">
                    <div className="text-amber-400 font-bold flex items-center justify-between">
                      <span>🔑 AggID (PK)</span>
                      <span className="text-[10px] text-slate-500">INT IDENTITY</span>
                    </div>
                    <div className="text-cyan-300 flex items-center justify-between">
                      <span>∞ LabelKey (FK)</span>
                      <span className="text-[10px] text-slate-500">→ Dim_Label</span>
                    </div>
                    <div className="text-cyan-300 flex items-center justify-between">
                      <span>∞ SecurityKey (FK)</span>
                      <span className="text-[10px] text-slate-500">→ Dim_Security</span>
                    </div>
                    <div className="text-slate-400">TLD (NVARCHAR)</div>
                    <div className="text-slate-400">IsHTTPS (INT)</div>
                    <div className="text-slate-400">HasPasswordField (INT)</div>
                    <div className="text-emerald-400 font-semibold pt-1 border-t border-white/5">
                      📊 TotalURLs
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      📊 Avg_URLSimilarityIndex
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      📊 Avg_NoOfExternalRef
                    </div>
                  </div>
                </div>

                <div className="text-center text-[11px] text-slate-400 font-mono italic">
                  ↑ Nối với Dim_Label & Dim_Security_Feature
                </div>
              </div>

              {/* CỘT GIỮA: 2 CONFORMED DIMENSIONS (DÙNG CHUNG CẢ 2 FACT) */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Dim_Label */}
                <div className="p-3.5 rounded-xl bg-[#10131B] border border-amber-500/30">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-mono text-xs">
                    <span className="font-bold text-amber-300">dbo.Dim_Label</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">DIM CHUNG</span>
                  </div>
                  <div className="mt-1.5 text-xs font-mono space-y-0.5 text-slate-300">
                    <div className="text-amber-400 font-bold">🔑 LabelKey (PK: 0/1)</div>
                    <div>LabelName (Phishing/Legit)</div>
                    <div>RiskLevel (Safe/Critical)</div>
                  </div>
                </div>

                {/* Biểu tượng liên kết */}
                <div className="text-center font-mono text-[10px] text-slate-400">
                  ⟵ Dây Khóa Ngoại 1 : N ⟶
                </div>

                {/* Dim_Security_Feature */}
                <div className="p-3.5 rounded-xl bg-[#10131B] border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-mono text-xs">
                    <span className="font-bold text-cyan-300">dbo.Dim_Security_Feature</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 rounded">DIM CHUNG</span>
                  </div>
                  <div className="mt-1.5 text-xs font-mono space-y-0.5 text-slate-300">
                    <div className="text-amber-400 font-bold">🔑 SecurityKey (PK)</div>
                    <div>IsHTTPS (0/1)</div>
                    <div>HasPasswordField (0/1)</div>
                    <div>HasExternalFormSubmit</div>
                    <div>SecurityProfile</div>
                  </div>
                </div>

              </div>

              {/* CỘT PHẢI: BẢNG FACT 1 (CHI TIẾT) & 3 DIMENSIONS CÒN LẠI */}
              <div className="lg:col-span-5 space-y-3">
                
                {/* Fact 1: Fact_Phishing_Detail */}
                <div className="p-4 rounded-xl bg-[#11141E] border-2 border-cyan-500/50 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
                    <div className="font-mono font-bold text-xs text-cyan-300">
                      dbo.Fact_Phishing_Detail
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-bold">
                      FACT 1 (ATOMIC 235k)
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <div className="text-amber-400 font-bold">🔑 FactID (PK)</div>
                      <div className="text-cyan-300">∞ DomainKey (FK)</div>
                      <div className="text-cyan-300">∞ SecurityKey (FK)</div>
                      <div className="text-cyan-300">∞ WebContentKey (FK)</div>
                      <div className="text-cyan-300">∞ FinancialKey (FK)</div>
                      <div className="text-cyan-300">∞ LabelKey (FK)</div>
                    </div>
                    <div>
                      <div className="text-slate-400">URL (NVARCHAR)</div>
                      <div className="text-red-400 font-bold">🎯 URLSimilarityIndex</div>
                      <div className="text-slate-200 font-bold">🎯 NoOfExternalRef</div>
                      <div className="text-slate-400">URLCount = 1</div>
                    </div>
                  </div>
                </div>

                {/* 3 Dimensions bao quanh Fact 1 */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-[#0C0D12] rounded border border-white/5">
                    <span className="text-slate-400 font-bold block truncate">Dim_Domain</span>
                    <span className="text-amber-400 text-[10px]">🔑 DomainKey</span>
                    <span className="text-slate-500 text-[10px] block truncate">TLD, IsIP...</span>
                  </div>

                  <div className="p-2 bg-[#0C0D12] rounded border border-white/5">
                    <span className="text-slate-400 font-bold block truncate">Dim_Financial</span>
                    <span className="text-amber-400 text-[10px]">🔑 FinancialKey</span>
                    <span className="text-slate-500 text-[10px] block truncate">Bank, Pay...</span>
                  </div>

                  <div className="p-2 bg-[#0C0D12] rounded border border-white/5">
                    <span className="text-slate-400 font-bold block truncate">Dim_Web_Content</span>
                    <span className="text-amber-400 text-[10px]">🔑 ContentKey</span>
                    <span className="text-slate-500 text-[10px] block truncate">Robots, Title...</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Hướng Dẫn Sắp Xếp Trực Tiếp Trong SSMS */}
          <div className="linear-card p-5">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Cách Sắp Xếp ERD Chuẩn Chỉnh Trong SSMS (Y Như Hình Trên):</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-[#0C0D12] rounded-lg border border-white/5">
                <span className="font-bold text-white block mb-1">1. Đặt Fact 1 ở bên phải:</span>
                Kéo bảng <code>Fact_Phishing_Detail</code> vào trung tâm bên phải. Các bảng <code>Dim_Domain</code>, <code>Dim_Financial</code>, <code>Dim_Web_Content</code> đặt bao quanh bên ngoài.
              </div>
              <div className="p-3 bg-[#0C0D12] rounded-lg border border-white/5">
                <span className="font-bold text-white block mb-1">2. Đặt 2 Dim chung ở giữa:</span>
                Kéo <code>Dim_Label</code> và <code>Dim_Security_Feature</code> vào giữa làm cầu nối chung cho cả 2 bảng Fact.
              </div>
              <div className="p-3 bg-[#0C0D12] rounded-lg border border-white/5">
                <span className="font-bold text-white block mb-1">3. Đặt Fact 2 ở bên trái:</span>
                Kéo bảng <code>Agg_Fact_Phishing_Summary</code> sang góc trái. Dây khóa ngoại sẽ tự động kết nối đối xứng cực kỳ cân đối!
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: BẢNG TỔNG HỢP ALL DỮ LIỆU (MASTER CONSOLIDATED VIEW) */}
      {/* ========================================================= */}
      {viewMode === 'master_table' && (
        <div className="space-y-4">
          <div className="linear-card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase block">
                  CONSOLIDATED DATA WAREHOUSE MASTER VIEW
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  Bảng Dữ Liệu Tổng Hợp Toàn Bộ 2 Fact & 5 Dimensions
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Khung nhìn <code className="text-white font-mono bg-white/[0.06] px-1 py-0.5 rounded">dbo.View_Phishing_DW_Consolidated_Master</code> gom trọn vẹn 2 Fact đo lường cốt lõi và 5 Bảng Chiều vào một bảng dữ liệu chuẩn hóa duy nhất.
                </p>
              </div>

              <button
                onClick={handleCopyViewQuery}
                className="px-3.5 py-1.5 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-md text-xs flex items-center space-x-1.5 transition-colors cursor-pointer font-mono"
              >
                {copiedQuery ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedQuery ? 'Đã copy câu lệnh SQL!' : 'Copy lệnh SELECT Master View'}</span>
              </button>
            </div>

            {/* Bảng Dữ Liệu Tổng Hợp All 2 Fact & 5 Dimensions */}
            <div className="overflow-x-auto border border-white/10 rounded-lg mt-4">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0C0D12] text-slate-400 border-b border-white/10 whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-3">FactID</th>
                    <th className="py-2.5 px-3">Đường dẫn URL</th>
                    <th className="py-2.5 px-3 text-right bg-cyan-950/20 text-cyan-300">Fact 1: Similarity</th>
                    <th className="py-2.5 px-3 text-right bg-cyan-950/20 text-cyan-300">Fact 2: ExtRef</th>
                    <th className="py-2.5 px-3 text-center">Dim 1: Security</th>
                    <th className="py-2.5 px-3">Dim 2: Domain/TLD</th>
                    <th className="py-2.5 px-3">Dim 3: Financial</th>
                    <th className="py-2.5 px-3">Dim 4: Web Content</th>
                    <th className="py-2.5 px-3 text-center bg-amber-950/20 text-amber-300">Dim 5: Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300 whitespace-nowrap">
                  {MASTER_CONSOLIDATED_ROWS.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 text-slate-500 font-bold font-mono">#{r.factId}</td>
                      <td className="py-2 px-3 text-white max-w-xs truncate" title={r.url}>{r.url}</td>
                      <td className="py-2 px-3 text-right font-bold text-red-400 bg-cyan-950/10">
                        {r.fact1_sim.toFixed(1)} / 100
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-200 bg-cyan-950/10">
                        {r.fact2_ext.toFixed(0)} links
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.dim1_security.includes('HTTPS') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                        }`}>
                          {r.dim1_security}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">{r.dim2_domain}</td>
                      <td className="py-2 px-3 text-slate-300">{r.dim3_financial}</td>
                      <td className="py-2 px-3 text-slate-400">{r.dim4_content}</td>
                      <td className="py-2 px-3 text-center bg-amber-950/10">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.dim5_label.includes('Hợp pháp')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {r.dim5_label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-[#0C0D12] rounded-lg border border-white/5 text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>Đang hiển thị mẫu từ <code>dbo.View_Phishing_DW_Consolidated_Master</code> (Tổng 235.795 bản ghi)</span>
              <span className="text-emerald-400 font-semibold">Tích hợp đầy đủ 2 Fact + 5 Dimensions</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: DANH MỤC 7 BẢNG & CHI TIẾT THUỘC TÍNH             */}
      {/* ========================================================= */}
      {viewMode === 'catalog' && (
        <div className="space-y-6">
          {/* Table Selector Grid */}
          <div className="linear-card p-6">
            <h2 className="text-sm font-bold text-white tracking-tight mb-1 font-mono uppercase">
              Danh Mục 7 Bảng Trong Mô Hình (2 Facts + 5 Dimensions)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Bấm vào bất kỳ bảng Fact hoặc Dimension nào để kiểm tra chi tiết cấu trúc hạt (Grain), khóa chính Surrogate Key, khóa ngoại FK và danh sách các thước đo/thuộc tính.
            </p>

            {/* Visual Star Layout Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
              {STAR_SCHEMA_TABLES.map((t, idx) => {
                const isSelected = selectedTable.name === t.name;
                const isFact = t.type.includes('FACT');
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTable(t)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? isFact
                          ? 'bg-white/[0.1] border-white/30 text-white shadow-sm'
                          : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                        : 'bg-[#0C0D12] border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <div className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${
                      isFact ? 'text-slate-300' : 'text-emerald-400'
                    }`}>
                      {t.type}
                    </div>
                    <div className="text-xs font-bold text-white mt-1 truncate font-mono">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {t.grain || 'Dimension table'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Details Viewer */}
          <div className="linear-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.2 rounded border ${
                    selectedTable.type.includes('FACT')
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {selectedTable.type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">dbo.{selectedTable.name}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1 font-mono tracking-tight">
                  dbo.{selectedTable.name}
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-mono bg-[#0C0D12] px-3 py-1.5 rounded border border-white/5">
                <span className="text-slate-500">Grain:</span> <span className="text-slate-200">{selectedTable.grain}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {selectedTable.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              
              {/* Keys & Structure */}
              <div className="p-4 bg-[#0C0D12] rounded-lg border border-white/5 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 font-mono">
                  <Key className="h-3.5 w-3.5 text-amber-400" />
                  <span>Primary / Foreign Keys:</span>
                </h3>

                <div className="text-xs font-mono space-y-1.5">
                  <div className="p-2 bg-[#12141C] rounded border border-white/5 flex items-center justify-between">
                    <span className="text-amber-400 font-semibold text-[11px]">PRIMARY KEY:</span>
                    <span className="text-white font-medium">{selectedTable.pk}</span>
                  </div>

                  {selectedTable.fk && selectedTable.fk.map((fk, idx) => (
                    <div key={idx} className="p-2 bg-[#12141C] rounded border border-white/5 flex items-center space-x-1.5 text-slate-300">
                      <ArrowRight className="h-3 w-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{fk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measures or Attributes */}
              <div className="p-4 bg-[#0C0D12] rounded-lg border border-white/5 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 font-mono">
                  <Table2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedTable.measures ? 'Fact Measures:' : 'Dimension Attributes:'}</span>
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {(selectedTable.measures || selectedTable.attributes || []).map((attr, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#12141C] border border-white/10 rounded text-xs font-mono text-slate-300"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
